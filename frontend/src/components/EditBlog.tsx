import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useEditBlogMutation } from '@/slices/blogApiSlice';
import { useGetDepartmentsQuery } from '@/slices/blogApiSlice';
import { Department } from '@/slices/blogApiSlice';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const EditBlog: React.FC = () => {
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    category: 1,
    course: 1,
    department_id: 1, // Added department_id
    course_id: 1, // Added course_id
  });
  const { postId } = useParams<{ postId?: string }>()
  const postIdString = postId ?? '';
  const { data: departmentsData, isLoading: isDepartmentLoading, isError: isDepartmentError, error, refetch } = useGetDepartmentsQuery();
  const [editBlog, {isError,isLoading}] = useEditBlogMutation() 
  const navigate = useNavigate()
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBlogData({ ...blogData, [name]: value });
  };

  
  const handleEditorChange = (content: string) => {
    setBlogData({ ...blogData, content });
  };
  // const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const category = e.target.value;
  //   setBlogData({ ...blogData, category });
  // };
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = parseInt(e.target.value);
    const selectedDepartment = departmentsData?.departments.find(
      (department) => department.department_id === category
    );
  
    setBlogData({
      ...blogData,
      category,
      department_id: category, // Update department_id
      course_id: selectedDepartment?.courses.length
        ? selectedDepartment.courses[0].course_id
        : 1,
    });
  };
  
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const course = parseInt(e.target.value);
    setBlogData({
      ...blogData,
      course,
      course_id: isNaN(course) ? 1 : course, // Update course_id
    });
  };
  
  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  
  
  const handleBlogCreation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      blogData.title.trim() === '' ||
      blogData.content.trim() === '' ||
      blogData.category === 0 || // Assuming 0 is an invalid category value
      blogData.course === 0 // Assuming 0 is an invalid course value
    ) {
      toast.error("Please fill in all required fields");
      return; // Prevent form submission if any field is empty
    }
    try {
      const contentPlainText = stripHtmlTags(blogData.content); // Convert HTML to plain text
    const blogResponse = { ...blogData, content: contentPlainText }
    const mutationResult = await editBlog({ postId: postIdString, updatedData:blogResponse });
      
      console.log("blogpost", blogData)

      setTimeout(() => {
        toast.success("Blog created successfully");
        setTimeout(() => {
          navigate("/my-blogs");
        }, 4000); // Delay of 4 seconds (4000 milliseconds)
      }, 3000);
      

    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Blog Post</h2>
      <form onSubmit={handleBlogCreation}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Blog Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={blogData.title}
            onChange={handleInputChange}
            required
            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>
     

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
            Select Department
          </label>
          <select
            id="category"
            name="category"
            value={blogData.category}
            onChange={handleDepartmentChange}
            required
            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          >
            {isDepartmentLoading ? (
              <option value="">Loading...</option>
            ) : (
              departmentsData &&
              departmentsData.departments.map((department) => (
                <option key={department.department_id} value={department.department_id}>
                  {department.department_name}
                </option>
              ))
            )}
          </select>
        </div>
        
        {/* New dropdown for courses */}
        <div className="mb-4">
          <label htmlFor="course" className="block text-gray-700 font-bold mb-2">
            Select Course
          </label>
          <select
            id="course"
            name="course"
            value={blogData.course}
            onChange={handleCourseChange}
            required
            className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          >
            {departmentsData &&
              departmentsData.departments
                .find((department) => department.department_id === parseInt(blogData.category.toString()))
                ?.courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
          </select>
        </div>

        <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 font-bold mb-2">
          Blog Content
        </label>
        <ReactQuill
          theme="snow" // You can change the theme as needed
          value={blogData.content}
          onChange={handleEditorChange}
          className="bg-white"
          
        />
      </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
      {isLoading ?  "Editing blog" : "Edit blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
