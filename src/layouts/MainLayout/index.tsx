"use client";
import MenuApp from "@/components/ui/menu.tsx";
import { fetchUsers } from "@/services/UserServices.ts";
import { useUserStore } from "@/store/useUserStore.ts";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const { users, setUsers } = useUserStore();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Debugging logs
  console.log("Fetched data from API:", data);
  console.log("Users from store:", users);

  useEffect(() => {
    if (data && users.length === 0) {
      console.log("Updating Zustand store with fetched data.");
      setUsers(data);
    }
  }, [data, users, setUsers]);

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
