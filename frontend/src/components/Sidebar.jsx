import React from "react";
import {
  FaBox,
  FaCog,
  FaHome,
  FaShoppingCart,
  FaTable,
  FaTruck,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
      isParent: true,
    },
    {
      name: "Categorias",
      path: "/admin-dashboard/categories",
      icon: <FaTable />,
      isParent: false,
    },
    {
      name: "Produtos",
      path: "/admin-dashboard/products",
      icon: <FaBox />,
      isParent: false,
    },
    {
      name: "Fornecedores",
      path: "/admin-dashboard/suppliers",
      icon: <FaTruck />,
      isParent: false,
    },
    {
      name: "Compras",
      path: "/admin-dashboard/orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: "Usuários",
      path: "/admin-dashboard/users",
      icon: <FaUsers />,
      isParent: false,
    },
    {
      name: "Perfil",
      path: "/admin-dashboard/profile",
      icon: <FaCog />,
      isParent: false,
    },
    {
      name: "Sair",
      path: "/admin-dashboard/logout",
      icon: <FaSignOutAlt />,
      isParent: false,
    },
  ];
  return (
    <div className="flex flex-col h-screen bg-altadark text-white w-16 md:w-64 fixed">
      <div className="h-16 flex items-center justify-center">
        <span className="hidden md:block text-xl font-bold">
          Inventário Alta Saúde
        </span>
        <span className="block md:hidden text-xl font-bold">Inv AS</span>
      </div>

      <div>
        <ul className="space-y-2 p-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                end={item.isParent}
                className={({ isActive }) =>
                  (isActive ? "bg-gray-200 text-black " : "") +
                  "flex items-center p-2 rounded-md hover:bg-gray-200 hover:text-black transition duration-200"
                }
                to={item.path}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="ml-4 hidden md:block">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
