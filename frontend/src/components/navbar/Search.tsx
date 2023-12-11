import { BiSearch } from "react-icons/bi";
import { useState, ChangeEvent } from "react";

const Search: React.FC = () => {


  return (
    <div className="border-[1px] w-full md:w-auto py-2 bg-gray-200 rounded-full shadow-sm hover:shadow-sm transition cursor-pointer">
      <div className="flex flex-row items-center">
        <input
          type="text"
          placeholder="Search..."
         
          className="text-sm px-6 flex-1 bg-transparent outline-none"
        />
        <div className="p-2 bg-rose-500 rounded-full text-white">
          <BiSearch size={18} />
        </div>
      </div>
    </div>
  );
};

export default Search;
