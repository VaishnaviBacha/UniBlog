import React, { useState, useEffect } from 'react';
import { useGetDepartmentsQuery } from '@/slices/blogApiSlice';
import { useGetBlogsByDepartmentNameQuery } from '@/slices/blogApiSlice';
import { truncateContent } from '@/libs/utils';
import { setBlogsByDepartment,Blog } from '@/slices/blogsStateSlice';
import { GetBlogsResponse } from '@/slices/blogApiSlice';
import { useAppDispatch,useAppSelector } from '@/hooks/useAppHooks';
import debounce from 'lodash.debounce'; // Import lodash debounce
// interface CourseCategoriesProps {}
import { Link } from 'react-router-dom';
import Loader from './Loader';
interface Course {
    course_id: number;
    course_name: string;
}

interface Department {
    department_id: number;
    department_name: string;
    courses: Course[];
}

const CourseCategories= () => {
    const [selectedDepart, setSelectedDepart] = useState<string>("");
    const [departmentalBlogs,setDepatmentalBlogs] = useState<Blog[]>([])
    const { data: departmentsData, isLoading } = useGetDepartmentsQuery();
 // Always call the hook, but conditionally pass the department name
 const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(""); // State for debounced search query


 const { data: blogsByDepartment, isLoading: blogsLoading, isFetching, refetch } = useGetBlogsByDepartmentNameQuery(selectedDepart)
    

   const dispatch = useAppDispatch()
   const departmentBlogs: Blog[] = useAppSelector((state)=> state.blog.blogsByDepartment)
   
    
    const handleCategorySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value; // Get the string value directly
        if (selectedDepart !== "" ) {
            refetch()
            setDepatmentalBlogs(blogsByDepartment?.posts || []);
          }
        setSelectedDepart(selectedValue);
        console.log("departmentalblogs",departmentalBlogs.length)
    };
    
    useEffect(() => {
        if (!blogsLoading && blogsByDepartment) {
            setDepatmentalBlogs(blogsByDepartment?.posts || []);
        }
    }, [blogsByDepartment, blogsLoading]);

    const selectedDepartment = departmentsData?.departments.find(
        (dept) => dept.department_name === selectedDepart

    );


    useEffect(() => {
        const debounceTimeout = debounce(() => {
          setDebouncedSearchQuery(selectedDepart);
        }, 3000); 
    
        debounceTimeout();
    
        return () => {
          debounceTimeout.cancel(); // Cleanup debounce on unmount or re-render
        };
      }, [selectedDepart]);
     

    return (
        <div className="flex flex-col mt-8 w-full">
        <h2 className="text-xl font-semibold mb-4">Course Departments</h2>
        <div className="flex flex-col sm:flex-row justify-between items-start">
            <select
                onChange={handleCategorySelect}
                value={selectedDepart}
                className="block mb-4 sm:mb-0 appearance-none w-full sm:w-auto bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
                <option value="">Select a Department</option>
                {isLoading ? (
                    <option value="">Loading...</option>
                ) : (
                    departmentsData?.departments.map((department) => (
                        <option key={department.department_id} value={department.department_name}>
                            {department.department_name}
                        </option>
                    ))
                )}
            </select>
            {selectedDepartment && (
                <div className="flex  w-full ">
                    {selectedDepartment.courses.map((course) => (
                        <div key={course.course_id} className="m-2 p-3 rounded-lg bg-slate-400 ">
                            <p>{course.course_name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
        {blogsLoading  && (
            <Loader/>
        ) }
        {blogsByDepartment && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Blogs in {selectedDepart}</h3>
                    {blogsByDepartment.posts?.map((blog) => (
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
                    ))}
                </div>
            )}
    </div>
    
    );
};

export default CourseCategories;
