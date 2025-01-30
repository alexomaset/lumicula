"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import lumi from "../public/images/lumi.jpeg";
import AuthButtons from '../components/AuthButtons';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and About Link */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src={lumi}
                alt="Lumicula logo"
                width={300}
                height={300}
                className="rounded-full transform group-hover:scale-110 transition-transform duration-200"
              />
            </Link>
            <Link
              href="/feedback"
              className="hidden md:block text-gray-600 hover:text-amber-500 transition-colors duration-200 font-medium"
            >
              About
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <AuthButtons />
          </div>

          {/* Hamburger Menu */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 text-gray-500 hover:text-amber-500 transition-colors duration-200"
          >
            <div className={`absolute w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'} h-0.5 bg-current`} />
            <div className={`absolute w-6 h-0.5 bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <div className={`absolute w-6 transform transition-transform duration-300 ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'} h-0.5 bg-current`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/feedback"
              className="block px-3 py-2 text-gray-600 hover:text-amber-500 transition-colors duration-200"
            >
              About
            </Link>
            <div className="px-3 py-2">
              <AuthButtons />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}