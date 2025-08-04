import { io } from 'socket.io-client';

const socket = io('http://wolfdesk.local:8000', {
  path: '/ws/socket.io',
  transports: ['websocket', 'polling'],
});

export default socket;
