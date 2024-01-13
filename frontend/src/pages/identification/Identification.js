import React from "react";
import "../../index.css";

const Identification = () => {
  return (
    <div className="pattern-background">
      <p className="level-title text-7xl py-12">Level One - Identification</p>
      <div className="py-8 flex justify-center items-center gap-x-12">
        <div className="bg-[#fcfdf7] text-white b-8 w-1/3 h-[24vh] rounded-2xl custom-shadow">
          <div className="bg-[#FEC6C2] rounded-t-2xl w-full  p-4">
            Identification
          </div>
        </div>
        <div className="w-4"></div>
        <div className="bg-[#fcfdf7] text-white b-8 w-1/4 h-[24vh] rounded-2xl custom-shadow">
          <div className="bg-[#FEC6C2] rounded-t-2xl w-full  p-4">ID</div>
        </div>
      </div>
    </div>
  );
};

export default Identification;
