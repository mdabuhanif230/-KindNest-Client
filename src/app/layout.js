import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata = { title: "KindNest – Community service events", description: "Create, join and track social service events near you." };
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;800&display=swap" rel="stylesheet" /></head>
      <body className="bg-base-100 text-base-content min-h-screen">
        <Navbar /><main className="min-h-[70vh]">{children}</main><Footer /><Toaster position="top-center" />
      </body>
    </html>
  );
}
