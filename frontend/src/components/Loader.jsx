import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-14">
      <div
        className="animate-spin inline-block size-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
