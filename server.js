const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Telegram Bot Configuration
const botToken = '7784972386:AAGmZwSekUBMAKDmf9OGwnHd5PVVj6t1ZHs';
const chatId = '-4730188164';

// Store connected clients
const clients = new Set();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// WebSocket connection handler
wss.on('connection', (ws) => {
    clients.add(ws);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            // Broadcast message to all WebSocket clients
            clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });

            // Send to Telegram if it's a message
            if (data.type === 'message') {
                sendToTelegramGroup(data.username, data.message);
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        clients.delete(ws);
    });
});

// Function to send message to the Telegram group
async function sendToTelegramGroup(username, encryptedMessage) {
    try {
        const text = `${username} says: ${encryptedMessage}`;
        console.log('Sending message to Telegram:', text);

        await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: text
        });

        console.log('Message sent to Telegram successfully!');
    } catch (error) {
        console.error('Error sending message to Telegram:', error.response ? error.response.data : error.message);
    }
}

// Legacy endpoint for direct message sending
app.post('/send-message', (req, res) => {
    const { username, message } = req.body;
    
    // Broadcast to WebSocket clients
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'message',
                username: username,
                message: message
            }));
        }
    });

    // Send to Telegram
    sendToTelegramGroup(username, message)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Failed to send message', details: error.message });
        });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});