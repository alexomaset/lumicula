// components/Header.tsx
"use client";

// components/Navbar.js
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/images/logo.jpg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-white px-6 py-4 text-black">
      <div className="flex justify-left items-center space-x-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src={logo} alt="Lumicula logo" width={40} height={40} />
          <h1 className="text-3xl lg:text-2xl font-extrabold tracking-tight text-black">
            Lumicula
          </h1>
        </div>

        {/* Centered Links */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/">
            <p className="hover:text-yellow-300">Home</p>
          </Link>
          <Link href="/feedback">
            <p className="hover:text-yellow-300">About</p>
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <button
          onClick={toggleMenu}
          className="text-xl lg:hidden absolute right-6"
        >
          &#9776;
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="flex flex-col mt-4 space-y-2 lg:hidden">
          <Link href="/">
            <p onClick={toggleMenu} className="hover:text-yellow-300">
              Home
            </p>
          </Link>
          <Link href="/feedback">
            <p onClick={toggleMenu} className="hover:text-yellow-300">
              About
            </p>
          </Link>
        </div>
      )}
    </nav>
  );
}
