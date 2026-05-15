import React, { createContext, useContext, type ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import socket from '../services/socket';

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
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
    socketInstance.on('connect', () => setConnected(true));
    socketInstance.on('disconnect', () => setConnected(false));
    
    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
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
