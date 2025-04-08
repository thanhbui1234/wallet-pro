"use client";
import MenuApp from "@/components/ui/menu.tsx";
import { Outlet } from "react-router-dom";

const Layout = () => {
  // Debugging logs

  return (
    <div className="min-h-screen flex flex-col">
      <MenuApp />
      <main className="flex-1 p-4 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
