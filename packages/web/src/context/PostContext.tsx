import { useDisclosure } from '@chakra-ui/react';
import * as React from 'react';

interface PostContextProps {
	isCreatePostOpen: boolean;
	onCreatePostOpen: () => void;
	onCreatePostClose: () => void;
}

export const PostContext = React.createContext<Partial<PostContextProps>>({});

const PostContextProvider: React.FC = ({ children }: any) => {
	const {
		isOpen: isCreatePostOpen,
		onOpen: onCreatePostOpen,
		onClose: onCreatePostClose,
	} = useDisclosure({
		isOpen: true,
	});

	return (
		<>
			<PostContext.Provider
				value={{
					isCreatePostOpen,
					onCreatePostOpen,
					onCreatePostClose,
				}}>
				{children}
			</PostContext.Provider>
		</>
	);
};

export default PostContextProvider;
