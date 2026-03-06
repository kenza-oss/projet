import React, { useEffect, useState, useRef } from "react";
import {
    getMessages,
    getMessagesByReceiver,
    createMessage,
    markMessageAsRead,
} from "../../api/messages";
import {
    Search,
    Phone,
    Video,
    MoreVertical,
    Send,
    Smile,
    Paperclip,
    Image as ImageIcon,
    ChevronRight,
    Heart,
    ThumbsUp,
    Share2,
    Globe,
    Building2,
    MessageSquare,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import realTimeService from "../../services/RealTimeService";
import VideoCallModal from "../VideoCallModal";
import ClientPublicProfile from "../ClientPublicProfile";
import api from "../../api/axios";

// Mock conversations removed for production

const Messages = ({ messages: initialMessages = [] }) => {
    const { user } = useAuth();
    const [apiMessages, setApiMessages] = useState(initialMessages);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedClientProfile, setSelectedClientProfile] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isRightPanelVisible, setIsRightPanelVisible] = useState(false);
    const chatEndRef = useRef(null);

    // Fetch API messages on mount if not provided via props
    useEffect(() => {
        if (initialMessages.length === 0) {
            const fetchMessages = async () => {
                try {
                    const data = await getMessages();
                    setApiMessages(data || []);
                } catch (error) {
                    console.error("Erreur lors du chargement des messages:", error);
                }
            };
            fetchMessages();
        }
    }, [initialMessages]);

    // STRICT ROLE GUARD (Requested by User)
    if (user && user.role !== 'producer' && user.role !== 'admin') {
        return null;
    }

    // WebSocket Listener
    useEffect(() => {
        const unsubscribe = realTimeService.addListener((data) => {
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

    // Scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [apiMessages, selectedConversationId]);

    // Group real messages into conversations
    const conversations = React.useMemo(() => {
        if (!user) return [];

        const groups = {};
        // Use normId to strip dashes for consistent ID comparison
        const normId = (id) => String(id || '').replace(/-/g, '').toLowerCase();
        const myUuid = normId(user.user_id || user.user || user.id);

        apiMessages.forEach(msg => {
            const cid = msg.conversation_id;
            if (!cid) return;

            const partnerUuid = msg.partner_uuid;


            const senderUuid = normId(msg.sender_uuid);
            const isMe = senderUuid === myUuid;

            // SKIP SELF-MESSAGING GUARD

            // SKIP SELF-MESSAGING GUARD
            // Normalize partnerUuid for comparison
            // If the partner is ME, then it's a self-message (or bug). We should hide it.
            if (normId(partnerUuid) === myUuid) return;

            // Improved Name Logic: Don't rely solely on context-dependent partner_name
            // Determine who the partner is based on who sent the message
            let displayName, displayEmail;

            if (isMe) {
                // I sent it, so the partner is the receiver
                displayName = msg.receiver_name;
                displayEmail = msg.receiver_email;
            } else {
                // Someone else sent it, so they are the partner
                displayName = msg.sender_name;
                displayEmail = msg.sender_email;
            }

            // Final fallbacks
            if (!displayName || displayName === "Utilisateur") {
                displayName = msg.partner_name || "Client";
                displayEmail = displayEmail || msg.partner_email;
            }

            if (!groups[cid]) {
                groups[cid] = {
                    id: cid,
                    partnerId: partnerUuid,
                    name: displayName || "Utilisateur",
                    email: displayEmail || "",
                    lastMessage: "",
                    timestamp: new Date(0), // Start with epoch
                    time: "",
                    unread: 0,
                    online: true,
                    avatar: (displayName || "CL").substring(0, 2).toUpperCase(),
                    hasReceivedName: false
                };
            }

            if (groups[cid].name === "Utilisateur" || (!isMe)) {
                groups[cid].name = displayName;
                groups[cid].email = displayEmail || "";
                groups[cid].avatar = (displayName || "CL").substring(0, 2).toUpperCase();
            }

            // Update Last Message & Time
            if (new Date(msg.timestamp) > groups[cid].timestamp) {
                groups[cid].lastMessage = msg.content;
                groups[cid].timestamp = new Date(msg.timestamp);
                groups[cid].time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                // Ensure email persists if it was set
                if (!groups[cid].email) {
                    groups[cid].email = isMe ? msg.receiver_email : msg.sender_email;
                }
            }

            if (!msg.is_read && !isMe) {
                groups[cid].unread += 1;
            }

        });

        const result = Object.values(groups).sort((a, b) => b.timestamp - a.timestamp);
        return result;
    }, [apiMessages, user]);

    const activeConversationMessages = React.useMemo(() => {
        if (!selectedConversationId || !user) return [];
        const normId = (id) => String(id || '').replace(/-/g, '').toLowerCase();
        const myUuid = normId(user.user_id || user.user || user.id);

        return apiMessages
            .filter(msg => msg.conversation_id === selectedConversationId)
            .map(msg => ({
                id: msg.id,
                content: msg.content,
                sender: normId(msg.sender_uuid) === myUuid ? "me" : "them",
                time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date(msg.timestamp),
                type: "text"
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [apiMessages, selectedConversationId, user]);

    // Set initial selection if null
    useEffect(() => {
        if (!selectedConversationId && conversations.length > 0) {
            setSelectedConversationId(conversations[0].id);
        }
        // Clear profile when switching conversations
        setSelectedClientProfile(null);
    }, [conversations, selectedConversationId]);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!input && !file) return;

        if (!selectedConversation?.partnerId) {
            console.error("❌ No partner ID found!");
            return;
        }

        try {
            setLoading(true);
            // Send via API - strictly NO redirects here
            await createMessage({
                receiver: selectedConversation.partnerId,
                content: input
            });

            console.log("✅ Message sent successfully");
            setInput("");
            setFile(null);
        } catch (error) {
            console.error("❌ Failed to send message:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClientProfile = async (clientId) => {
        setLoading(true);
        try {
            const response = await api.get(`/client-profiles/${clientId}/`);
            setSelectedClientProfile(response.data);
            setIsProfileModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch client profile:", error);
            setSelectedClientProfile({
                company_name: selectedConversation.name,
                email: selectedConversation.email,
                is_verified: false
            });
            setIsProfileModalOpen(true);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-200px)] flex gap-0 font-inter overflow-hidden rounded-2xl shadow-2xl border border-slate-200 bg-white relative">
            {/* Left Sidebar - Chat List */}
            <div className={`${selectedConversationId && !isSidebarVisible ? 'hidden md:flex' : 'flex'} w-full md:w-80 bg-[#1E293B] flex-col z-20`}>
                {/* Header */}
                <div className="p-6 border-b border-slate-700/50">
                    <h2 className="text-white text-2xl font-bold mb-4 tracking-tight">Chats</h2>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white text-sm placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredConversations.length > 0 ? (
                        filteredConversations.map((conversation) => {
                            const isActive = selectedConversation?.id === conversation.id;
                            return (
                                <div
                                    key={conversation.id}
                                    onClick={() => {
                                        setSelectedConversationId(conversation.id);
                                        setIsSidebarVisible(false);
                                    }}
                                    className={`p-4 border-b border-slate-700/30 cursor-pointer transition-all ${isActive ? 'bg-slate-700/50' : 'hover:bg-slate-700/20'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                {conversation.avatar}
                                            </div>
                                            {conversation.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1E293B]"></div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="overflow-hidden">
                                                    <h3 className="text-white font-semibold text-sm truncate">{conversation.name}</h3>
                                                    {conversation.email && <p className="text-slate-500 text-[10px] truncate">{conversation.email}</p>}
                                                </div>
                                                <span className="text-slate-400 text-xs whitespace-nowrap ml-2">{conversation.time}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-slate-400 text-xs truncate flex-1">{conversation.lastMessage}</p>
                                                {conversation.unread > 0 && (
                                                    <span className="ml-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        {conversation.unread}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
                            <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center text-slate-500 mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-slate-300 font-bold">Aucune discussion</h3>
                            <p className="text-slate-500 text-xs mt-1">Vos messages apparaîtront ici dès qu'un client vous contactera.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Center - Chat Window */}
            <div className={`${!selectedConversationId || (!isSidebarVisible && selectedConversationId) ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col bg-white z-10`}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-4 md:px-8 py-4 md:py-5 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-30">
                            <div className="flex items-center gap-3 md:gap-4">
                                <button
                                    onClick={() => setIsSidebarVisible(true)}
                                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                                >
                                    <ChevronRight className="rotate-180" size={20} />
                                </button>
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                                        {selectedConversation.avatar}
                                    </div>
                                    {selectedConversation.online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-slate-900 font-bold text-base">{selectedConversation.name}</h3>
                                    {/* <p className="text-slate-500 text-[10px]">{selectedConversation.email}</p> */}
                                    <p className="text-slate-500 text-xs flex items-center gap-1">
                                        {selectedConversation.online && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                                        {selectedConversation.online ? "Online" : "Offline"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="p-3 rounded-xl hover:bg-slate-100 text-slate-600 transition-all">
                                    <Phone size={20} />
                                </button>
                                <button onClick={() => setIsCallModalOpen(true)} className="p-3 rounded-xl hover:bg-slate-100 text-slate-600 transition-all">
                                    <Video size={20} />
                                </button>
                                <button
                                    onClick={() => setIsRightPanelVisible(!isRightPanelVisible)}
                                    className={`p-3 rounded-xl transition-all ${isRightPanelVisible ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
                                >
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F8FAFC] space-y-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-white px-4 py-1.5 rounded-full text-xs text-slate-500 font-medium border border-slate-200 shadow-sm">
                                    Today
                                </div>
                            </div>

                            {activeConversationMessages.map((msg) => {
                                const isSent = msg.sender === "me";
                                return (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[70%] ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                                            {!isSent && (
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                    {selectedConversation.avatar}
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <div className={`px-5 py-3 rounded-2xl ${isSent ? 'bg-blue-600 text-white rounded-tr-md shadow-lg' : 'bg-white text-slate-900 border border-slate-200 rounded-tl-md shadow-sm'}`}>
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                </div>
                                                <p className={`text-[10px] text-slate-400 px-2 ${isSent ? 'text-right' : 'text-left'}`}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-slate-200">
                            <form onSubmit={sendMessage} className="flex items-center gap-3">
                                <button type="button" className="p-3 rounded-xl hover:bg-slate-100 text-slate-500 transition-all">
                                    <Paperclip size={20} />
                                </button>
                                <button type="button" className="p-3 rounded-xl hover:bg-slate-100 text-slate-500 transition-all" onClick={() => document.getElementById('file-upload').click()}>
                                    <ImageIcon size={20} />
                                </button>
                                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />

                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-5 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all"
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-all">
                                        <Smile size={18} />
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || (!input && !file)}
                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#F8FAFC] text-center p-12">
                        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-blue-100 mb-6">
                            <Send size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Vos Messages</h2>
                        <p className="text-slate-500 mt-2 max-w-sm text-center font-medium">
                            Sélectionnez une discussion pour commencer à échanger avec vos clients.
                        </p>
                    </div>
                )}
            </div>

            {/* Right Sidebar - Contact Details */}
            {selectedConversation && (
                <div className={`${isRightPanelVisible ? 'flex translate-x-0' : 'hidden md:hidden lg:flex translate-x-full lg:translate-x-0'} fixed lg:relative right-0 top-0 bottom-0 w-80 bg-white border-l border-slate-200 flex flex-col overflow-y-auto z-40 shadow-2xl lg:shadow-none transition-transform duration-300`}>
                    {/* Header for mobile Right Panel */}
                    <div className="lg:hidden p-4 border-b flex justify-between items-center">
                        <span className="font-bold text-sm">Détails</span>
                        <button onClick={() => setIsRightPanelVisible(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>
                    {/* Contact Profile */}
                    <div className="p-8 text-center border-b border-slate-200">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-xl">
                                {selectedConversation.avatar}
                            </div>
                            {selectedConversation.online && (
                                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                            )}
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg mb-1">{selectedConversation.name}</h3>
                        <p className="text-slate-500 text-sm mb-6">{selectedConversation.role}</p>

                        {/* Action Buttons */}
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => fetchClientProfile(selectedConversation.partnerId)} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200">
                                <Building2 size={14} /> Profil Business
                            </button>
                            <button onClick={() => setIsCallModalOpen(true)} className="p-2.5 bg-[#F8FAFC] text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-200 transition-all flex items-center justify-center border border-slate-100">
                                <Video size={16} />
                            </button>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex justify-between items-center mb-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                            <h4 className="text-slate-900 font-bold text-sm">About</h4>
                            <ChevronRight size={16} className="text-slate-400" />
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            Professional contact from your business network. Connect for trade opportunities and collaboration.
                        </p>
                    </div>

                </div>
            )}

            {/* Video Call Modal */}
            <VideoCallModal
                isOpen={isCallModalOpen}
                onClose={() => setIsCallModalOpen(false)}
                roomName={`kleerinfini-room-${[user?.id, selectedConversationId].sort().join('-').substring(0, 16)}`}
                displayName={user?.company_name || user?.email || 'Expert Kleerinfini'}
            />
            {/* Client Business Card Modal */}
            <ClientPublicProfile
                profile={selectedClientProfile}
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
};

export default Messages;
