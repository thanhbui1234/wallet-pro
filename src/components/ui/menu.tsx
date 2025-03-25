import AvatarHeader from "@/components/ui/Header/avatar.tsx";
import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/bot", label: "Bot" },
  { to: "/strategy", label: "Strategy" },
  { to: "/position", label: "Position" },
];

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <AvatarHeader />
      <nav className="flex gap-6">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `font-semibold ${
                isActive ? "text-black" : "text-gray-700 hover:text-black"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <img src="/logo-right.png" alt="Right Logo" className="h-10 w-10" />
    </header>
  );
}
