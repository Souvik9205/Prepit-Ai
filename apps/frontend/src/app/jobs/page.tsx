import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="p-6">
      <div className="w-full h-40 bg-zinc-300 rounded-xl"></div>
      <div className="-mt-8 flex ">
        <Image
          src={"/avater.png"}
          alt="avater"
          width={200}
          height={200}
          className="w-32 h-32  rounded-xl"
        />
        <div>
          <h1>John Doe</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</p>
          <div className="flex gap-3">
            <Button>Create Job</Button>
            <Button>Edit Profile</Button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default page;
