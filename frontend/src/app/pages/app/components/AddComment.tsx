import {
	Modal,
	ModalContent,
	ModalBody,
	ModalCloseButton,
	Button,
	Heading,
	ModalOverlay,
	ModalHeader,
	ModalFooter,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect } from 'react';
import TextAreaField from '../../../components/Form/TextAreaField';
import { SocketContext } from '../../../store/context/SocketContext';
import { Comment, Comment as CommentType } from '../../../config/types';
import BaseAlert from '../../../components/Alert/BaseAlert';
import useAlert from '../../../hooks/useAlert';

import styles from './addCommentStyles';
import axios from '../../../config/axios';

const commentSchema = Yup.object().shape({
	content: Yup.string().required('Comment cannot be empty!!'),
});

interface Props {
	post: string;
	isOpen: boolean;
	onClose: () => void;
	setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
	setNoOfComments: React.Dispatch<React.SetStateAction<number>>;
}

const AddComment: React.FC<Props> = ({
	post,
	isOpen,
	onClose,
	setComments,
	setNoOfComments,
}) => {
	const initialValues = {
		content: '',
		post,
	};
	const io = useContext(SocketContext);

	const { alertDetails, setAlert, isAlertOpen } = useAlert();

	useEffect(() => {
		if (post) {
			io.on(`comment-${post}`, (data: CommentType) => {
				setComments((prevProps: Comment[]) => [data, ...prevProps]);
				setNoOfComments((prevProps) => prevProps + 1);
			});
		}
	}, [io, post, setComments, setNoOfComments]);

	return (
		<>
			{isAlertOpen && <BaseAlert alertDetails={alertDetails} />}
			<Modal isOpen={isOpen} onClose={onClose} {...styles.container}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader>
						<Heading {...styles.heading}>Create Comment</Heading>
					</ModalHeader>
					<ModalBody>
						<Formik
							validationSchema={commentSchema}
							initialValues={initialValues}
							onSubmit={async ({ content }) => {
								try {
									await axios({
										method: 'POST',
										url: `/api/v1/posts/${post}/comments`,
										data: { content },
									});

									onClose();
								} catch (err) {
									let message = 'Something went wrong';
									if (err.response) {
										message = err.response.data.message;
									}
									setAlert('error', message);
								}
							}}>
							{({ isSubmitting }) => {
								return (
									<Form autoComplete='off'>
										<TextAreaField
											placeholder='Write your comment here...'
											label='Your Comment'
											name='content'
											className='placeholder'
											{...styles.textarea}
										/>
										<ModalFooter>
											<Button
												isLoading={isSubmitting}
												type='submit'
												{...styles.cta}>
												Submit
											</Button>
										</ModalFooter>
									</Form>
								);
							}}
						</Formik>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddComment;
