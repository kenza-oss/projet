import { BASE_HOST } from "../api/axios";

class RealTimeService {
    constructor() {
        this.socket = null;
        this.listeners = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this._userId = null;
        this._token = null;
    }

    _isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
    connect(userId, token) {
        if (!userId || !token) {
            console.warn("[WS] connect() called without userId or token — skipping.");
            return;
        }

        if (this._isTokenExpired(token)) {
            console.warn("[WS] Token is already expired — skipping WebSocket connection.");
            return;
        }

        this._userId = userId;
        this._token = token;

        if (this.socket) {
            this.socket.onclose = null; // Prevent reconnect loop
            this.socket.close();
        }

        const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const wsHost = window.location.host;
        const wsUrl = `${wsProtocol}//${wsHost}/ws/chat/${userId}/?token=${token}`;

        console.log(`[WS] Attempting connection to: ${wsUrl}`);
        try {
            this.socket = new WebSocket(wsUrl);
        } catch (e) {
            console.error("[WS] Failed to construct WebSocket:", e);
            return;
        }

        this.socket.onopen = () => {
            console.log("[WS] Connected successfully.");
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
            // 1000 is normal closure
            if (e.code === 1000) {
                console.log(`[WS] Disconnected cleanly.`);
                return;
            }
            console.warn(`[WS] Disconnected abnormally (Code: ${e.code}).`);

            // Codes 4001, 4003, 4008 usually denote auth failure
            const tokenRejected = e.code === 4001 || e.code === 4003 || e.code === 4008;
            if (!tokenRejected) {
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000); // Max 10s between retries
                    console.log(`[WS] Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                    setTimeout(() => {
                        // Check if we haven't manually closed before reconnecting
                        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
                            this.connect(this._userId, this._token);
                        }
                    }, delay);
                } else {
                    console.error("[WS] Max reconnect attempts reached. Giving up.");
                }
            } else {
                console.warn("[WS] Token rejected by server — not reconnecting.");
            }
        };

        this.socket.onerror = (err) => {
            console.error("[WS] WebSocket Error occurred. See Network tab for details.");
            try { this.socket.close(); } catch (e) { }
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
