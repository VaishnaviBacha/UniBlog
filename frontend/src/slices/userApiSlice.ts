import { apiSlice } from "./apiSlice";

interface FormData {
  username?: string;
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
}


type RegistrationResponse = {
  message: string;
  status: string;
};
type EmailVerificationResponse = {
  message: string;
};
type LogoutResponse = {
  message: string;
};

  

type LoginResponse = {
  email: string;
  is_admin: number;
  msg: string;
  token: string;
  user_id: number;
  username: string;
};
export interface FormDataWithPhoto {
  photo: File;
}

interface PhotoUploadResponse {
  message: string;
  status: string;
}

// Define the response types
interface ProfilePictureSuccessResponse {
  // Assuming the response contains an image file
  // You might need to adjust this based on the actual response
  file: Blob;
}

interface ProfilePictureErrorResponse {
  message: string;
  status: string;
}

// Define the query types
interface QueryTypes {
  getProfilePicture: {
    response: ProfilePictureSuccessResponse | ProfilePictureErrorResponse;
  
  };
}

const useApiSlice= apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      register: builder.mutation<RegistrationResponse, FormData>({ 
        query: (data) => ({
          url:'/register', 
          method: 'POST',
          body: data,
        }),
       
      }),
      verifyEmail: builder.mutation<EmailVerificationResponse, void>({
        query: (data) => ({
          url: `/verify_email`,
          method: 'POST',
          body: data,
          credentials: "include"
        })
      }),
      login: builder.mutation<LoginResponse,FormData>({
       query: (data)=> ({
        url: '/login', 
        method: 'POST',
        body: data,
        credentials: "include"
    
       })
      }),
      logout: builder.mutation<LogoutResponse , void>({ 
        query: () => ({
          url: '/logout',
          method: 'POST', 
          credentials: 'include',
        }),
      }),
      photoUpload: builder.mutation<PhotoUploadResponse, FormDataWithPhoto>({
        query: (formData) => ({
          url: '/upload_profile_picture',
          method: 'POST',
          body: formData,
          credentials: 'include',
        }),
      }),
    
      getUser: builder.query <RegistrationResponse,void>({
       query: ()=> ({
        url: '/user', 
        method: 'GET',
       
        credentials: "include"
    
       })
      }),
      getProfilePicture: builder.query<QueryTypes['getProfilePicture'], void>({
        query: () => ({
          url: '/get_profile_picture',
          method: 'GET',
          credentials: 'include'
        })
      })
      
    }),
  });
  export  const {useRegisterMutation, useLoginMutation, useGetUserQuery, useLogoutMutation, useVerifyEmailMutation, usePhotoUploadMutation, useGetProfilePictureQuery } = useApiSlice