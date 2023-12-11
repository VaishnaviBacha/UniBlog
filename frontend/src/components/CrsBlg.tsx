import React, { useState } from 'react';
import { useGetBlogsByCourseNameQuery, useGetDepartmentsQuery } from '@/slices/blogApiSlice';
import { Link } from 'react-router-dom';
import { truncateContent } from '@/libs/utils';



// const CrsBlg: React.FC = () => {
//   const [selectedCourse, setSelectedCourse] = useState<{ departmentName: string; courseName: string } | null>(null);
//   const { data: blogs, isLoading: blogsLoading } = useGetBlogsByCourseNameQuery(selectedCourse ? selectedCourse : { departmentName: '', courseName: '' });
//   const { data: departments, isLoading: departmentsLoading } = useGetDepartmentsQuery();

//   const handleCourseSelection = (departmentName: string, courseName: string) => {
//     setSelectedCourse({ departmentName, courseName });
//   };

//   return (
//     <div>
//       <h2>Departments</h2>
//       {departmentsLoading ? (
//         <p>Loading departments...</p>
//       ) : (
//         <ul>
//           {departments?.departments.map((department) => (
//             <li key={department.department_id}>
//              <p className='text-red-500 text-3xl'> {department.department_name}</p>
//               <ul>
//                 {department.courses.map((course) => (
//                   <li key={course.course_id} onClick={() => handleCourseSelection(department.department_name, course.course_name)}>
//                    <p className=' text-emerald-400 text-sm'> {course.course_name} </p>
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ))}
//         </ul>
//       )}

//       <h2>Blogs</h2>
//       {blogsLoading ? (
//         <p>Loading blogs...</p>
//       ) : (
//         <ul>
//           {blogs?.posts?.map((blog) => (
//             <li key={blog.id}>
//               <h3>{blog.title}</h3>
//               <p>{blog.content}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default CrsBlg;




// ... existing imports

const CrsBlg: React.FC = () => {
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  
    const { data: blogs, isLoading: blogsLoading } = useGetBlogsByCourseNameQuery({
      departmentName: selectedDepartment ?? '',
      courseName: selectedCourse ?? '',
    });
    const { data: departments, isLoading: departmentsLoading } = useGetDepartmentsQuery();
  
    const handleDepartmentChange = (departmentName: string) => {
      setSelectedDepartment(departmentName);
      setSelectedCourse(null); // Reset selected course when department changes
    };
  
    const handleCourseSelection = (courseName: string) => {
      setSelectedCourse(courseName);
    };
  
    return (
      <div>
       
        {departmentsLoading ? (
          <p>Loading departments...</p>
        ) : (
          <select onChange={(e) => handleDepartmentChange(e.target.value)}>
            <option value="">Select Department</option>
            {departments?.departments.map((department) => (
              <option key={department.department_id} value={department.department_name}>
                {department.department_name}
              </option>
            ))}
          </select>
        )}
  
        <h2>Courses</h2>
        <div className="courses-container flex items-center space-x-4 mt-3">
          {selectedDepartment &&
            departments?.departments.find((dep) => dep.department_name === selectedDepartment)?.courses.map(
              (course) => (
                <div
                  key={course.course_id}
                  onClick={() => handleCourseSelection(course.course_name)}
                  className='flex'
                >
         <p className={`${
  selectedCourse === course.course_name ? 'selected-course ' : ''
}cursor-pointer  flex-row border-2 bg-blue-300 rounded-md`}>
  {/* Your content here */}


                    {course.course_name}
                  </p>
                </div>
              )
            )}
        </div>
  
        
        {blogsLoading ? (
          <p>Loading blogs...</p>
        ) : (
          <div>
            {blogs?.posts?.map((blog) => (
            
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
  
  export default CrsBlg;
  