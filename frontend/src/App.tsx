import { Providers } from "./Provider"
import Navbar from "./components/navbar/Navbar"
import RegisterModal from "./components/modal/RegisterModal"
import LoginModal from "./components/modal/LoginModal"
import CourseCategories from "./components/CourseCategories"
// import BlogsComponent from "./components/BlogComponent"
import ToastProvider from "./providers/ToastProvider"
import "./index.css"
import NewBlog from "./components/NewBlog"
import OTPVerification from "./components/OTPVerification"
import CreateDepartment from "./components/CreateDepartment"
import CreateCourseForm from "./components/CreateCourse"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetDepartmentsComponent from "./components/Departments"
import Blogstest from "./components/Blogstest"
// import SearchTest from "./components/SearchTest"
import GetPotByIdTest from "./components/GetPotByIdTest"
import MyBlogs from "./components/MyBlogs"
import SingleBlog from "./components/SingleBlog"
import AccountEdit from "./components/AccountEdit"
import EditBlog from "./components/EditBlog"
import SavedBlogs from "./components/SavedBlogs"
import CrsBlg from "./components/CrsBlg"




const CreateBlogLayout = () => {
  return (

    <>
      <Navbar />
      <ToastProvider />
      <NewBlog />
    </>


  )
}
const DepartmentLayout = () => {
  return (

    <>
      <Navbar />

      <GetDepartmentsComponent />
    </>


  )
}
const EditBlogLayout = () => {
  return (

    <>
      <Navbar />

      <EditBlog />
    </>


  )
}
const OTPLayout = () => {
  return (

    <>
      <Navbar />
      <ToastProvider />
      <OTPVerification />
    </>


  )
}
const DepartmentCreateLayout = () => {
  return (
    <>
      <Navbar />
      <ToastProvider />
      <CreateDepartment />
    </>
  )
}
const CourseCreateLayout = () => {
  return (
    <>
      <Navbar />
      <ToastProvider />
      <CreateCourseForm />
    </>
  )
}
const MyBlogsLayout = () => {
  return (
    <>
      <Navbar />
      <ToastProvider />
      <MyBlogs />
    </>
  )
}
const SingleBlogLayout = () => {
  return (
    <>
      <Navbar />
      <ToastProvider />
      <SingleBlog />
    </>
  )
}
const AccountEditLayout = () => {
  return (
    <>
      <Navbar />
      <ToastProvider />
      <AccountEdit />
    </>
  )
}
const SavedBlogsLayout = () => {
  return (
    <>
      <Navbar />
      <ToastProvider />
      <SavedBlogs />
    </>
  )
}
const DepartmentBlogslogsLayout = () => {
  return (
    <>
      <Navbar />
      <ToastProvider />
      <CourseCategories />
    </>
  )
}
const CourseBlogslogsLayout = () => {
  return (
    <>
      <Navbar />
      <ToastProvider />
      <CrsBlg />
    </>
  )
}

const HomeLayout = () => {
  return (
    <>

      <Navbar />
      <ToastProvider />
      <RegisterModal />
      <LoginModal />
      {/* <CourseCategories/> */}
      <div className="mt-2">
        <Blogstest />
      </div>
      {/* <BlogsComponent/> */}


    </>


  )
}

const App = () => {



  return (
    <>
      <Router>

        <Providers>

          <Routes>
            <Route path="/" element={<HomeLayout />} />
            <Route path="/create" element={<CreateBlogLayout />} />
            <Route path="/OTP-verify" element={<OTPLayout />} />
            <Route path="/create-department" element={<DepartmentCreateLayout />} />
            <Route path="/create-course" element={<CourseCreateLayout />} />
            <Route path="/departments" element={<DepartmentLayout />} />
            <Route path="/blogs" element={<Blogstest />} />
            {/* <Route path = "/search" element = {<SearchTest />}/> */}
            <Route path="/testing-departments" element={<GetPotByIdTest />} />
            <Route path="/my-blogs" element={<MyBlogsLayout />} />
            <Route path="/blog/:postId" element={<SingleBlogLayout />} />
            <Route path="/edit-account" element={<AccountEditLayout />} />
            <Route path="/edit_post/:postId" element={<EditBlogLayout />} />
            <Route path="/departments-options" element={<DepartmentBlogslogsLayout />} />
            <Route path="/reading-list" element={<SavedBlogsLayout />} />
            <Route path="/blog-courses" element={<CourseBlogslogsLayout />} />



          </Routes>

        </Providers>
      </Router>

    </>
  )
}

export default App
