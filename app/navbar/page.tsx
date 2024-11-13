'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import lumi from '../public/images/lumi.jpeg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add authentication state

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
          <Link href="/feedback" className="hidden md:block hover:text-yellow-300">
            About
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 items-center">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="text-black hover:text-yellow-500 transition-colors">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition-colors">
                  Signup
                </button>
              </Link>
            </>
          ) : (
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          )}
        </div>

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
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="text-left hover:text-yellow-500">Login</button>
              </Link>
              <Link href="/signup">
                <p onClick={toggleMenu} className="hover:text-yellow-500">
                  Signup
                </p>
              </Link>
            </>
          ) : (
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                toggleMenu();
              }}
              className="text-left text-red-500"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}