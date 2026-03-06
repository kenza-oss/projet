import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ChevronRight } from 'lucide-react';
import { getMessages, createMessage } from '../../api/messages';
import { useAuth } from '../../context/AuthContext';
import realTimeService from '../../services/RealTimeService';
import VideoCallModal from '../../components/VideoCallModal';

const ClientMessaging = () => {
    const { user } = useAuth();
    const [apiMessages, setApiMessages] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [input, setInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch messages on mount
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const data = await getMessages();
                setApiMessages(data || []);
            } catch (error) {
                console.error("Erreur chargement messages:", error);
            }
        };
        fetchMessages();
    }, []);

    // RT Listener
    useEffect(() => {
        const unsubscribe = realTimeService.addListener((data) => {
            // Backend sends 'chat_message', not 'chat.message'
            if (data.type === 'chat_message' || data.type === 'message_sent') {
                setApiMessages(prev => {
                    const msg = data.message;
                    if (prev.find(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            }
        });
        return unsubscribe;
    }, []);

    // Group messages into conversations
    const conversations = useMemo(() => {
        const groups = {};
        // Revert to stripping dashes to match presumed backend/local mismatch (Fixes "Deleted" issue)
        const normId = (id) => String(id || '').replace(/-/g, '').toLowerCase();
        const myUuidNorm = normId(user?.user_id || user?.user || user?.id);

        const sortedMessages = [...apiMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        sortedMessages.forEach(msg => {
            // Robust Name & ID Logic: Don't rely solely on context-dependent backend fields
            const senderUuid = normId(msg.sender_uuid);
            const receiverUuid = normId(msg.receiver_uuid);
            const isMe = senderUuid === myUuidNorm;

            // Calculate partner ID locally to avoid backend context bugs (especially in RT)
            const partnerId = isMe ? receiverUuid : senderUuid;
            const groupKey = normId(partnerId);

            // SKIP SELF-MESSAGING GUARD & Empty key guard
            if (groupKey === myUuidNorm || !groupKey) return;

            if (!groups[groupKey]) {
                let partnerName, partnerEmail;

                if (isMe) {
                    partnerName = msg.receiver_name;
                    partnerEmail = msg.receiver_email;
                } else {
                    partnerName = msg.sender_name;
                    partnerEmail = msg.sender_email;
                }

                // Final fallbacks
                if (!partnerName || partnerName === "Utilisateur") {
                    partnerName = msg.partner_name || "Producteur";
                    partnerEmail = partnerEmail || msg.partner_email;
                }

                groups[groupKey] = {
                    id: partnerId, // Keep original ID for API calls if needed
                    name: partnerName,
                    lastMessage: msg.content,
                    time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    unread: 0,
                    online: true,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=random`,
                    messages: []
                };
            }

            groups[groupKey].messages.push({
                id: msg.id,
                content: msg.content,
                sender: isMe ? "me" : "them",
                time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date(msg.timestamp)
            });

            // Update last info
            if (!groups[groupKey].timestamp || new Date(msg.timestamp) > groups[groupKey].timestamp) {
                groups[groupKey].lastMessage = msg.content;
                groups[groupKey].time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                groups[groupKey].timestamp = new Date(msg.timestamp);
                if (!msg.is_read && !isMe) groups[groupKey].unread += 1;
            }
        });

        const result = Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
        return result;
    }, [apiMessages, user]);

    // Update active chat if null and conversations exist
    useEffect(() => {
        if (!activeChatId && conversations.length > 0) {
            setActiveChatId(conversations[0].id);
        }
    }, [conversations, activeChatId]);

    const activeChat = conversations.find(c => {
        const normId = (id) => String(id || '').replace(/-/g, '').toLowerCase();
        return normId(c.id) === normId(activeChatId);
    });

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || !activeChatId) return;

        const content = input;
        setInput("");

        try {
            await createMessage({
                receiver: activeChatId,
                content: content
            });
        } catch (err) {
            console.error("Failed to send message:", err);
            // Put input back if failed
            setInput(content);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages]);

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-200px)] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex font-inter relative">
            {/* Sidebar List */}
            <div className={`${activeChatId && !isSidebarVisible ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-gray-100 flex-col z-20 bg-white`}>
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Messagerie</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredConversations.length > 0 ? filteredConversations.map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => {
                                setActiveChatId(conv.id);
                                setIsSidebarVisible(false);
                            }}
                            className={`p-5 flex items-start gap-4 cursor-pointer transition-all border-l-4 ${activeChatId === conv.id ? 'bg-blue-50 border-blue-600' : 'hover:bg-gray-50 border-transparent'}`}
                        >
                            <div className="relative shrink-0">
                                <img src={conv.image} alt={conv.name} className="w-12 h-12 rounded-2xl object-cover shadow-sm" />
                                {conv.online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className={`text-sm truncate pr-2 ${activeChatId === conv.id ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{conv.name}</h4>
                                    <span className="text-[10px] text-gray-400 font-black">{conv.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate font-medium">{conv.lastMessage}</p>
                            </div>
                            {conv.unread > 0 && (
                                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-lg shadow-blue-200">
                                    {conv.unread}
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="p-10 text-center opacity-40">
                            <p className="text-xs font-black uppercase tracking-widest">Aucun message</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Window */}
            {activeChat ? (
                <div className={`${!isSidebarVisible ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col bg-[#FAFAFA] z-10`}>
                    {/* Chat Header */}
                    <div className="p-4 md:p-6 bg-white border-b border-gray-100 flex justify-between items-center z-10 sticky top-0">
                        <div className="flex items-center gap-3 md:gap-4">
                            <button
                                onClick={() => setIsSidebarVisible(true)}
                                className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl"
                            >
                                <ChevronRight className="rotate-180" size={20} />
                            </button>
                            <img src={activeChat.image} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl shadow-sm" />
                            <div>
                                <h3 className="font-black text-gray-900 uppercase tracking-tighter truncate max-w-[120px] md:max-w-none">{activeChat.name}</h3>
                                <p className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    En ligne
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1 md:gap-3 text-gray-400">
                            <button className="p-2 md:p-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all active:scale-95">
                                <Phone size={18} />
                            </button>
                            <button
                                onClick={() => setIsCallModalOpen(true)}
                                className="p-2 md:p-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all active:scale-95"
                            >
                                <Video size={18} />
                            </button>
                            <button
                                onClick={() => setIsRightPanelVisible(!isRightPanelVisible)}
                                className={`p-2 md:p-3 rounded-xl transition-all ${isRightPanelVisible ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 hover:text-gray-900'}`}
                            >
                                <MoreVertical size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto space-y-6 md:space-y-8 flex flex-col custom-scrollbar bg-slate-50/30">
                        <div className="flex justify-center">
                            <span className="text-[9px] font-black text-gray-400 bg-white border border-gray-100 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Aujourd'hui</span>
                        </div>

                        {activeChat.messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start items-end gap-3'}`}>
                                {msg.sender !== 'me' && (
                                    <img src={activeChat.image} className="w-8 h-8 rounded-xl shadow-sm mb-1 hidden sm:block" />
                                )}
                                <div className={`relative p-4 md:p-5 rounded-3xl max-w-[85%] md:max-w-md shadow-sm text-sm font-medium ${msg.sender === 'me'
                                    ? 'bg-blue-600 text-white rounded-tr-sm shadow-xl shadow-blue-500/10'
                                    : 'bg-white text-gray-700 rounded-tl-sm border border-gray-100'
                                    }`}>
                                    <p>{msg.content}</p>
                                    <p className={`text-[9px] mt-2 font-black uppercase tracking-widest text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="bg-gray-100/50 rounded-[2rem] flex items-center p-1.5 md:p-2 md:pr-4 border border-transparent focus-within:border-blue-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all">
                            <button type="button" className="p-2 md:p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Écrivez votre message..."
                                className="flex-1 bg-transparent border-none focus:ring-0 px-2 md:px-4 text-xs font-bold text-gray-900 placeholder:text-gray-400"
                            />
                            <button type="submit" className="p-2.5 md:p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className={`${!isSidebarVisible ? 'flex' : 'hidden md:flex'} flex-1 items-center justify-center bg-gray-50 opacity-30 select-none`}>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-gray-400">
                            <Send size={40} />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Sélectionnez une discussion</p>
                    </div>
                </div>
            )}

            {/* Right Details Panel - Mobile Overlay */}
            {activeChat && (
                <div className={`
                    fixed md:absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-100 flex flex-col z-30 transition-transform duration-300 shadow-2xl md:shadow-none
                    ${isRightPanelVisible ? 'translate-x-0' : 'translate-x-full'}
                `}>
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-black text-gray-900 uppercase tracking-tighter">Détails</h3>
                        <button
                            onClick={() => setIsRightPanelVisible(false)}
                            className="p-2 text-gray-400 hover:text-gray-900"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="p-8 text-center overflow-y-auto">
                        <img src={activeChat.image} className="w-24 h-24 rounded-[2rem] mx-auto mb-4 shadow-xl border-4 border-white" />
                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">{activeChat.name}</h4>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">Producteur</p>

                        <div className="space-y-4 text-left">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                <p className="text-xs font-bold text-gray-800 truncate">{activeChat.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Call Modal */}
            <VideoCallModal
                isOpen={isCallModalOpen}
                onClose={() => setIsCallModalOpen(false)}
                roomName={`kleerinfini-room-${[user?.id, activeChatId].sort().join('-').substring(0, 16)}`}
                displayName={user?.company_name || user?.email || 'Acheteur Kleerinfini'}
            />
        </div>
    );
};

export default ClientMessaging;
