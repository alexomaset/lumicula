// components/Header.tsx
"use client";

// components/Navbar.js
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import lumi from "../public/images/lumi.jpeg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="w-full bg-white px-6 py-4 text-black">
      <div className="flex justify-left items-center space-x-8">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Image src={lumi} alt="Lumicula logo" width={300} height={300} />
          </div>
        </Link>

        {/* Centered Links */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/"></Link>
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
