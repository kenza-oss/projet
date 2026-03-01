import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { createMessage, getMessagesByReceiver } from '../../api/messages';
import { useAuth } from '../../context/AuthContext';
import realTimeService from '../../services/RealTimeService';

const MessageBox = ({ conversation, onBack }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // partnerId is the User UUID of the producer
  const partnerId = conversation?.partnerId;
  const conversationId = conversation?.id; // The unique uuidA_uuidB

  // Fetch messages for this conversation
  useEffect(() => {
    if (partnerId) {
      const fetchMessages = async () => {
        try {
          const data = await getMessagesByReceiver(partnerId);
          setMessages(data || []);
        } catch (error) {
          console.error("Failed to fetch messages", error);
        }
      };
      fetchMessages();
    }
  }, [partnerId]);

  // WebSocket Listener
  useEffect(() => {
    const unsubscribe = realTimeService.addListener((data) => {
      if (data.type === 'chat_message' || data.type === 'message_sent') {
        const msg = data.message;
        const myUuid = String(user?.user_id || user?.user || user?.id).toLowerCase();

        // Strict check by conversation_id
        if (msg.conversation_id === conversationId) {
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      }
    });
    return unsubscribe;
  }, [conversationId, user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && partnerId) {
      try {
        await createMessage({
          receiver: partnerId,
          content: newMessage
        });
        setNewMessage('');
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const renderMessageContent = (msg) => {
    return <span>{msg.content}</span>;
  };

  // Scroll auto en bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const myUuid = String(user?.user_id || user?.user || user?.id);

  return (
    <div className="flex flex-col h-screen w-full bg-white fixed top-[100px] left-64 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-500 hover:text-orange-500 md:hidden">
            &larr;
          </button>
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
            {conversation?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{conversation?.name || "Discussion"}</h3>
            {/* <p className="text-xs text-gray-500">{conversation?.email || "En ligne"}</p> */}
          </div>
        </div>
      </div>

      {/* Zone messages */}
      <div className="flex-1 bg-gray-50 p-4 pb-32 overflow-y-auto custom-scrollbar">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((msg) => {
            const myUuid = String(user?.user_id || user?.user || user?.id).toLowerCase();
            const isMe = String(msg.sender_uuid).toLowerCase() === myUuid;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[70%] break-words shadow-sm ${isMe
                    ? 'bg-orange-100 text-gray-800 rounded-br-none font-medium'
                    : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                    }`}
                >
                  {renderMessageContent(msg)}
                  <div className={`text-[10px] mt-1 ${isMe ? 'text-orange-700/60' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Zone saisie */}
      <div className="absolute bottom-24 left-0 right-0 bg-white p-4 flex items-center gap-2 border-t shadow-lg z-30 mx-4 rounded-xl">
        <label className="cursor-pointer text-gray-400 hover:text-orange-500">
          <FaPaperclip className="text-xl" />
          <input type="file" className="hidden" />
        </label>
        <input
          type="text"
          className="flex-1 border-none bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-inner"
          placeholder={t('messageBox.inputPlaceholder') || "Écrivez votre message..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-orange-500/20"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
