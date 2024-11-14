"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import lumi from "../public/images/lumi.jpeg";
import AuthButtons from "../components/AuthButtons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession(); // Add authentication state

  const toggleMenu = () => setIsOpen(!isOpen);
  

  return (
    <nav className="w-full bg-white px-6 py-4 text-black">
      <div className="flex justify-between items-center">
        {/* Logo and About Link */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image
                src={lumi}
                alt="Lumicula logo"
                width={300}
                height={300}
                className="transition transform duration-200 ease-in-out"
              />
            </div>
          </Link>
          <Link
            href="/feedback"
            className="hidden md:block hover:text-yellow-300 mt-[15px]"
          >
            About
          </Link>
        </div>

        {/* Desktop Navigation */}
        <AuthButtons />

        {/* Hamburger Menu - Mobile Only */}
        <button onClick={toggleMenu} className="md:hidden text-xl">
          &#9776;
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col mt-4 space-y-2">
          <Link href="/feedback">
            <p onClick={toggleMenu} className="hover:text-yellow-300">
              About
            </p>
          </Link>
          {status !== "loading" && !session ? (
            <>
              <button
                onClick={() => signIn("google")}
                className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
              >
                <span>Sign in</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
