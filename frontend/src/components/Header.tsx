

interface HeaderProps {
    title? : string
    subtitle? : string
}

const Header : React.FC<HeaderProps>= ({title,subtitle}) => {
  return (
    <div className= "text-start">
    <div className="text-2xl font-bold">
      {title}
    </div>
    <div className=" font-light text-neutral-500 mt-2">
    {subtitle}
    </div>
    
        </div>
  )
}

export default Header