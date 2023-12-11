


// import React, { useEffect, useState } from 'react';
// import { setAllBlogs, setSearchedBlogs, Blog } from "@/slices/blogsStateSlice";
// import { useAppDispatch, useAppSelector } from "@/hooks/useAppHooks";
// import { Link } from 'react-router-dom';
// import { useGetBlogsQuery, useSearchBlogsQuery } from "@/slices/blogApiSlice";
// import Loader from './Loader';


// const Blogstest = () => {
//   const dispatch = useAppDispatch();
//   const allBlogs: Blog[] = useAppSelector((state) => state.blog.allBlogs);
//   const userInfo = useAppSelector((state) => state.auth.userInfo)
//   const searchedBlogs: Blog[] = useAppSelector((state) => state.blog.searchedBlogs);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchButtonClicked, setSearchButtonClicked] = useState(false);

//   const { data: allBlogsData, isLoading: allBlogsLoading } = useGetBlogsQuery();
//   const { data: searchResults, isLoading: searchLoading, refetch: refetchSearch } = useSearchBlogsQuery(searchQuery);

//   useEffect(() => {
//     if (allBlogsData) {
//       const fetchedBlogs: Blog[] = allBlogsData.posts || [];
//       dispatch(setAllBlogs(fetchedBlogs));
//     }
//     setSearchQuery("");
//   }, [dispatch, allBlogsData]);

//   useEffect(() => {
//     if (searchResults) {
//       const fetchedBlogs: Blog[] = searchResults.posts || [];
//       dispatch(setSearchedBlogs(fetchedBlogs));

//     }

//   }, [dispatch, searchResults]);

//   const handleSearch = () => {
//     setSearchButtonClicked(true);
//     refetchSearch();
//   };

//   const renderBlogs = () => {
//     if (searchResults) {
//       return searchResults?.posts?.map((blog) => (
//         <div key={blog.id} className="mb-4">
//           <div className="border rounded-md p-4">
//             <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
//             {/* Render other blog details */}
//           </div>
//         </div>
//       ));
//     } else {
//       return allBlogsLoading ? (
//         <Loader />
//       ) : (
//         allBlogsData?.posts?.map((blog) => (
//           <div key={blog.id} className="mb-8 border w-full rounded-md p-4">
//             <Link to={`/blog/${blog.id}`} className="block mb-2">
//               <p>{blog.username}</p>
//               <h3 className="text-xl font-bold">{blog.title}</h3>
//             </Link>
//             <p>{blog.content}</p>

//           </div>
//         ))
//       );
//     }
//   };

//   return (
    // <div className="max-w-screen-lg mt-8 p-4 mx-auto">
    //   <div className="flex justify-center mb-4">
    //     <div className="flex w-3/4">
    //       <input
    //         type="text"
    //         placeholder="Search Blogs..."
    //         value={searchQuery}
    //         onChange={(e) => setSearchQuery(e.target.value)}
    //         className="border border-gray-300 rounded-l-md px-4 py-2 w-full"
    //       />
    //       <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md" onClick={handleSearch}>
    //         Search
    //       </button>
    //     </div>
    //   </div>

    //   <div className='space-y-4'>
    //     {renderBlogs()}
    //   </div>
    // </div>
//   );
// };

// export default Blogstest;

import React, { useEffect, useState } from 'react';
import { setAllBlogs, setSearchedBlogs, Blog } from "@/slices/blogsStateSlice";

import { useAppDispatch, useAppSelector } from "@/hooks/useAppHooks";
import { Link } from 'react-router-dom';
import { useGetBlogsQuery, useSearchBlogsQuery } from "@/slices/blogApiSlice";
import Loader from './Loader';
import debounce from 'lodash.debounce'; // Import lodash debounce
import { truncateContent } from '@/libs/utils';

const Blogstest = () => {
  const dispatch = useAppDispatch();
  const allBlogs: Blog[] = useAppSelector((state) => state.blog.allBlogs);
  const userInfo = useAppSelector((state) => state.auth.userInfo)
  const searchedBlogs: Blog[] = useAppSelector((state) => state.blog.searchedBlogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  

  const { data: allBlogsData, isLoading: allBlogsLoading } = useGetBlogsQuery();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // State for debounced search query

  // Debounce searchQuery changes and update debouncedSearchQuery
  useEffect(() => {
    const debounceTimeout = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 2000); // Adjust the debounce time as needed (300ms in this example)

    debounceTimeout();

    return () => {
      debounceTimeout.cancel(); // Cleanup debounce on unmount or re-render
    };
  }, [searchQuery]);

  const { data: searchResults, isLoading: searchLoading, refetch: refetchSearch, isFetching } = useSearchBlogsQuery(debouncedSearchQuery);

  useEffect(() => {
    if (allBlogsData) {
      const fetchedBlogs: Blog[] = allBlogsData.posts || [];
      dispatch(setAllBlogs(fetchedBlogs));
    }
    setSearchQuery("");
  }, [dispatch, allBlogsData]);

  useEffect(() => {
    if (searchResults) {
      const fetchedBlogs: Blog[] = searchResults.posts || [];
      dispatch(setSearchedBlogs(fetchedBlogs));
    }
  }, [dispatch, searchResults]);

  const handleSearch = () => {
    setSearchButtonClicked(true);
    refetchSearch();
  };

  //  const truncateContent = (content: string, maxLength: number): string => {
  //   if (content.length > maxLength) {
  //     return content.substring(0, maxLength) + '...'; // Adjust the ellipsis or add a 'Read more' link if needed
  //   }
  //   return content;
  // };

  const renderBlogs = () => {
    if (searchLoading) {
      return <p>Loading search</p>;
    }
    if (searchQuery && !searchLoading) {
      return searchedBlogs.map((blog) => (
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
      ));
    } else {
      return allBlogsLoading ? (
        <Loader />
      ) : (
        allBlogsData?.posts?.map((blog) => (
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
          </div>
        ))
      );
    }
  };
  
  return (
    <div className="max-w-screen-lg mt-8 p-4 mx-auto">

    <div className="flex justify-center mb-4">
      <div className="flex w-3/4">
        <input
          type="text"
          placeholder="Search Blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-l-md px-4 py-2 w-full"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md" onClick={handleSearch}>
        {searchLoading || isFetching ? "searching" : "search"}

        </button>
      </div>
    </div>

    <div className='space-y-4'>
      {renderBlogs()}
    </div>
  </div>
  );
};

export default Blogstest;