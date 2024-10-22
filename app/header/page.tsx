// components/Header.tsx
'use client'

import { useState } from 'react';
// import Image from 'next/image';
import Link from 'next/link';



export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full flex justify-between items-center p-4">
      <div className="flex items-center space-x-2">
        {/* <Image src={logo} alt="Lumicula logo" width={40} height={40} /> */}
        <h1 className="text-2xl font-bold">Lumicula</h1>
      </div>
      <button
        className="text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        &#9776;
      </button>

      {/* Hamburger Menu */}
      {menuOpen && (
        <nav className="absolute top-16 right-4 bg-white shadow-md p-4 rounded-md">
          <ul>
            <li>
              <Link href="/about">
                <p className="block py-2">About</p>
              </Link>
            </li>
            <li>
              <Link href="/feedback">
                <p className="block py-2">Feedback</p>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

