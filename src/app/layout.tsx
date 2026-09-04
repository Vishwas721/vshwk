import "./globals.css";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import GlobalCanvas from "@/components/webgl/GlobalCanvas";
import SmoothScrollProvider from "@/components/dom/SmoothScrollProvider";
import Sidebar from "@/components/layout/Sidebar";
import SidebarNavigation from "@/components/dom/SidebarNavigation";
import PagePushWrapper from "@/components/layout/PagePushWrapper";
import Loader from "@/components/layout/Loader";

const sidebarTitle = localFont({
  src: "../../public/fonts/SixCaps-Regular.woff2",
  variable: "--font-sidebar-title",
  display: "swap",
});

const sixCaps = localFont({
  src: "../../public/fonts/SixCaps-Regular.woff2",
  variable: "--font-six-caps",
  display: "swap",
});

const sidebarBody = Inter({
  subsets: ["latin"],
  variable: "--font-sidebar-body",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sidebarTitle.variable} ${sixCaps.variable} ${sidebarBody.variable} w-full overflow-x-hidden bg-[#f0efeb]`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Six+Caps&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="w-full overflow-x-hidden bg-[#f0efeb] text-white antialiased">
        <Loader />
        <SmoothScrollProvider>
          <PagePushWrapper>
            {children}
          </PagePushWrapper>
        </SmoothScrollProvider>
        <SidebarNavigation />
        <Sidebar />
        {/* The persistent soft off-white/cream canvas with WebGL shaders */}
        <GlobalCanvas />
      </body>
    </html>
  );
}


