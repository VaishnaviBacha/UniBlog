import Header from "../Header";
import Inputs from "../inputs/Inputs";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";


import { closeLoginModal } from "@/slices/loginModal";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData } from "./RegisterModal";
import { useLoginMutation } from "@/slices/userApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { openRegisterModal } from "../../slices/registerModalSlice";
import toast from "react-hot-toast";

const LoginModal = () => {

  const navigate = useNavigate()
  const schema: ZodType<FormData> = z.object({
    username:  z.string().min(2).max(30),
    password: z.string().min(6).max(40),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [login, { isLoading, }] = useLoginMutation();

  const dispatch = useAppDispatch();

  const registerModalOpen = () => {
    dispatch(closeLoginModal());
    dispatch(openRegisterModal());
  };

  const handleOnClose = () => {
    dispatch(closeLoginModal());
  };

  const isLoginModalOpen = useAppSelector(
    (state) => state.toggleLoginModal.isLoginModalOpen
  );

  const onSubmit = async (user: FormData) => {
    try {
      const loginResponse = await login(user).unwrap();
      console.log("login response",loginResponse)
      dispatch(setCredentials({ ...loginResponse }));
   toast.success(" login sucessfully")
   navigate("/")
      dispatch(closeLoginModal());
    } catch (error) {
      console.log(error);
    }
  };
  const bodyContent = (
    <div className=" flex flex-col gap-4">
      <Header title=" Welcome to Uni-Blog" subtitle=" Login to your account" />
      <Inputs
        id="username"
        label="username"
        disabled={isLoading}
        register={register}
        required
        error={errors}
      />

      <Inputs
        id="password"
        type="password"
        label="Password"
        disabled={isLoading}
        register={register}
        required
        error={errors}
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      {/* <Button
         outline 
         label="continue with Google"
        //  icon={FcGoogle}
        //  onClick={()=>signIn("goggle")}
         /> */}
      <div className="   text-neutral-500 text-center mt-4 font-light">
        <div className=" justify-center flex flex-row items-center gap-2">
          <div>Dont have an account? </div>

          <div
            onClick={registerModalOpen}
            className="hover:underline cursor-pointer text-neutral-800"
          >
            Create Account
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      disabled={isLoading}
      isOpen={isLoginModalOpen}
      title="Login"
      onClose={handleOnClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={`${isLoading ? "loading" : "continue"}`}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;