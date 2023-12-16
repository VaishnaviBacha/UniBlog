
import { useState } from "react"
import MenuItem from "./MenuItem"
import { AiOutlineMenu } from "react-icons/ai";
import { openRegisterModal } from "@/slices/registerModalSlice";
import { openLoginModal } from "@/slices/loginModal";
import Avatar from "../Avatar";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { clearCredentials } from "@/slices/authSlice";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useLogoutMutation } from "@/slices/userApiSlice";
import { useNavigate } from "react-router-dom";
const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)

  const userInfo = useAppSelector((state) => state.auth.userInfo)
  const [Logout, { isLoading }] = useLogoutMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const toggleOpen = () => {
    setIsOpen((value) => !value)

  }

  const registerModalOpen = () => {
    dispatch(openRegisterModal())
  }
  const loginModalOpen = () => {
    dispatch(openLoginModal())
  }

  const logOutHandler = async () => {
    try {
      await Logout()

      dispatch(clearCredentials())
      toast.success("logged out succesfully")
      setTimeout(() => {
        navigate("/")
      }, 1000);

    } catch (error) {
      toast.error("something went wrong")
    }

  }
  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        {userInfo ? (
          <div className=" m-3">
            <div className="flex space-x-2">
              <Link to="/create">
                <button
                  className="bg-gray-300 rounded-md p-2 mx-2"
                >
                  Write
                </button>
              </Link>

            </div>
          </div>

        ) : (
          <div>Login</div>
        )
        }

        <div
          onClick={toggleOpen}
          className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
          <AiOutlineMenu />
          <div className=" hidden md:block">
            <Avatar />
          </div>
        </div>

      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[100%] bg-blue-100 overflow-hidden text-sm md:text-xm right-0 top-12">
          <div className=" flex flex-col cursor-pointer ">
            {userInfo ? (
              <>
                <Link to="/edit-account">
                  <MenuItem
                    onclick={() => { }}
                    label="My Account"

                  />
                </Link>
                <Link to="/my-blogs">
                  <MenuItem
                    onclick={() => { }}
                    label="My blogs"

                  />
                </Link>
                <Link to="/reading-list">
                  <MenuItem
                    onclick={() => { }}
                    label="Saved blogs"

                  />
                </Link>
                <Link to="/departments-options">
                  <MenuItem
                    onclick={() => { }}
                    label="Blogs by department"

                  />
                </Link>
                <Link to="/blog-courses">
                  <MenuItem
                    onclick={() => { }}
                    label="Blogs by course"

                  />
                </Link>

                {userInfo.is_admin === 1 && (
                  <>
                    <Link to="/create-department">
                      <MenuItem
                        onclick={() => { }}
                        label="Create departmet"

                      />
                    </Link>
                    <Link to="/create-course">
                      <MenuItem
                        onclick={() => { }}
                        label="Create course"

                      />
                    </Link>

                  </>

                )}
                <MenuItem
                  onclick={logOutHandler}
                  label="Logout"
                />

              </>

            ) : (
              <>
                <MenuItem
                  onclick={loginModalOpen}
                  label="Login"
                />

                <MenuItem
                  onclick={registerModalOpen}
                  label="Register"
                />


              </>


            )}


          </div>
        </div>
      )}






    </div>

  )
}

export default UserMenu