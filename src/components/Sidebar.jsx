import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ${
        isOpen ? "w-60" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 -right-3 bg-gray-700 p-1 rounded-full shadow-lg"
      >
        {isOpen ? (
          <ChevronLeftIcon className="h-5 w-5 text-white" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-white" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="mt-16 px-4">
        <h2 className={`text-lg font-bold mb-4 ${!isOpen && "hidden"}`}>
          Dashboard
        </h2>
        <ul className="space-y-3">
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            Home
          </li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            Watchlist
          </li>
          <li className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            News
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
