import React from 'react';

interface BlogProps {
  image: string;
  author: string;
  title: string;
  description: string;
  date: string;
}

const Blog: React.FC<BlogProps> = ({ image, author, title, description, date }) => {
  return (
    <div className="flex items-center mb-6  justify-center mx-4 lg:w-full  bg-gray-100 rounded-lg">
      <img src={image} alt={title} className="w-[70] h-[70] object-cover rounded-md mr-8 lg:w-80" />
      <div className="flex flex-col justify-center">
        <h2 className="text-2xl font-semibold mb-2 lg:text-3xl">{title}</h2>
        <p className="text-lg text-gray-600 mb-2 lg:text-xl">{author}</p>
        <p className="text-lg text-gray-800 mb-2 lg:text-xl">{description}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
};

export default Blog;
