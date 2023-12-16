// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { useCreateCourseMutation, useGetDepartmentsQuery } from '@/slices/blogApiSlice';
// import { CourseRequest } from '@/slices/blogApiSlice';
// import toast from 'react-hot-toast';

// const CreateCourseForm = () => {
//   const [courseData, setCourseData] = useState<CourseRequest>({
//     course_name: '',
//     description: "",
//     department_id: '',
//   });
//   const [error, setError] = useState('');
//   const[newCourse,{isLoading,isError}]= useCreateCourseMutation()
//   const {data, isLoading}= useGetDepartmentsQuery()

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setCourseData({
//       ...courseData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//    await newCourse(courseData).unwrap
//    toast.success("course created succesfully")
//     } catch (error) {
//      toast.error("something went wrong")
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
//       <input
//         type="text"
//         placeholder="Course Name"
//         name="course_name"
//         value={courseData.course_name}
//         onChange={handleChange}
//         className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
//       />
//       <input
//         type="text"
//         placeholder="Description"
//         name="description"
//         value={courseData.description}
//         onChange={handleChange}
//         className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
//       />
//       <input
//         type="text"
//         placeholder="Department id"
//         name="department_id"
//         value={courseData.department_id}
//         onChange={handleChange}
//         className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
//       />
//       <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300">
//         Create Course
//       </button>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//     </form>
//   );
// };

// export default CreateCourseForm;


import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useCreateCourseMutation, useGetDepartmentsQuery } from '@/slices/blogApiSlice';
import { CourseRequest } from '@/slices/blogApiSlice';
import toast from 'react-hot-toast';

const CreateCourseForm = () => {
  const [courseData, setCourseData] = useState<CourseRequest>({
    course_name: '',
    description: '',
    department_id: '',
  });
  const [error, setError] = useState('');
  const [newCourse, { isLoading, isError }] = useCreateCourseMutation();
  const { data: departmentsData, isLoading: departmentsLoading } = useGetDepartmentsQuery();

  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setCourseData({
  //     ...courseData,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  // ...

const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
  const { name, value } = e.target;
  setCourseData({
    ...courseData,
    [name]: value,
  });
};

// ...


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await newCourse(courseData).unwrap();
      toast.success('Course created successfully');
      setCourseData({
        course_name: '',
        description: '',
        department_id: '',
      });
    } catch (error) {
      if(error.data?.message === "Course name already exists!") {
        toast.error("Course name already exists!")
      } else {
        toast.error("something went wrong")
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <input
        type="text"
        placeholder="Course Name"
        name="course_name"
        value={courseData.course_name}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        required
      />
      <input
        type="text"
        placeholder="Description"
        name="description"
        value={courseData.description}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        required
      />
      <select
        name="department_id"
        value={courseData.department_id}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
        required
      >
        <option value="">Select Department</option>
        {departmentsData?.departments.map((department) => (
          <option key={department.department_id} value={department.department_id}>
            {department.department_name}
          </option>
        ))}
      </select>
      <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Create Course
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
};

export default CreateCourseForm;

