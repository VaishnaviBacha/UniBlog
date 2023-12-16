import React, { useState } from 'react';
import { useGetBlogsByCourseNameQuery, useGetDepartmentsQuery } from '@/slices/blogApiSlice';
import { Link } from 'react-router-dom';
import { truncateContent } from '@/libs/utils';


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
    <div className="flex flex-col mt-8 w-full justify-center items-center">

      {departmentsLoading ? (
        <p>Loading departments...</p>
      ) : (
        <div >
          <h2 className="text-xl font-semibold mb-4">Department</h2>
          <select onChange={(e) => handleDepartmentChange(e.target.value)}
            className="border rounded-md px-3 py-2 text-gray-700">
            <option value="">Select Department</option>
            {departments?.departments.map((department) => (
              <option key={department.department_id} value={department.department_name}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>
      )}
      <br></br>
      <h2 className="text-xl font-semibold mb-4">Courses</h2>
      <div className="courses-container flex items-center space-x-4 mt-3">
        {selectedDepartment &&
          departments?.departments.find((dep) => dep.department_name === selectedDepartment)?.courses.map(
            (course) => (
              <div
                key={course.course_id}
                onClick={() => handleCourseSelection(course.course_name)}
                className='flex'
              >
                <p className={`${selectedCourse === course.course_name ? 'selected-course ' : ''
                  }cursor-pointer  flex-row border-2 bg-blue-300 rounded-md`}>
                  {course.course_name}
                </p>
              </div>
            )
          )}
      </div>

      <br></br>

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
