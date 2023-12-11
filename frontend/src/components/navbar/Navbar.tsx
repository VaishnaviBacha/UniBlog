
import Container from "../Container"
import Logo from "./Logo"
// import MenuItem from "./MenuItem"
import Search from "./Search"
import UserMenu from "./UserMenu"
import { Link } from "react-router-dom"
const Navbar = () => {
  return (
    <div className="bg-white w-full z-10 shadow-sm">
 <div className="py-4 border-b-[1px]">
    <Container>
    <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
        <Link to = "/">
        <Logo/>
        </Link>
        <p className="text-3xl text-blue-400">Uni-Blog</p>
        
        <UserMenu/>

        </div>

    </Container>

 </div>
    </div>
  )
}

export default Navbar