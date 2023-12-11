import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetBlogsByIdQuery, useSaveBlogMutation } from "@/slices/blogApiSlice";
import { useAppDispatch, useAppSelector } from '@/hooks/useAppHooks';
import { setBlogsById, Blog } from '@/slices/blogsStateSlice';
import { BlogPost } from '@/slices/blogApiSlice';
import { useLikePostMutation, useCommentMutation } from '@/slices/blogApiSlice';
import { useState } from 'react';
import Loader from './Loader';
import { FaThumbsUp, FaComment, FaSave } from 'react-icons/fa'; // Import like and comment icons

const SingleBlog = () => {
    const { postId } = useParams<{ postId?: string }>()
    const blogsById: Blog[] = useAppSelector((state) => state.blog.blogsById);
    const dispatch = useAppDispatch();
    const postIdString = postId ?? '';
    const { data: blogByIdData, isLoading, isError } = useGetBlogsByIdQuery(postIdString);
    const [likePost, { isLoading: isLiking }] = useLikePostMutation()
    const [comment, { isLoading: isCommenting, isError: isCommentError, isSuccess }] = useCommentMutation()
    const [saveBlog, { isLoading: isSaving }] = useSaveBlogMutation()
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(blogByIdData?.post?.likes.length || 0);

    const [commentText, setCommentText] = useState('');
    const [showCommentForm, setShowCommentForm] = useState(false); // State to control modal/form visibility

    if (isLoading) {
        return <div><Loader /></div>;
    }

    if (isError) {
        return <div> ERROR No blog found</div>;
    }
    const handleLikeClick = async () => {
        try {
            const likeResponse = await likePost(postIdString); // Call the likePost mutation
            setLiked(true); // Update the state to indicate the post is liked

        } catch (error) {
            console.error('Error occurred while liking post:', error);
        }
    };
    const handleSaveClick = async () => {
        try {
            const saveResponse = await saveBlog(postIdString); // Call the likePost mutation



        } catch (error) {
            console.error('Error occurred while saving post:', error);
        }
    };
    const handleCommentSubmit = async () => {
        try {
            await comment({ postId: postIdString, commentText }); // Call the comment mutation with postId and comment text

            setCommentText(''); // Reset comment text after submission
            setShowCommentForm(false); // Close the comment form after submission
            // You might want to refresh the blog post data after adding the comment
        } catch (error) {
            console.error('Error occurred while submitting comment:', error);
        }
    };
    return (
        <div className=" mx-auto p-4">
            <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md">
                <h2 className="text-3xl font-bold mb-4">{blogByIdData?.post?.title}</h2>
                <p className="text-gray-700 mb-8">{blogByIdData?.post?.content}</p>

                <div className="flex flex-col  ">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleLikeClick}
                            className="flex items-center text-gray-600"
                        >
                            <FaThumbsUp className="w-5 h-5 mr-1 text-gray-500" />

                            {blogByIdData?.post?.likes.length} Like
                        </button>
                        <button
                            onClick={() => setShowCommentForm(true)}
                            className="flex items-center text-gray-600 hover:text-blue-500">
                            <FaComment className="w-5 h-5 mr-1" />
                            {blogByIdData?.post?.comments.length}Comment
                        </button>
                        <button
                            onClick={handleSaveClick}
                            className="flex items-center text-gray-600 hover:text-blue-500">
                            <FaSave className="w-5 h-5 mr-1" />
                            save
                        </button>
                    </div>
                </div>
                {showCommentForm && ( // Render the comment form/modal if showCommentForm is true
                    <div className='mt-4'>

                        {
                            blogByIdData?.post?.comments.map((comment, index) => (
                                <p
                                    key={index}
                                    className={`justify-start my-2 bg-blue-200`}
                                    style={{
                                        width: `${Math.max(comment.text.length * 8, 100)}px`,
                                        maxWidth: '80%',
                                        padding: '8px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {comment.text}
                                </p>
                            ))
                        }


                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your comment here..."
                            className="w-full h-24 border rounded p-2 mt-4"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={!commentText.trim()} // Disable button if commentText is empty or contains only whitespace
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        >
                            Submit Comment
                        </button>
                        <div className='text-left bg-red-500'>

                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleBlog;
