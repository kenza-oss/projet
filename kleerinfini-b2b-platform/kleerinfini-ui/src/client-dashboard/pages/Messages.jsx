import React, { useState, useEffect } from 'react';
import MessageBox from '../components/MessageBox';
import api from '../../api/axios';
import realTimeService from '../../services/RealTimeService';

// Icône Message
const MessageCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ConversationCard = ({ conversation, onClick, isSelected }) => {
  return (
    <div
      onClick={() => onClick(conversation)}
      className={`p-4 border-b border-gray-200 hover:bg-[#f5f2eb] cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-[#f5f2eb] border-orange-400' : ''
        }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
          <span className="text-lg font-bold text-orange-600">
            {conversation.name?.charAt(0) || "?"}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {conversation.name || "Utilisateur"}
            </h3>
            {conversation.unread > 0 && (
              <div className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {conversation.unread > 9 ? "9+" : conversation.unread}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate pr-2">
            {conversation.lastMessage || "Dernier message..."}
          </p>
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [conversationsData, setConversationsData] = useState([]); // Added missing state

  const fetchConversations = async () => {
    try {
      const res = await api.get("messages/");
      setConversationsData(res.data);
      setApiMessages(res.data);
    } catch (error) {
      console.error("Erreur chargement conversations", error);
    }
  };

  const [apiMessages, setApiMessages] = useState([]);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const res = await api.get("messages/");
        setApiMessages(res.data);
      } catch (e) { console.error(e); }
    };
    loadInitial();
  }, []);

  useEffect(() => {
    const unsubscribe = realTimeService.addListener((data) => {
      if (data.type === 'chat_message' || data.type === 'message_sent') {
        const msg = data.message;
        setApiMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev;
          return [msg, ...prev]; // Latest first
        });
      }
    });
    return unsubscribe;
  }, []);

  const conversations = React.useMemo(() => {
    const groups = {};
    const storedUser = localStorage.getItem('user');
    const myUuid = storedUser ? String(JSON.parse(storedUser)?.user_id || JSON.parse(storedUser)?.id).toLowerCase() : null;

    apiMessages.forEach(msg => {
      const cid = msg.conversation_id;
      if (!cid || !myUuid) return;

      const partnerUuid = msg.partner_uuid;
      const partnerName = msg.partner_name || "Utilisateur";

      // SKIP SELF-MESSAGING GUARD
      if (String(partnerUuid).toLowerCase() === String(myUuid).toLowerCase()) return;

      const senderUuid = String(msg.sender_uuid).toLowerCase();
      const isMe = senderUuid === myUuid;

      if (!groups[cid] || new Date(msg.timestamp) > new Date(groups[cid].timestamp)) {
        groups[cid] = {
          id: cid,
          partnerId: partnerUuid,
          name: partnerName,
          email: msg.partner_email || "",
          lastMessage: msg.content,
          unread: !msg.is_read && !isMe ? 1 : 0,
          timestamp: new Date(msg.timestamp)
        };
      } else if (!msg.is_read && !isMe) {
        groups[cid].unread += 1;
      }
    });

    const result = Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
    return result;
  }, [apiMessages]);

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedConversation(null);
  };

  // Quand on est en mode chat → afficher MessageBox
  if (showChat) {
    return (
      <MessageBox
        conversation={selectedConversation}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="fixed top-[100px] left-64 right-0 bottom-0 bg-[#f5f2eb] overflow-y-auto">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messagerie</h1>
              <p className="text-gray-600">Discutez avec vos producteurs</p>
            </div>
          </div>

          {/* Bouton nouveau message */}
          <button
            onClick={() => {
              setSelectedConversation(null); // pas de conversation choisie
              setShowChat(true); // ouvrir MessageBox
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            + Nouveau message
          </button>
        </div>
      </div>

      {/* Liste conversations */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {conversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onClick={handleConversationClick}
                isSelected={selectedConversation?.id === conversation.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
