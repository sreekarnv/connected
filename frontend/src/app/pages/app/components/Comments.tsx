import React, { useState } from 'react';
import {
	Box,
	Heading,
	Icon,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import AddComment from './AddComment';

import { ReactComponent as CommentIcon } from './../../../../assets/icons/comment.svg';
import { Comment as CommentType } from '../../../config/types';
import Comment from './Comment';

import styles from './commentsStyles';

interface Props {
	isOpen: boolean;
	post: string;
	onClose: () => void;
	comments: CommentType[];
	setNoOfComments: React.Dispatch<React.SetStateAction<number>>;
}

const Comments: React.FC<Props> = ({
	isOpen,
	onClose,
	post,
	comments: postComments,
	setNoOfComments,
}) => {
	const {
		isOpen: isAddCommentOpen,
		onClose: onAddCommentClose,
		onOpen: onAddCommentOpen,
	} = useDisclosure();

	const [comments, setComments] = useState<CommentType[]>(postComments);

	return (
		<>
			<AddComment
				setNoOfComments={setNoOfComments}
				post={post}
				isOpen={isAddCommentOpen}
				onClose={onAddCommentClose}
				setComments={setComments}
			/>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent {...styles.contentOuterBox}>
					<Box {...styles.contentInnerBox}>
						<ModalCloseButton />
						<ModalHeader {...styles.header}>
							<Heading color='primary.700' py={5}>
								Comments
							</Heading>
							<Tooltip aria-label='Add Comment' label='Add Comment'>
								<IconButton
									onClick={onAddCommentOpen}
									aria-label='Add Comment'
									{...styles.addCommentIcon}
									icon={<Icon color='#fff' as={CommentIcon} />}
								/>
							</Tooltip>
						</ModalHeader>
						<ModalBody>
							<VStack className='hide-scrollbar' {...styles.body}>
								{comments.map((c) => {
									return <Comment key={c._id} comment={c} />;
								})}
							</VStack>
						</ModalBody>
					</Box>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Comments;
