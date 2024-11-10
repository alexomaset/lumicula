"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import lumi from "../public/images/lumi.jpeg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-white px-6 py-4 text-black">
      <div className="flex justify-between items-center">
        {/* Logo and About Link */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="-110 -105 transition transform duration-200 ease-in-out">
                <Image
                  src={lumi}
                  alt="Lumicula logo"
                  width={300}
                  height={300}
                />
              </div>
            </div>
          </Link>
          <Link href="/feedback">
            <p className="hover:text-yellow-300">About</p>
          </Link>
        </div>

        {/* Login and Signup Buttons */}
        <div className="flex space-x-4 items-center">
          <Link href="/login">
            <button className="text-black hover:text-yellow-500 transition-colors">
              Login
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition-colors">
              Signup
            </button>
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button onClick={toggleMenu} className="text-xl">
          &#9776;
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="hidden flex-col mt-4 space-y-2">
          <Link href="/feedback">
            <p onClick={toggleMenu} className="hover:text-yellow-300">
              About
            </p>
          </Link>
          <Link href="/signup">
            <button className="text-left hover:text-yellow-500">Login</button>
          </Link>
          <Link href="/signup">
            <p onClick={toggleMenu} className="hover:text-yellow-500">
              Signup
            </p>
          </Link>
        </div>
      )}
    </nav>
  );
}
