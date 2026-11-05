import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata = { title: "KindNest – Community service events", description: "Create, join and track social service events near you." };
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;800&family=Caveat:wght@600;700&display=swap" rel="stylesheet" />
        {/* Apply the saved theme before first paint so dark users don't get a light flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}` }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          cz-shortcut-listen) inject attributes into <body> before React loads,
          which would otherwise throw a hydration mismatch in the console. */}
      <body className="text-base-content min-h-screen" suppressHydrationWarning>
        <Navbar /><main className="min-h-[70vh]">{children}</main><Footer /><Toaster position="top-center" />
      </body>
    </html>
  );
}
