import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

// Import a modern font like Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "FinApp",
  description: "One Stop Finance App",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className + " bg-gray-50 text-gray-800"}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Toaster richColors />
          <footer className="bg-gray-900 text-white py-10 mt-12 shadow-inner">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm sm:text-base font-medium">
                Made with <span className="text-red-500">❤️</span> by{" "}
                <span className="text-blue-400 font-semibold">Hashir 😎</span>
              </p>
              <p className="mt-2 text-xs text-gray-400">
                © {new Date().getFullYear()} FinApp. All rights reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
