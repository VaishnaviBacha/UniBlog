import { useState, useEffect } from 'react';
import { RiPencilLine } from 'react-icons/ri';
import { Blog } from "@/slices/blogsStateSlice";
import { useGetMyBlogQuery } from "@/slices/blogApiSlice";
import { Link } from 'react-router-dom';
import { truncateContent } from '@/libs/utils';

const MyBlogs = () => {
    const { data: myBlogsData, isLoading } = useGetMyBlogQuery();
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        if (myBlogsData && myBlogsData.posts) {
            setBlogs(myBlogsData.posts);
        }
    }, [myBlogsData]);

    const handleEditClick = (id: number) => {
        console.log(`Editing blog with ID: ${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto mt-6">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                blogs.map((blog: Blog) => (
                    <div key={blog.id} className="mb-8 border w-full rounded-md p-4 flex">
                        <div className="mr-4">
                            <img src="/images/blog-image.jpg" alt="Blog Image" className="w-40 h-auto" />
                        </div>
                        <Link to={`/blog/${blog.id}`} className="block mb-2">
                            <div>
                                <p>{blog.username}</p>
                                <h3 className="text-xl font-bold text-blue-500">{blog.title}</h3>
                                <p>{truncateContent(blog.content, 150)}</p>
                                {blog.content.length > 150 && (
                                    <Link to={`/blog/${blog.id}`} className="text-blue-500">
                                        Read more
                                    </Link>
                                )}
                            </div>
                        </Link>
                        <Link to={`/edit_post/${blog.id}`} className="ml-auto">
                            <button
                                onClick={() => handleEditClick(blog.id)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <RiPencilLine className="w-6 h-6" />
                            </button>
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyBlogs;
