import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Field Service Manager",
  description: "Simple field service management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
