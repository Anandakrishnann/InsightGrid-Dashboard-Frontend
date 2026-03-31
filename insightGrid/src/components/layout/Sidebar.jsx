import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-screen p-4">
      <h1 className="text-lg font-semibold text-indigo-600 mb-6">InsightGrid</h1>
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block px-3 py-2 rounded-lg ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`
          }
        >
          Dashboard
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
