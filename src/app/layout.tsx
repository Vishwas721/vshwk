import "./globals.css";
import localFont from "next/font/local";
import { Canvas } from "@react-three/fiber";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";

const sixCaps = localFont({
  src: "../../public/fonts/SixCaps-Regular.woff2",
  variable: "--font-six-caps",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sixCaps.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Six+Caps&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f0efeb] text-white antialiased">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        {/* The persistent soft off-white/cream canvas */}
        <Canvas className="!fixed !inset-0 !z-[-1] !bg-[#f0efeb] !pointer-events-none" />
      </body>
    </html>
  );
}
