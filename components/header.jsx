import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.4)] transition-all">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="FinApp logo"
            width={180}
            height={50}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-4 cursor-pointer"
                >
                  <LayoutDashboard size={18} className="text-blue-600" />
                  <span className="hidden md:inline">Dashboard</span>
                </Button>
              </Link>

              <a href="/transaction/create">
                <Button
                  className="flex items-center gap-2 bg-black text-white px-5 shadow-md shadow-blue-500/30 
                hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300  cursor-pointer"
                >
                  <PenBox size={18} className="text-white" />
                  <span className="hidden md:inline">Add Transaction</span>
                </Button>
              </a>
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
