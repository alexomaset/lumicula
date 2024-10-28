import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white text-center text-black py-6">
      <div className="container mx-auto">
        <Link href="/terms-conditions">
          <p className="text-sm font-semibold tracking-wide">
            © 2024 Lumicula Inc
          </p>
          <p className="mt-2 text-xs opacity-75 hover:opacity-100 transition-opacity duration-300">
            Privacy Policy | Terms of Use
          </p>
        </Link>
      </div>
    </footer>
  );
}
