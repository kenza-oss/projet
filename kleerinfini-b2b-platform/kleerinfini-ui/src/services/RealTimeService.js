import { BASE_HOST } from "../api/axios";

class RealTimeService {
    constructor() {
        this.socket = null;
        this.listeners = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect(userId, token) {
        if (this.socket) {
            this.socket.onclose = null; // Prevent reconnect loop
            this.socket.close();
        }

        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsHost = BASE_HOST.replace(/^https?:\/\//, "");
        const wsUrl = `${wsProtocol}//${wsHost}/ws/chat/${userId}/?token=${token}`;

        // console.log(`[WS] Connecting to ${wsUrl}`);
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            // console.log("[WS] Connected");
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("[WS] Message received:", data);

            // Play notification sound for incoming messages
            if (data.type === 'chat_message') {
                this.playNotificationSound();
            }

            this.listeners.forEach(listener => listener(data));
        };

        this.socket.onclose = (e) => {
            console.log(`[WS] Disconnected (Code: ${e.code})`);
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
                console.log(`[WS] Reconnecting in ${delay}ms...`);
                setTimeout(() => this.connect(userId, token), delay);
            }
        };

        this.socket.onerror = (err) => {
            console.error("[WS] Error:", err);
            this.socket.close();
        };
    }

    playNotificationSound() {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
            audio.play().catch(e => console.warn("[WS] Audio play blocked:", e));
        } catch (err) {
            console.error("[WS] Sound error:", err);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.onclose = null;
            this.socket.close();
            this.socket = null;
        }
    }

    addListener(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    sendMessage(receiverId, content) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                type: 'new_message',
                receiver_id: receiverId,
                content: content
            }));
        } else {
            console.warn("[WS] Socket not open. Message not sent.");
        }
    }
}

const realTimeService = new RealTimeService();
export default realTimeService;
