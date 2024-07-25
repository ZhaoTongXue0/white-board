import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ConvexClientProvider} from "@/providers/convex-client-provider";
import {Toaster} from "@/components/ui/sonner";
import {ModalProvider} from "@/providers/modal-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "white board",
  description: "多人实时协同画板工具",
};

export default function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
      <ConvexClientProvider>
        <Toaster/>
        <ModalProvider/>
        {children}
      </ConvexClientProvider>
    </body>
    </html>
  );
}
