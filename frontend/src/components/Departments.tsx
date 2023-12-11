import React, { useEffect } from 'react';
 
import { useGetDepartmentsQuery } from '@/slices/blogApiSlice';
import {Department } from '@/slices/blogApiSlice';
const GetDepartmentsComponent: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useGetDepartmentsQuery();

  useEffect(() => {
    // Fetch departments when component mounts
    refetch();
  }, [refetch]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: </p>}
      {data && (
        <div>
          <h2>Departments</h2>
          <ul>
            {data.departments.map((department: Department) => (
              <li key={department.department_id}>
                <h3 className='text-3xl text-red-300'>{department.department_name}</h3>
                <p className='text-sm'>Department ID: {department.department_id}</p>
                <p>Courses:</p>
                <ul>
                  {department.courses.map((course) => (
                    <li key={course.course_id}>
                     <p className='text-lg'>{course.course_name}</p> 
                     <p>(ID: {course.course_id})</p> 
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GetDepartmentsComponent;
