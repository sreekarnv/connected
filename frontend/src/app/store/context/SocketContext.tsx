import { createContext } from 'react';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL!, {
	withCredentials: true,
});

export const SocketContext = createContext<Partial<any>>(socket);

const SocketContextProvider = ({ children }: any) => {
	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export default SocketContextProvider;
