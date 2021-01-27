import { createContext } from 'react';
import { io } from 'socket.io-client';

const socket = io('/');

export const SocketContext = createContext<Partial<any>>(socket);

const SocketContextProvider = ({ children }: any) => {
	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export default SocketContextProvider;
