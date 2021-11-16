import React from "react";

export default function dropDownButton(props) {
  const { options } = props;
  const [open, setOpen] = React.useState(false);

  const toggleDropDown = () => {
    setOpen(!open);
  };

  const closeDropDown = () => {
    setOpen(false);
  };

  const handleOptionClick = (action) => {
    if (typeof action === "function") {
      action();
    }
    closeDropDown();
  };

  return (
    <div className="">
      <button
        onClick={toggleDropDown}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Pay
      </button>

      <div
        onClick={closeDropDown}
        className="fixed inset-0 h-full w-full z-10"
        style={{
          display: open ? "block" : "none",
        }}
      ></div>

      <div
        className="absolute right-0 mt-1 mr-2 border border-gray-300 w-auto bg-white rounded-lg shadow-xl overflow-x-hidden z-10"
        style={{
          display: open ? "block" : "none",
          widows: open ? 200 : 0,
        }}
      >
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option.action)}
            className={`${
              index !== options.length - 1 && "border-b border-gray-300"
            } flex flex-column items-center px-2 py-3 w-full text-gray-600 hover:text-white hover:bg-indigo-600 z-10`}
          >
            <p className="text-sm mx-auto">{option.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
