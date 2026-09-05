import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import socket from '../services/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { isAuthenticated, token, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token && user) {
      // Update socket auth credentials with the latest values before connecting
      socket.auth = {
        token,
        userId: user.id,
        username: user.username,
      };

      // Connect if not already connected
      if (!socket.connected) {
        socket.connect();
      }
    } else {
      // Disconnect when user logs out
      if (socket.connected) {
        socket.disconnect();
      }
    }

    return () => {
      // Cleanup on unmount (e.g., full page teardown)
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, token, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    console.warn('useSocket must be used within SocketProvider');
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketConnected = () => {
  const socketInstance = useSocket();
  const [connected, setConnected] = React.useState(false);
  
  React.useEffect(() => {
    if (!socketInstance) return;
    
    // Set initial state
    setConnected(socketInstance.connected);
    
    // Listen to connection changes
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);
    
    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
    };
  }, [socketInstance]);
  
  return connected;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketEmit = () => {
  const socketInstance = useSocket();
  
  return (eventName: string, data?: any) => {
    if (!socketInstance) {
      console.warn('Socket not connected');
      return;
    }
    socketInstance.emit(eventName, data);
  };
};

export default SocketContext;

