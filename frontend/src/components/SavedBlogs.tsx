import React from 'react';
import { useGetSavedBlogsQuery } from "@/slices/blogApiSlice";
import { truncateContent } from '@/libs/utils';
import { Link } from 'react-router-dom';
const SavedBlogs = () => {
  const { data: savedBlogsData, isLoading } = useGetSavedBlogsQuery();



  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Saved Blogs</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="max-w-screen-lg mt-8 p-4 mx-auto">
          {savedBlogsData?.saved_blogs.map((blog) => (
             <div key={blog.id} className="mb-8 border w-full rounded-md p-4 flex">
             <div className="mr-4">
               <img src= "/images/blog-image.jpg" alt="Blog Image" className="w-40 h-auto" />
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
           </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedBlogs;
