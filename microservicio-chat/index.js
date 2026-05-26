import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // En producción, especificar el dominio del frontend
        methods: ["GET", "POST"]
    }
});

const PORT = 3006;

// Historial de mensajes en memoria (para persistencia simple mientras corre el servicio)
let messages = [];

io.on('connection', (socket) => {
    console.log(`[Chat] Usuario conectado: ${socket.id}`);

    // Enviar historial de mensajes al nuevo usuario
    socket.emit('chat_history', messages);

    // Unirse a una sala específica (admin, cliente, entrenador o general)
    socket.on('join_room', (data) => {
        const { room, username } = data;
        socket.join(room);
        console.log(`[Chat] ${username} se unió a la sala: ${room}`);

        // Notificar a la sala que alguien se unió
        socket.to(room).emit('user_joined', { username, room });
    });

    // Escuchar mensajes entrantes
    socket.on('send_message', (data) => {
        const { room, message, username, role, timestamp } = data;

        const newMessage = {
            id: Date.now(),
            username,
            role,
            message,
            timestamp: timestamp || new Date().toISOString(),
            room
        };

        // Guardar en historial
        messages.push(newMessage);
        if (messages.length > 100) messages.shift(); // Mantener solo los últimos 100

        // Emitir a todos en la sala (incluyendo al emisor)
        io.to(room).emit('receive_message', newMessage);
        console.log(`[Chat] [${room}] ${username}: ${message}`);
    });

    socket.on('disconnect', () => {
        console.log(`[Chat] Usuario desconectado: ${socket.id}`);
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Chat Real-Time', connected: io.engine.clientsCount });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Microservicio de Chat corriendo en http://localhost:${PORT}`);
});
