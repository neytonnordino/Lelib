import { IoMdSearch } from "react-icons/io";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isMobile?: boolean;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search",
  isMobile = false,
}: SearchBarProps) => {
  return (
    <form
      className={`flex items-center bg-neutral-200 rounded-3xl text-neutral-600 py-2 px-4 cursor-pointer ${
        isMobile ? "w-70 h-10" : "lg:w-80"
      }`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-0 px-2 w-full"
      />
      <div className="flex items-center gap-1">
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="20"
              viewBox="0 0 50 50"
            >
              <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
            </svg>
          </button>
        )}
        <IoMdSearch className="text-xl" />
      </div>
    </form>
  );
};

export default SearchBar;
