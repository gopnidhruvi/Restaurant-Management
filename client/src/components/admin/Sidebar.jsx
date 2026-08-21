
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleDown, FaAngleUp, } from "react-icons/fa";
import { sidebarConfig } from "../../config/sidebarConfig";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../Constant/CommonConstant";

const Sidebar = () => {

  const { user } = useAuth();

  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  const isOwner = user?.role === ROLES.OWNER;
  const isManager = user?.role === ROLES.MANAGER;
  const isWaiter = user?.role === ROLES.WAITER;
  const isKitchen = user?.role === ROLES.KITCHEN;

  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState("");

  const CURRENT_ROLE = user?.role;
  const menus = sidebarConfig
    .filter((menu) => menu.roles?.includes(CURRENT_ROLE))
    .map((menu) => {
      if (!menu.children) {
        return menu;
      }

      return {
        ...menu,
        children: menu.children.filter(
          (child) =>
            !child.roles || child.roles.includes(CURRENT_ROLE)
        ),
      };
    })
    .filter((menu) => {
      if (!menu.children) return true;
      return menu.children.length > 0;
    });


  return (
    <div className="sidebar">
      <div className="admin-sidebar">
        <div className="sidebar-logo text-light">
          <h4>{CURRENT_ROLE ? CURRENT_ROLE.toUpperCase() : ""}</h4>
        </div>
        <ul className="nav flex-column">
          {menus.map(menu => {
            const Icon = menu.icon;
            if (!menu.children) {
              return (
                <li
                  key={menu.title}
                  className="sidebar-item"
                  onClick={() => navigate(menu.path)}>
                  <Icon className="me-2" />
                  {menu.title}
                </li>
              );
            }

            return (

              <li key={menu.title}>

                <a
                  className="nav-link text-white sidebar-item d-flex justify-content-between"

                  onClick={() =>
                    setOpenMenu(
                      openMenu === menu.title
                        ? ""
                        : menu.title
                    )
                  }
                >

                  <span>

                    <Icon className="me-2" />

                    {menu.title}

                  </span>

                  {

                    openMenu === menu.title

                      ? <FaAngleUp />

                      : <FaAngleDown />
                  }
                </a>

                {

                  openMenu === menu.title &&

                  <ul className="list-unstyled ms-4">

                    {

                      menu.children.map(sub => {

                        const SubIcon = sub.icon;

                        return (

                          <li
                            key={sub.title}
                            className="sidebar-sub-item"
                            onClick={() => navigate(sub.path)}
                          >

                            <SubIcon className="me-2" />

                            {sub.title}

                          </li>

                        );

                      })

                    }

                  </ul>

                }

              </li>

            );

          })}

        </ul>

      </div>
    </div>
  );

};

export default Sidebar;