import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import { MAX_TOASTS, TOAST_DURATION_MS } from "./lib/constants";

export const metadata: Metadata = {
  title: "Lead Manager",
  description: "Dashboard to manage your sales leads",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full font-sans md:flex md:h-dvh md:flex-col">
        <Header />
        {children}
        <ToastContainer
          position="top-right"
          autoClose={TOAST_DURATION_MS}
          limit={MAX_TOASTS}
          hideProgressBar
          theme="light"
        />
      </body>
    </html>
  );
}
