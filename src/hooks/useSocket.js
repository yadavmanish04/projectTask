import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { storage } from '../utils/storage';

let socket;

export const useSocket = (projectId) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!socket) {
      socket = io(import.meta.env.VITE_SOCKET_URL || '/', {
        auth: { token: storage.getToken() },
        transports: ['websocket'],
      });
    }
    ref.current = socket;
    if (projectId) socket.emit('project:join', projectId);
    return () => {
      if (projectId) socket.emit('project:leave', projectId);
    };
  }, [projectId]);
  return ref.current;
};
