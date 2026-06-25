import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send, User, ShieldCheck, Dumbbell, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SOCKET_URL = 'http://localhost:3006';

const ChatSoporte = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [socket, setSocket] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('chat_history', (history) => {
            setChat(history);
        });

        newSocket.on('receive_message', (msg) => {
            setChat((prev) => [...prev, msg]);
        });

        newSocket.emit('join_room', {
            room: 'general',
            username: user.nombre || 'Usuario'
        });

        return () => newSocket.close();
    }, [user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.emit('send_message', {
                room: 'general',
                message,
                username: user.nombre,
                role: user.rol,
                timestamp: new Date().toISOString()
            });
            setMessage('');
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <ShieldCheck className="w-3.5 h-3.5 text-red-500" />;
            case 'entrenador': return <Dumbbell className="w-3.5 h-3.5 text-blue-500" />;
            default: return <User className="w-3.5 h-3.5 text-orange-500" />;
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-end">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom right' }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] w-[360px] sm:w-[400px] border border-white/20 flex flex-col mb-6 overflow-hidden h-[550px]"
                        >
                            {/* Header Premium */}
                            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-5 flex justify-between items-center text-white shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm">
                                            <MessageCircle size={22} className="text-white" />
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-orange-600 rounded-full"></span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base leading-tight tracking-tight">Soporte VIP</h3>
                                        <div className="flex items-center gap-1.5 opacity-90">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                            <p className="text-[11px] font-medium uppercase tracking-wider">Agentes en línea</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 p-2 rounded-xl transition-all active:scale-90"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            {/* Messages Container */}
                            <div
                                ref={scrollRef}
                                className="flex-1 p-5 overflow-y-auto bg-gray-50/50 space-y-4 custom-scrollbar"
                            >
                                {chat.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gradient-to-b from-transparent to-white/50 rounded-3xl">
                                        <div className="p-4 bg-orange-100 rounded-full mb-4">
                                            <Sparkles className="text-orange-500 w-8 h-8" />
                                        </div>
                                        <h4 className="text-gray-800 font-bold mb-1">¡Bienvenido a GymTrack!</h4>
                                        <p className="text-gray-500 text-xs leading-relaxed">¿En qué podemos ayudarte hoy? Nuestros entrenadores y soporte técnico están listos para responder.</p>
                                    </div>
                                ) : (
                                    chat.map((msg) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: msg.username === user.nombre ? 10 : -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={msg.id}
                                            className={`flex flex-col ${msg.username === user.nombre ? 'items-end' : 'items-start'}`}
                                        >
                                            <div className="flex items-center gap-1.5 mb-1.5 px-2">
                                                {getRoleIcon(msg.role)}
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{msg.username}</span>
                                            </div>
                                            <div
                                                className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all hover:shadow-md ${msg.username === user.nombre
                                                        ? 'bg-orange-500 text-white rounded-tr-none font-medium'
                                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                                    }`}
                                            >
                                                {msg.message}
                                            </div>
                                            <span className="text-[9px] text-gray-400 mt-1.5 font-medium italic">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-5 bg-white border-t border-gray-100 items-end">
                                <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Escribe tu consulta aquí..."
                                            className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all pr-12 text-gray-700"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim()}
                                            className="absolute right-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/40 active:scale-90"
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-center text-gray-400">GymTrack Support System v1.0 • Seguro y Privado</p>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Action Button (FAB) */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: isOpen ? 0 : 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative w-16 h-16 rounded-3xl shadow-[0_10px_30px_rgba(255,140,66,0.5)] flex items-center justify-center transition-all duration-500 group ${isOpen
                            ? 'bg-gray-900 text-white rounded-2xl'
                            : 'bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 text-white'
                        }`}
                >
                    {/* Ripple Effect for notification */}
                    {!isOpen && (
                        <>
                            <span className="absolute inset-0 rounded-3xl bg-orange-500 animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></span>
                            <span className="absolute -top-1 -right-1 bg-white p-1 rounded-full border-2 border-orange-500 shadow-md">
                                <span className="block w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
                            </span>
                        </>
                    )}

                    <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                        {isOpen ? <X size={28} strokeWidth={2.5} /> : <MessageCircle size={30} strokeWidth={2.5} fill="rgba(255,255,255,0.2)" />}
                    </div>
                </motion.button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }
            `}} />
        </div>
    );
};

export default ChatSoporte;
