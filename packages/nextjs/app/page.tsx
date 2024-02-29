"use client";

import type { NextPage } from "next";
import HomePage from "~~/components/account-abstraction/page";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center"></h1>
          <HomePage />
        </div>
      </div>
    </>
  );
};

export default Home;
