// eslint-disable-next-line @typescript-eslint/no-unused-vars

import Image from "next/image";
import logo from "./public/images/logo.jpg";
import Link from "next/link";
import Healer from "./healer/page";
import Chat from "./chat/page";
import TermsAndConditions from "./terms-conditions/page";
import Footer from "./footer/page";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between py-8 bg-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-2">
          <Image src={logo} alt="Lumicula logo" width={40} height={40} />
          <h1 className="text-2xl font-bold">Lumicula</h1>
        </div>
        <button className="text-xl">&#9776;</button> {/* Menu Icon */}
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center text-center">
        <div className="grid grid-cols-2 gap-6 mt-8">
          {[
            "Support in difficult decisions",
            "Get clarity to foggy mind",
            "Have an alternative point of view",
            "Find your inner peace",
          ].map((title) => (
            <Link href="/healer" key={title}>
              <div className="flex flex-col items-center bg-gray-200 p-4">
                <div className="w-full h-32 bg-gray-400">Image</div>
                <p className="mt-4 text-center text-black">{title}</p>
                <button className="mt-4 bg-black text-white py-2 px-4 rounded">
                  Connect
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
