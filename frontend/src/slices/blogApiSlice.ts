

import { apiSlice } from "./apiSlice";

export interface DepartmentRequest {
  department_name: string;
  description: string;
  degree_type: string;
}
export interface CourseRequest {
  course_name: string;
  description: string;
  department_id: string;
}

export interface DepartmentResponse {
  message: string;
  // Add other properties if there are more in the actual response
}
export interface CourseResponse {
  message: string;
  // Add other properties if there are more in the actual response
}

export interface Course {
  course_id: number;
  course_name: string;
}

export interface Department {
  department_id: number;
  department_name: string;
  courses: Course[];
}

export interface GetDepartmentsResponse {
  departments: Department[];
}

export interface BlogsResponse {
    message: string;
}
interface BlogRequest {
    department_id: number;
    course_id: number;
    title: string;
    content: string;
  }
  
  export interface Comment {
    text: string;
    user_id: number;
  }
  
  export interface User {
    user_id: number;
    username: string;
  }
  
  export interface CourseDetails {
    course_name: string;
    id: number;
  }
  
  export interface DepartmentDetails {
    department_name: string;
    id: number;
  }
  
  export interface BlogPost {
    comments: Comment[];
    content: string;
    course: CourseDetails;
    created_at: string;
    department: DepartmentDetails;
    id: number;
    likes: User[];
    title: string;
    user_id: number;
    username: string;
  }
  
  export interface GetBlogsResponse {
    posts?: BlogPost[];
  }
  export interface GetBlogByIdResponse {
    post?: BlogPost;
  }

   export interface Comment {
    text: string;
    username: string;
    // You might have additional properties for comments; add them here
  }
  
  export interface BlogPostUpdate {
    post: {
      comments: Comment[];
      content: string;
      course: {
        course_name: string;
        id: number;
      };
      created_at: string; // Consider using Date type if possible
      department: {
        department_name: string;
        id: number;
      };
      id: number;
      likes: []; // You might want to specify the like structure if available
      title: string;
      user_id: number;
      username: string;
    };
  }
  
 
interface LikePostResponse {
  message: string;
}
interface CommentResponse {
  message: string;
}
export interface SavedBlog {
  comments: Comment[];
  content: string;
  course: CourseDetails;
  created_at: string;
  department: DepartmentDetails;
  id: number;
  likes: User[];
  title: string;
  user_id: number;
  username: string;
}

export interface GetSavedBlogsResponse {
  saved_blogs: SavedBlog[];
}


const blogApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBlog: builder.mutation<BlogsResponse, BlogRequest>({
      query: (data) => ({
        url: "/create_post",
        method: "POST",
        body: data,
        credentials: "include"
      })
    }),
    editBlog: builder.mutation<BlogsResponse, { postId: string, updatedData: BlogRequest }>({
      query: ({ postId, updatedData }) => ({
        url: `/edit_post/${postId}`,
        method: "PUT",
        body: updatedData,
        credentials: "include"
      })
    }),
    getMyBlog: builder.query<GetBlogsResponse, void>({
      query: () => ({
        url: "/get_my_posts",
        method: "GET",
        credentials: "include"
      })
    }),
    searchBlogs: builder.query<GetBlogsResponse, string>({
      query: (searchQuery) => ({
        url: `/search/${encodeURIComponent(searchQuery)}`,
        method: "GET",
        credentials: "include",
      }),
    }),
   
    
    
    getBlogs: builder.query<GetBlogsResponse, void>({
      query: () => ({
        url: "/get_posts",
        method: "GET",
        credentials: "include"
      })
    }),
    getBlogsById: builder.query<GetBlogByIdResponse ,  string>({
      query: (post_id = '') => ({
        url: `/get_single_post/${post_id}`,
        method: "GET",
        credentials: "include"
      })
    }),

    saveBlog: builder.mutation<BlogsResponse, string >({
      query: ( blogId ) => ({
        url: `/save_post/${blogId}`,
        method: "POST",
       
        credentials: "include"
      })
    }),
    getSavedBlogs: builder.query<GetSavedBlogsResponse, void>({
      query: () => ({
        url: "/reading_list", // Adjust the actual endpoint
        method: "GET",
        credentials: "include"
      })
    }),
    getBlogsByDepartment: builder.query<GetBlogsResponse,string | number>({
      query: (department) => ({
        url: `/get_posts_by_department/${department}`,
        method: "GET",
        credentials: "include"
      })
    }),
    getBlogsByDepartmentName: builder.query<GetBlogsResponse, string>({
      query: (departmentName) => ({
        url: `/get_posts_by_department/${encodeURIComponent(departmentName)}`,
        method: 'GET',
        credentials:"include"
      }),
    }),
    getBlogsByCourseName: builder.query<GetBlogsResponse, { departmentName: string; courseName: string }>({
      query: ({ departmentName, courseName }) => ({
        url: `/get_posts_by_course/${encodeURIComponent(departmentName)}/${encodeURIComponent(courseName)}`,
        method: 'GET',
        credentials: "include"
      }),
    }),
    
    getDepartments: builder.query<GetDepartmentsResponse, void>({
      query: () => ({
        url: "/get_departments",
        method: "GET",
        credentials: "include"
      })
    }),
    createDepartment: builder.mutation<DepartmentResponse, DepartmentRequest>({
      query: (data) => ({
        url: "/create_department",
        method: "POST",
        body: data,
        credentials: "include"
      })
    }),
    likePost: builder.mutation<LikePostResponse,  string>({
      query: (post_id) => ({
        url: `/like_post/${post_id}`,
        method: "POST",
       
        credentials: "include"
      })
    }),
    comment: builder.mutation<CommentResponse, { postId: string, commentText: string }>({
      query: ({ postId, commentText }) => ({
        url: `/add_comment/${postId}`,
        method: "POST",
        body: { text: commentText }, // Include the comment text in the body
        credentials: "include"
      })
    }),
    
  
    createCourse: builder.mutation<CourseResponse, CourseRequest>({
      query: (data) => ({
        url: "/create_course",
        method: "POST",
        body: data,
        credentials: "include"
      })
    })
  })
});

export const {
  useCreateBlogMutation,
  useSearchBlogsQuery,
  useCreateDepartmentMutation,
  useGetDepartmentsQuery,
  useCreateCourseMutation,
  useGetBlogsByDepartmentQuery,
  useGetBlogsQuery,
  useGetMyBlogQuery,
  useGetBlogsByIdQuery,
  useEditBlogMutation,
  useLikePostMutation,
  useCommentMutation,
  useGetBlogsByDepartmentNameQuery,
  useSaveBlogMutation,
  useGetSavedBlogsQuery,
  useGetBlogsByCourseNameQuery
} = blogApiSlice;
