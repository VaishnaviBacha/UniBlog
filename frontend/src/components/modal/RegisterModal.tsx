import Header from "../Header";
import Inputs from "../inputs/Inputs";
import Modal from "./Modal";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { closeRegisterModal } from "../../slices/registerModalSlice";
import { openLoginModal } from "@/slices/loginModal";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "@/slices/authSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { ZodType, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@/slices/userApiSlice";

export interface FormData {
  username?: string;
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
}

const RegisterModal = () => {

  const [registerUser, { isLoading, isError, }] = useRegisterMutation();

  const schema: ZodType<FormData> = z.object({
    username: z.string().min(2).max(30),
    firstname: z.string().min(2).max(30),
    lastname: z.string().min(2).max(30),

    email: z.string().email(),
    password: z.string().min(6).max(40)

  })


  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })


  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // const { register, formState: { errors }} = useForm<FieldValues>({
  //     defaultValues: { name: "", email: "", password: "" },
  //   });

  const handleOnClose = () => {
    dispatch(closeRegisterModal())
  }

  //   const handleSubmit = ()=>{
  //     setIsLoading(true)
  //   }

  const loginAccountOpen = () => {
    dispatch(closeRegisterModal())
    dispatch(openLoginModal())

  }
  const isRegisterModalOpen = useAppSelector((state) => state.toggleRegisterModal.isRegisterModalOpen)

  const onSubmit = async (user: FormData) => {
    try {
      const res = await registerUser(user).unwrap();
      console.log(user)
      // Handling optional username field
      const userInfo = {
        username: user.username || '', // Assuming default value if username is undefined
        email: user.email || '', // Assuming default value if email is undefined
      };

      dispatch(setCredentials(userInfo));

      dispatch(closeRegisterModal())

      setTimeout(() => {
        toast.success("registered succesfuly login to continue", {
          duration: 3000,
        });
      }, 6000)


      navigate("/OTP-verify")


    }
    catch (err) {
      console.log("err", err)
      if(err?.data?.message === 'User already exist !') {
        toast.error('Username or email already exists');
      } else if (err?.data?.message === 'Invalid email address !') {
        toast.error("Invalid Email address!")
      } else {
        toast.error("Something went wrong!")
      }
    }

  }
  const bodyContent = (
    <div className=" flex flex-col gap-4">
      <Header
        title=" Welcome to Uni-Blog"
        subtitle=" Create an account"

      />
      <Inputs
        id="username"
        label="Username"
        disabled={isLoading}
        register={register}
        required
        error={errors}

      />
      <Inputs
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        required
        error={errors}

      />

      <Inputs
        id="firstname"
        label="FirstName"
        disabled={isLoading}
        register={register}
        required
        error={errors}

      />
      <Inputs
        id="lastname"
        label="LastName"
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

  )

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
          <div >Already have an account? </div>
          <div
            onClick={loginAccountOpen}

            className="hover:underline cursor-pointer text-neutral-800">Login</div>
        </div>

      </div>

    </div>
  )
  return (
    <Modal
      disabled={isLoading}
      isOpen={isRegisterModalOpen}
      title="Register"
      onClose={handleOnClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={`${isLoading ? "loading" : "continue"}`}
      body={bodyContent}
      footer={footerContent}

    />
  )
}


export default RegisterModal