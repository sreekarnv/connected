import { useDisclosure } from '@chakra-ui/react';
import React from 'react';

export const UIContext = React.createContext<any | undefined>(undefined);

const UIContextProvider = ({ children }: any) => {
	const {
		isOpen: isCreatePostOpen,
		onOpen: onCreatePostOpen,
		onClose: onCreatePostClose,
	} = useDisclosure();
	const {
		isOpen: isCreateGroupOpen,
		onOpen: onCreateGroupOpen,
		onClose: onCreateGroupClose,
	} = useDisclosure();

	const {
		isOpen: isNotificationsOpen,
		onOpen: onNotificationsOpen,
		onClose: onNotificationsClose,
	} = useDisclosure();

	const value = {
		isCreatePostOpen,
		onCreatePostOpen,
		onCreatePostClose,
		isCreateGroupOpen,
		onCreateGroupOpen,
		onCreateGroupClose,
		isNotificationsOpen,
		onNotificationsOpen,
		onNotificationsClose,
	};

	return (
		<UIContext.Provider value={{ ...value }}>{children}</UIContext.Provider>
	);
};

export default UIContextProvider;
