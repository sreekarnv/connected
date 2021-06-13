import * as React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface CreatePostProps {}

const CreatePost: React.FC<CreatePostProps> = ({}) => {
	const [text, setText] = React.useState('');

	return (
		<>
			<ReactQuill value={text} onChange={(value: any) => setText(value)} />
		</>
	);
};

export default CreatePost;
