import React from 'react';
import Blog from './Blog';

interface BlogData {
  id: number;
  image: string;
  author: string;
  title: string;
  description: string;
  date: string;
}

const BlogsComponent: React.FC = () => {
  const blogs: BlogData[] = [
    {
      id: 1,
      image: 'images/react.svg',
      author: 'John Doe',
      title: 'Example Title',
      description: 'This is a sample description for the blog post. This is a sample description for the blog post. This is a sample description for the blog post.',
      date: 'November 28, 2023',
    },
    {
      id: 2,
      image: 'images/react.svg',
      author: 'John Doe',
      title: 'Example Title',
      description: 'This is a sample description for the blog post. This is a sample description for the blog post. This is a sample description for the blog post.',
      date: 'November 28, 2023',
    },
    // Add more blog objects here for multiple posts
  ];

  return (
    <div className="container mx-auto mt-8">

      {blogs.map(blog => (
        <Blog
          key={blog.id}
          image={blog.image}
          author={blog.author}
          title={blog.title}
          description={blog.description}
          date={blog.date}
        />
      ))}
    </div>
  );
};

export default BlogsComponent;
