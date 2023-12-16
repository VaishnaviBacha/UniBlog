import { useVerifyEmailMutation } from "@/slices/userApiSlice";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppHooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { openLoginModal } from "@/slices/loginModal";

import toast from "react-hot-toast";
const OTPVerification = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [emailVerify, { isLoading }] = useVerifyEmailMutation();
  const navigate = useNavigate()
  const dispatch= useAppDispatch()

  // const { data, error, isLoading } = useVerifyEmailMutation({
  //   email: userInfo?.email || '', // Get email from your Redux store
  //   token: token, // Use the token from your input field
  // });

  // Handle loading, error, and data states here

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleVerification = async () => {
    try {
      const requestData = {
        email: email,
        token: token // Token is used as a string
      };
      const response = await emailVerify(requestData);
      console.log(response);
      // Assuming the response contains a success message
      // setTimeout(() => {
      //   toast.success("Email verified succesfully", {
      //     duration: 3000,
      //   });
      // }, 6000)
      if (response.data?.status === 200) {
        toast.success("Email verified succesfully"); // Change 'response.data' to the actual response property containing the success message
        setTimeout(() => {
          navigate("/")
          //dispatch(openLoginModal())
        }, 2000);
      } else if (response?.error?.status === 400){
        toast.error("Email verification failed!! Please check the credentials!!");
      }
    } catch (error) {
      // Handle error
      console.error("Error occurred:", error);
      toast.error("An error occurred");
    }

  };

  return (
    // <div>
    //   <input type="text" value={token} onChange={handleTokenChange} />
    //   <button onClick={handleVerification}>Verify Email</button>
    //   {/* Display loading, error, and data states */}
    // </div>
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md">
      <input
        className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        type="text"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter Email" />
      <input
        className="w-full p-2 mb-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        type="text"
        value={token}
        onChange={handleTokenChange}
        placeholder="Enter your token"
      />
      <button
        className="w-full bg-blue-500 text-white p-2 rounded-md cursor-pointer"
        onClick={handleVerification}
      >
        Verify Email
      </button>
    </div>
  );
};

export default OTPVerification;

