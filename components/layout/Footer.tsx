import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-background/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Hasan Pic Logo" width={24} height={24} className="w-6 h-6 rounded-full" />
          <span className="font-bold text-lg text-foreground">Hasan Pic</span>
        </div>
        <div className="text-muted text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Hasan Pic. Built with Next.js 15.
        </div>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/" className="text-muted hover:text-foreground transition-colors">Home</Link>
          <Link href="/gallery" className="text-muted hover:text-foreground transition-colors">Gallery</Link>
          <Link href="/upload" className="text-muted hover:text-foreground transition-colors">Upload</Link>
        </div>
      </div>
    </footer>
  );
}
