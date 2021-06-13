import { useDisclosure } from '@chakra-ui/react';
import * as React from 'react';

interface PostContextProps {}

const PostContext = React.createContext<Partial<PostContextProps>>({});

const PostContextProvider: React.FC<PostContextProps> = ({ children }: any) => {
	const {
		isOpen: isCreatePostOpen,
		onOpen: onCreatePostOpen,
		onClose: onCreatePostClose,
	} = useDisclosure();

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
