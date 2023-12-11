// import React, { useState } from 'react';
// import { useVerifyEmailQuery } from '@/slices/userApiSlice';

// interface OTPVerificationProps {
//   email: string;
//   token: string;
// }

// const OTPVerification: React.FC<OTPVerificationProps> = ({ email, token }) => {
//   const [otp, setOTP] = useState('');
//   const { data, isLoading, isError, isSuccess, error } = useVerifyEmailQuery({ email, token });

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setOTP(e.target.value);
//   };

//   const handleVerifyOTP = () => {
//     // Implement logic to trigger email verification using OTP
//     console.log('Verifying OTP:', otp);
//     // You might send OTP to a server for validation here
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
//       <h2 className="text-2xl font-bold mb-4">OTP Verification</h2>
//       {isError && <div>Error: </div>}
//       {isLoading && <div>Loading...</div>}
//       {isSuccess && <div>{data?.message}</div>}
//       <div className="mb-4">
//         <label htmlFor="otp" className="block text-gray-700 font-bold mb-2">
//           Enter OTP
//         </label>
//         <input
//           type="text"
//           id="otp"
//           value={otp}
//           onChange={handleInputChange}
//           className="w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
//         />
//       </div>
//       <button
//         onClick={handleVerifyOTP}
//         className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
//       >
//         Verify OTP
//       </button>
//     </div>
//   );
// };

// export default OTPVerification;



import { useVerifyEmailMutation } from "@/slices/userApiSlice";
import { useAppSelector } from "@/hooks/useAppHooks";
import { useState } from "react";
import toast from "react-hot-toast";
const OTPVerification = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const [token, setToken] = useState('');

  const { data, error, isLoading } = useVerifyEmailMutation(FormData);

  // Handle loading, error, and data states here

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  const handleVerification = () => {
    toast.success("email");
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

