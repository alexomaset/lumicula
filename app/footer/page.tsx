import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full text-center text-black py-4">
      <Link href="/terms-conditions">
        <p>Copyright 2024 Lumicula Inc</p>
        <p>Privacy policy | Terms of use</p>
      </Link>
    </footer>
  );
}
