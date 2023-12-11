// // import React, { useState } from 'react';
// import { useGetDepartmentsQuery, useGetBlogsByDepartmentQuery } from '@/slices/blogApiSlice';
// import { useAppSelector,useAppDispatch } from '@/hooks/useAppHooks';
// import { Blog } from '@/slices/blogsStateSlice';
// import { setBlogsByDepartment } from '@/slices/blogsStateSlice';

// const GetPotByIdTest = () => {
//     const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useGetDepartmentsQuery();
//     const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
//     const { data: blogsData, isLoading: blogsLoading, isError: blogsError } = useGetBlogsByDepartmentQuery(selectedDepartmentId);
//     const blogsByDepartment: Blog[] = useAppSelector((state) => state.blog.blogsByDepartment);

//     const handleDepartmentClick = (departmentId: number) => {
//         setSelectedDepartmentId(departmentId);
//     };

//     if (departmentLoading) {
//         return <div>Loading Departments...</div>;
//     }

//     if (departmentError) {
//         return <div>Error fetching departments</div>;
//     }

//     return (
//         <div>
//             <h2>Departments:</h2>
//             {departmentData?.departments.map((department) => (
//                 <div key={department.department_id} onClick={() => handleDepartmentClick(department.department_id)}>
//                     <p>{department.department_name}</p>
//                 </div>
//             ))}

//             <h2>Blogs for Selected Department:</h2>
//             {blogsLoading && <div>Loading Blogs...</div>}
//             {blogsError && <div>Error fetching blogs</div>}
//             {blogsData?.posts.map((blog) => (
//                 <div key={blog.blog_id}>
//                     <p>{blog.title}</p>
//                     {/* Render other blog details */}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default GetPotByIdTest;

import React, { useState, useEffect } from 'react';
import { useGetDepartmentsQuery, useGetBlogsByDepartmentQuery } from '@/slices/blogApiSlice';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppHooks';
import { Blog } from '@/slices/blogsStateSlice';
import { setBlogsByDepartment } from '@/slices/blogsStateSlice';

const GetPotByIdTest = () => {
    const { data: departmentData, isLoading: departmentLoading, isError: departmentError } = useGetDepartmentsQuery();
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | number | null>(null);
    const { data: blogsData, isLoading: blogsLoading, isError: blogsError } = useGetBlogsByDepartmentQuery(
        selectedDepartmentId !== null ? selectedDepartmentId : undefined
    );
    const blogsByDepartment: Blog[] = useAppSelector((state) => state.blog.blogsByDepartment);
    const dispatch = useAppDispatch();

    const handleDepartmentClick = (departmentId: number) => {
        setSelectedDepartmentId(departmentId);
    };

    useEffect(() => {
        if (blogsData) {
            // Dispatch the API response to the Red
            const fetchedBlogs: Blog[] = blogsData.posts || []; 
            dispatch(setBlogsByDepartment(fetchedBlogs));
        }
    }, [blogsData, dispatch]);

    if (departmentLoading) {
        return <div>Loading Departments...</div>;
    }

    if (departmentError) {
        return <div>Error fetching departments</div>;
    }

    return (
        <div>
            <h2>Departments:</h2>
            {departmentData?.departments.map((department) => (
                <div key={department.department_id} onClick={() => handleDepartmentClick(department.department_id)}>
                    <p>{department.department_name}</p>
                </div>
            ))}

            <h2>Blogs for Selected Department:</h2>
            {blogsLoading && <div>Loading Blogs...</div>}
            {blogsError && <div>Error fetching blogs</div>}
            {blogsByDepartment.map((blog) => (
                <div key={blog.blog_id}>
                    <p>{blog.title}</p>
                    {/* Render other blog details */}
                </div>
            ))}
        </div>
    );
};

export default GetPotByIdTest;
