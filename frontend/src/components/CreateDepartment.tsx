import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useCreateDepartmentMutation } from '@/slices/blogApiSlice';
import { setDepartmentData } from '@/slices/blogsSlice';
import { useAppDispatch,useAppSelector } from '@/hooks/useAppHooks';
import toast from 'react-hot-toast';

interface DepartmentRequest {
  department_name: string;
  description: string;
  degree_type: string;
}

const CreateDepartment: React.FC = () => {
  const [departmentInfo, setDepartmentInfo] = useState<DepartmentRequest>({
    department_name: '',
    description: '',
    degree_type: '',
  });
 
  const [ newDepartment,{ isLoading,error}] = useCreateDepartmentMutation()
  const dispatch = useAppDispatch()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDepartmentInfo({
      ...departmentInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newDepartmentResponse = await newDepartment(departmentInfo).unwrap()
      dispatch(setDepartmentData(departmentInfo))
      setTimeout(() => {
        toast.success("Department created successfully");
      }, 2000);
      setDepartmentInfo({ 
        department_name: '',
        description: '',
        degree_type: '',
      });
console.log(newDepartmentResponse)
   
    } catch (error) {
    //   setError(error.message);
    toast.error("something went wrong")
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 justify-center bg-white shadow-md rounded-md">
      <input
        type="text"
        placeholder="Department name"
        name="department_name"
        value={departmentInfo.department_name}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Description"
        name="description"
        value={departmentInfo.description}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Degree type"
        name="degree_type"
        value={departmentInfo.degree_type}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
      />
      <button 
      type="submit" 
      className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
      disabled= {isLoading}
      >
      {isLoading ? 'Creating Department...' : 'Create Department'}
      </button>
      {error && <p className="text-red-500 mt-2"> Something went wrong</p>}
    </form>
    </div>
  );
};

export default CreateDepartment;
