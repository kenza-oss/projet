import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Send, User, Clock, Inbox } from 'lucide-react';
import axios from '../../api/axios';

const AdminMessages = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await axios.get('messages/');
                // Group by sender
                const msgs = Array.isArray(res.data) ? res.data : res.data.results || [];
                setConversations(msgs);
            } catch (err) {
                console.error('Error loading messages:', err);
                setConversations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const filtered = conversations.filter(m =>
        (m.sender_email || m.sender || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.content || m.message || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Messages</h1>
                    <p className="text-gray-400 text-sm font-medium mt-1">Tous les messages de la plateforme</p>
                </div>
                <div className="flex items-center gap-2 bg-[#26B99A]/10 text-[#26B99A] px-5 py-3 rounded-2xl font-bold text-sm">
                    <Inbox size={16} />
                    <span>{conversations.length} message(s)</span>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher un message ou expéditeur..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#26B99A]/20 transition-all"
                />
            </div>

            {/* Messages List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-[#26B99A] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center"
                >
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                        <MessageSquare size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Aucun message</h3>
                    <p className="text-gray-400 font-medium">
                        {searchQuery ? 'Aucun résultat pour cette recherche.' : 'Aucun message disponible pour le moment.'}
                    </p>
                </motion.div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    {filtered.map((msg, idx) => (
                        <motion.div
                            key={msg.id || idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="flex items-start gap-5 p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-all cursor-pointer group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-[#26B99A] to-blue-500 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0">
                                {(msg.sender_email || msg.sender || 'U')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-gray-900 text-sm">
                                            {msg.sender_email || msg.sender || 'Inconnu'}
                                        </span>
                                        {msg.is_read === false && (
                                            <span className="w-2 h-2 rounded-full bg-[#26B99A]" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 font-medium shrink-0">
                                        <Clock size={12} />
                                        <span>{formatDate(msg.created_at || msg.timestamp)}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 font-medium truncate">
                                    {msg.content || msg.message || 'Pas de contenu'}
                                </p>
                                {msg.receiver_email && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <Send size={10} className="text-gray-300" />
                                        <span className="text-[10px] text-gray-400 font-bold">À : {msg.receiver_email}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
