/**
 * ============================================================================
 * SOCKET.IO CLIENT SERVICE - Real-time Communication Manager
 * ============================================================================
 * 
 * This service manages the WebSocket connection to the backend.
 * It handles connection, disconnection, and event listeners.
 * 
 * WHY THIS EXISTS:
 * - Centralized socket management
 * - One instance across entire app
 * - Clean connection lifecycle
 * - Easy to add/remove event listeners
 * 
 * USAGE:
 * import { socket } from '@/services/socket';
 * 
 * socket.emit('EVENT_NAME', data);           // Send event
 * socket.on('EVENT_NAME', (data) => { ... }); // Listen for event
 * socket.disconnect();                        // Close connection
 * ============================================================================
 */

import io, { Socket } from 'socket.io-client';

/**
 * SOCKET.IO CLIENT INSTANCE
 * 
 * Connects to backend Socket.IO server
 * Uses environment variable for URL, falls back to localhost
 */
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

// Helper to parse stored user info
function getStoredUser(): { id?: string; username?: string } {
  try {
    const raw = localStorage.getItem('user');
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {};
}

export const socket: Socket = io(SOCKET_URL, {
  /**
   * CONFIGURATION OPTIONS
   */
  
  // Don't auto-connect — let SocketContext connect after auth is ready
  autoConnect: false,
  
  // Reconnect automatically
  reconnection: true,
  reconnectionDelay: 1000,      // Start with 1 second
  reconnectionDelayMax: 5000,   // Max 5 seconds between attempts
  reconnectionAttempts: 5,      // Try 5 times before giving up
  
  // Auth object — this is what backend reads via socket.handshake.auth
  auth: {
    token: localStorage.getItem('token') || '',
    userId: getStoredUser().id || '',
    username: getStoredUser().username || '',
  },

  // Include auth token in headers as well (for fallback)
  extraHeaders: {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
  
  // Timeout for connection
  timeout: 10000,
});

/**
 * CONNECTION EVENT HANDLERS
 * 
 * These run automatically when socket connects/disconnects
 */

/**
 * ✅ CONNECTED
 * Fired when WebSocket connection established
 */
socket.on('connect', () => {
  console.log(
    `%c✅ WebSocket Connected`,
    'color: green; font-weight: bold; font-size: 12px;'
  );
  console.log(`Socket ID: ${socket.id}`);
});

/**
 * ❌ DISCONNECTED
 * Fired when WebSocket connection lost
 */
socket.on('disconnect', (reason: string) => {
  console.log(
    `%c❌ WebSocket Disconnected - Reason: ${reason}`,
    'color: red; font-weight: bold; font-size: 12px;'
  );
});

/**
 * 🔄 RECONNECTING
 * Fired when attempting to reconnect
 */
socket.on('reconnecting', (attempt: number) => {
  console.log(
    `%c🔄 Attempting to reconnect... (Attempt ${attempt})`,
    'color: orange; font-weight: bold; font-size: 12px;'
  );
});

/**
 * ⚠️ ERROR
 * Fired when connection error occurs
 */
socket.on('error', (error: any) => {
  console.error(
    `%c⚠️ Socket Error: ${error?.message || 'Unknown error'}`,
    'color: red; font-weight: bold; font-size: 12px;',
    error
  );
});

/**
 * EXPORT SOCKET INSTANCE
 * 
 * Use this in components to:
 * - Listen to events: socket.on('EVENT', handler)
 * - Send events: socket.emit('EVENT', data)
 * - Check connection: socket.connected
 * - Get socket ID: socket.id
 */
export default socket;

/**
 * HELPER FUNCTIONS
 * ============================================================================
 * These provide convenient methods for common socket operations
 */

/**
 * Subscribe to an event
 * Auto-unsubscribe on component unmount (use in useEffect cleanup)
 * 
 * USAGE:
 * useEffect(() => {
 *   const cleanup = subscribeToEvent('POST_CREATED', (data) => {
 *     setPosts([data, ...posts]);
 *   });
 *   return cleanup;
 * }, []);
 */
export function subscribeToEvent(
  eventName: string,
  callback: (data: any) => void
): () => void {
  socket.on(eventName, callback);
  
  // Return cleanup function
  return () => {
    socket.off(eventName, callback);
  };
}

/**
 * Emit event with optional response
 * 
 * USAGE (no response):
 * emitEvent('TYPING_STARTED', { postId: '123' });
 * 
 * USAGE (with response):
 * const response = await emitEvent('REQUEST_DATA', { id: '123' });
 */
export function emitEvent(
  eventName: string,
  data?: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      socket.emit(eventName, data, (response: any) => {
        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Check if socket is connected
 * Useful for conditional rendering
 * 
 * USAGE:
 * {isConnected() && <OnlineIndicator />}
 */
export function isConnected(): boolean {
  return socket.connected;
}

/**
 * Get socket ID
 * Useful for debugging or server-side identification
 */
export function getSocketId(): string | undefined {
  return socket.id;
}

/**
 * Manually disconnect socket
 * Usually not needed (auto-disconnect on page close)
 */
export function disconnect(): void {
  if (socket.connected) {
    socket.disconnect();
    console.log('Socket manually disconnected');
  }
}

/**
 * Manually reconnect socket
 * Useful after user loses connection
 */
export function reconnect(): void {
  if (!socket.connected) {
    socket.connect();
    console.log('Socket reconnect initiated');
  }
}

/**
 * REAL-TIME EVENTS HANDLED BY THIS SERVICE
 * ============================================================================
 * 
 * Components can listen to these events using:
 * socket.on('EVENT_NAME', (data) => { ... });
 * 
 * OR use the subscribeToEvent() helper for automatic cleanup
 * 
 * EVENTS FROM BACKEND:
 * 
 * POST EVENTS:
 * - POST_CREATED: New post added
 * - POST_UPDATED: Post edited
 * - POST_DELETED: Post removed
 * 
 * LIKE EVENTS:
 * - POST_LIKED: User liked post
 * - POST_UNLIKED: User unliked post
 * 
 * COMMENT EVENTS:
 * - COMMENT_ADDED: New comment posted
 * - COMMENT_DELETED: Comment removed
 * - COMMENT_UPDATED: Comment edited
 * 
 * USER EVENTS:
 * - USER_ONLINE: User came online
 * - USER_OFFLINE: User went offline
 * - TYPING_STARTED: User typing
 * - TYPING_STOPPED: User stopped typing
 * 
 * TRENDING EVENTS:
 * - TRENDING_UPDATED: Trending list changed
 * - TREND_CREATED: Hashtag became trending
 * - TREND_REMOVED: Hashtag no longer trending
 */

/**
 * EVENTS WE CAN SEND TO BACKEND:
 * 
 * socket.emit('POST_FETCHED', { postId });
 * socket.emit('POST_DETAIL_CLOSED', { postId });
 * socket.emit('TYPING_STARTED', { postId });
 * socket.emit('TYPING_STOPPED', { postId });
 */
