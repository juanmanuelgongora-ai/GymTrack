import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, Sparkles, Dumbbell, Salad, Zap, ChevronRight, Activity } from 'lucide-react';
import { useUser } from '../../logica/UserContext';

const API_URL = '/api';

const QUICK_TAGS = [
    { label: '💪 Ejercicios', prompt: 'Dame una rutina de ejercicios para hoy' },
    { label: '🥗 Dieta', prompt: '¿Qué debería comer para ganar músculo?' },
    { label: '🥩 Proteína', prompt: '¿Cuánta proteína necesito al día?' },
    { label: '🏃 Cardio', prompt: 'Recomiéndame ejercicios cardiovasculares' },
    { label: '😴 Descanso', prompt: '¿Cuántas horas de sueño necesito para recuperarme?' },
];

// Strips markdown symbols so FitBot responses look natural/human
function cleanMarkdown(text) {
    return text
        .replace(/#{1,6}\s?/g, '')          // remove # headers
        .replace(/\*\*(.*?)\*\*/g, '$1')    // remove **bold**
        .replace(/\*(.*?)\*/g, '$1')        // remove *italic*
        .replace(/__(.*?)__/g, '$1')        // remove __underline__
        .replace(/_(.*?)_/g, '$1')          // remove _italic_
        .replace(/`{1,3}[^`]*`{1,3}/g, '') // remove `code`
        .replace(/^---+$/gm, '')            // remove horizontal rules
        .replace(/\n{3,}/g, '\n\n')         // collapse triple+ newlines
        .trim();
}

function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';
    const rawContent = msg.content || '';
    const displayContent = isUser ? rawContent : cleanMarkdown(rawContent);
    const time = msg.created_at
        ? new Date(msg.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div style={{
            display: 'flex',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: '16px',
            gap: '12px',
            alignItems: 'flex-end',
        }}>
            {!isUser && (
                <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Bot size={20} color="#fff" />
                </div>
            )}
            <div style={{
                maxWidth: '70%',
                background: isUser
                    ? 'linear-gradient(135deg, #ff6b35, #ff8c42)'
                    : 'rgba(255,255,255,0.06)',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '12px 16px',
                border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
            }}>
                <p style={{
                    margin: 0, color: '#fff', fontSize: '14px', lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                }}>
                    {displayContent}
                </p>
                {time && (
                    <p style={{ margin: '6px 0 0 0', fontSize: '10px', color: isUser ? 'rgba(255,255,255,0.6)' : '#666', textAlign: 'right' }}>
                        {time}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ChatbotIATab({ token }) {
    const { userData } = useUser();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [error, setError] = useState('');
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    // Scroll to bottom when new message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Load history on mount
    useEffect(() => {
        if (!token) return;
        const load = async () => {
            try {
                const res = await fetch(`${API_URL}/ia/chat`, {
                    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (_) { }
            finally { setIsLoadingHistory(false); }
        };
        load();
    }, [token]);

    const sendMessage = async (text) => {
        const msg = text?.trim() || inputValue.trim();
        if (!msg || isLoading) return;
        setInputValue('');
        setError('');

        const userMsg = { role: 'user', content: msg, created_at: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        const userId = userData?.id || 'guest';
        const storageKey = `gymtrack_meals_${userId}`;
        const defaultMeals = [
            { id: 1, time: '07:00 AM', name: 'Desayuno', kcal: 620, p: 35, c: 65, g: 18 },
            { id: 2, time: '10:30 AM', name: 'Media Mañana', kcal: 280, p: 25, c: 30, g: 8 },
            { id: 3, time: '01:00 PM', name: 'Almuerzo', kcal: 850, p: 55, c: 70, g: 18 },
            { id: 4, time: '05:00 PM', name: 'Merienda Pre-Entreno', kcal: 320, p: 20, c: 45, g: 6 },
            { id: 5, time: '08:30 PM', name: 'Cena', kcal: 530, p: 45, c: 40, g: 12 }
        ];

        let mealsData = defaultMeals.map(m => ({ ...m, done: false }));
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.date === new Date().toDateString() && Array.isArray(parsed.meals)) {
                    mealsData = defaultMeals.map(meal => {
                        const savedMeal = parsed.meals.find(m => m.id === meal.id);
                        return savedMeal ? { ...meal, done: savedMeal.done } : { ...meal, done: false };
                    });
                }
            }
        } catch (e) {
            console.error("Error reading meals for chatbot context", e);
        }

        try {
            const res = await fetch(`${API_URL}/ia/chat`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ message: msg, meals: mealsData }),
            });

            if (!res.ok) {
                const err = await res.json();
                setError(err.error || 'Error al conectar con el asistente.');
                setMessages(prev => prev.slice(0, -1));
                return;
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'model', content: data.reply, created_at: data.created_at }]);
        } catch (_) {
            setError('No se pudo conectar con el asistente IA.');
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleClear = async () => {
        if (!window.confirm('¿Deseas borrar toda la conversación?')) return;
        try {
            await fetch(`${API_URL}/ia/chat/clear`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            });
            setMessages([]);
        } catch (_) { }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const initialWelcome = messages.length === 0 && !isLoadingHistory;

    return (
        <div className="tab-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', animation: 'fadeIn 0.4s ease' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: '14px',
                        background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
                    }}>
                        <Bot size={26} color="#fff" />
                    </div>
                    <div>
                        <h1 className="glow-text" style={{ margin: 0, fontSize: '24px' }}>Asistente IA Fitness</h1>
                        <p style={{ margin: '2px 0 0 0', color: '#888', fontSize: '13px' }}>
                            Pregúntame sobre ejercicios, nutrición, rutinas y alcanza tus objetivos
                        </p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="secondary-btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 14px', color: '#ef4444', borderColor: '#ef4444' }}
                    >
                        <Trash2 size={14} /> Limpiar
                    </button>
                )}
            </div>

            {/* Suggestion pill */}
            <div className="glass-panel" style={{ padding: '10px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderColor: 'rgba(255,107,53,0.3)' }}>
                <Sparkles size={16} color="#ff8c42" />
                <span style={{ color: '#aaa', fontSize: '13px' }}>
                    <span style={{ color: '#ff8c42', fontWeight: 600 }}>Sugerencias:</span> Pregúntame sobre ejercicios, dieta, rutinas, cardio, proteína
                </span>
            </div>

            {/* Chat area */}
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

                    {/* Loading history */}
                    {isLoadingHistory && (
                        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                            <Activity size={28} style={{ animation: 'pulse 1.5s infinite', marginBottom: 8 }} color="#ff6b35" />
                            <p style={{ margin: 0 }}>Cargando conversación...</p>
                        </div>
                    )}

                    {/* Welcome state */}
                    {initialWelcome && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0 40px', textAlign: 'center' }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: '50%', marginBottom: '20px',
                                background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 40px rgba(255,107,53,0.3)',
                            }}>
                                <Bot size={40} color="#fff" />
                            </div>
                            <h2 style={{ color: '#fff', marginBottom: '8px' }}>¡Hola! 👋</h2>
                            <p style={{ color: '#aaa', maxWidth: '500px', lineHeight: 1.6 }}>
                                Soy tu asistente de fitness personal con IA. Estoy aquí para ayudarte a alcanzar tus objetivos.
                                Puedo responder preguntas sobre ejercicios, nutrición, rutinas de entrenamiento y más.
                                <strong style={{ color: '#ff8c42' }}> ¿En qué puedo ayudarte hoy?</strong>
                            </p>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((msg, i) => (
                        <MessageBubble key={i} msg={msg} />
                    ))}

                    {/* Typing indicator */}
                    {isLoading && (
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                                background: 'linear-gradient(135deg, #ff6b35, #ff8c42)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Bot size={20} color="#fff" />
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '18px 18px 18px 4px', padding: '12px 20px',
                                display: 'flex', gap: '6px', alignItems: 'center',
                            }}>
                                {[0, 1, 2].map(d => (
                                    <div key={d} style={{
                                        width: 8, height: 8, borderRadius: '50%', background: '#ff6b35',
                                        animation: `bounce 1.2s infinite ${d * 0.2}s`,
                                    }} />
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '10px 16px', borderRadius: '10px', marginBottom: '12px', fontSize: '13px' }}>
                            {error}
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Input area */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* Quick tags */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {QUICK_TAGS.map((tag) => (
                            <button
                                key={tag.label}
                                onClick={() => sendMessage(tag.prompt)}
                                disabled={isLoading}
                                style={{
                                    padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                                    background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.3)',
                                    color: '#ff8c42', transition: 'all 0.2s', fontFamily: 'inherit',
                                    opacity: isLoading ? 0.5 : 1,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,53,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,53,0.1)'}
                            >
                                {tag.label}
                            </button>
                        ))}
                    </div>

                    {/* Text input row */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu pregunta sobre fitness, ejercicios o nutrición..."
                            disabled={isLoading}
                            rows={1}
                            style={{
                                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px',
                                fontFamily: 'inherit', resize: 'none', outline: 'none',
                                transition: 'border-color 0.2s',
                                minHeight: '48px', maxHeight: '120px',
                            }}
                            onFocus={e => e.target.style.borderColor = 'rgba(255,107,53,0.5)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <button
                            onClick={() => sendMessage()}
                            disabled={isLoading || !inputValue.trim()}
                            style={{
                                width: 48, height: 48, borderRadius: '12px', border: 'none', cursor: 'pointer',
                                background: inputValue.trim() && !isLoading
                                    ? 'linear-gradient(135deg, #ff6b35, #ff8c42)'
                                    : 'rgba(255,255,255,0.08)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s', flexShrink: 0,
                                boxShadow: inputValue.trim() && !isLoading ? '0 4px 16px rgba(255,107,53,0.4)' : 'none',
                            }}
                        >
                            <Send size={20} color={inputValue.trim() && !isLoading ? '#fff' : '#555'} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                    { icon: Dumbbell, title: 'Entrenamiento', desc: 'Obtén rutinas personalizadas, consejos de ejercicios y técnicas para maximizar tus resultados.', color: '#ff6b35' },
                    { icon: Salad, title: 'Nutrición', desc: 'Recibe planes de alimentación balanceados y consejos nutricionales adaptados a tus objetivos.', color: '#22c55e' },
                    { icon: Zap, title: 'IA Personalizada', desc: 'Nuestra IA aprende de tus preferencias y objetivos para darte respuestas cada vez más precisas.', color: '#3b82f6' },
                ].map(({ icon: Icon, title, desc, color }) => (
                    <div key={title} className="glass-panel hover-scale" style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => sendMessage(`Cuéntame más sobre ${title.toLowerCase()}`)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={18} color={color} />
                            </div>
                            <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>{title}</h4>
                        </div>
                        <p style={{ margin: 0, color: '#888', fontSize: '12px', lineHeight: 1.5 }}>{desc}</p>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
        </div>
    );
}
