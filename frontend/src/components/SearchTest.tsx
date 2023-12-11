// // import { setSearchedBlogs, Blog } from "@/slices/blogsStateSlice";
// // import { useAppDispatch, useAppSelector } from "@/hooks/useAppHooks";
// // import { useSearchBlogsQuery } from "@/slices/blogApiSlice";
// // import { useEffect, useState } from "react";
// // import { ChangeEvent } from 'react';


// // const SearchTest = () => {
// //   const dispatch = useAppDispatch();
// //   const [searchQuery, setSearchQuery] = useState('');

// //   const searchedBlogs: Blog[] = useAppSelector((state)=> state.blog.searchedBlogs)
  
// //   // Using the useSearchBlogsQuery hook to fetch data based on search query
// //   const { data: searchedBlogsData, isLoading, isError } = useSearchBlogsQuery(searchQuery); // Pass searchQuery here
// //   useEffect(() => {
// //     if (searchedBlogsData) {
// //         const fetchedBlogs: Blog[] = searchedBlogsData.posts || []; // Ensure posts exist and assign to fetchedBlogs
// //         dispatch(setSearchedBlogs(fetchedBlogs));
// //     }
    
// //   }, [dispatch, searchedBlogsData]);

// //   // Function to handle search query change
// //   const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
// //     setSearchQuery(event.target.value);
// //   };

// //   return (
// //     <div>
// //       <input
// //         type="text"
// //         value={searchQuery}
// //         onChange={handleSearchInputChange}
// //         placeholder="Search Blogs..."
// //       />
// //       {isLoading && <p>Loading...</p>}
// //       {isError && <p>Error fetching data</p>}
// //       {searchedBlogs && (
// //         <ul>
// //           {searchedBlogs.map((blog) => (
// //             <li key={blog.id}>{blog.title}</li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default SearchTest;
// // Assuming the useSearchBlogsQuery hook is defined in blogApiSlice


// import { useSearchBlogsQuery } from "@/slices/blogApiSlice";
// import { setSearchedBlogs, Blog } from "@/slices/blogsStateSlice";
// import { useAppDispatch, useAppSelector } from "@/hooks/useAppHooks";
// import { useEffect, useState } from "react";
// import { ChangeEvent } from 'react';


// import { FaSearch } from 'react-icons/fa'; // Assuming you're using React Icons or Font Awesome
// interface SearchQuery {
//     search_query: string;
//   }
  
// // ... (other imports and code)

// const SearchTest = () => {
//   const dispatch = useAppDispatch();
//   const [searchQuery, setSearchQuery] = useState<SearchQuery>({ search_query: '' });

//   const searchedBlogs: Blog[] = useAppSelector((state)=> state.blog.searchedBlogs)
  
//   const { data: searchedBlogsData, isLoading, isError } = useSearchBlogsQuery(searchQuery);
  

//   const handleSearchInputChange = (
//     event: ChangeEvent<HTMLInputElement>
//   ) => {
//     const { value } = event.target;
//     setSearchQuery({ search_query: value });
//   };

//   const handleSearch = () => {
  
//         if (searchQuery.search_query !== '') {
//             if (searchedBlogsData) {
//               const fetchedBlogs: Blog[] = searchedBlogsData.posts || [];
//               dispatch(setSearchedBlogs(fetchedBlogs));
//       // Perform the search when the search query is not empty
//       // You might want to consider additional validation or error handling here before triggering the search
//     }
//         }}

//   return (
//     <div>
//       <div style={{ display: 'flex' }}>
//         <input
//           type="text"
//           value={searchQuery.search_query}
//           onChange={handleSearchInputChange}
//           placeholder="Search Blogs..."
//         />
//         <button onClick={handleSearch}>
//           <FaSearch /> {/* React Icon for Search */}
//         </button>
//       </div>
//       {isLoading && <p>Loading...</p>}
//       {isError && <p>Error fetching data</p>}
//       {searchedBlogs && (
//         <ul>
//           {searchedBlogs.map((blog) => (
//             <li key={blog.id}>{blog.title}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchTest
