import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send, User, ShieldCheck, Dumbbell } from 'lucide-react';
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

        // Unirse a la sala general por defecto
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
            case 'admin': return <ShieldCheck className="w-3 h-3 text-red-500" />;
            case 'entrenador': return <Dumbbell className="w-3 h-3 text-blue-500" />;
            default: return <User className="w-3 h-3 text-gray-500" />;
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 border border-gray-100 flex flex-col mb-4 overflow-hidden h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Soporte GymTrack</h3>
                                    <p className="text-[10px] opacity-80">En línea ahora</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3"
                        >
                            {chat.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 text-xs italic">No hay mensajes. ¡Sé el primero en saludar!</p>
                                </div>
                            )}
                            {chat.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.username === user.nombre ? 'items-end' : 'items-start'}`}
                                >
                                    <div className="flex items-center gap-1 mb-1 px-1">
                                        {getRoleIcon(msg.role)}
                                        <span className="text-[10px] font-semibold text-gray-500 uppercase">{msg.username}</span>
                                    </div>
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${msg.username === user.nombre
                                                ? 'bg-orange-500 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                    <span className="text-[8px] text-gray-400 mt-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white p-2 rounded-xl transition-all shadow-lg shadow-orange-500/30 active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-orange-500 text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatSoporte;
