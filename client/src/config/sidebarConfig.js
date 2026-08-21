import {
    FaHome,
    FaUtensils,
    FaClipboardList,
    FaPlusCircle,
    FaUsers,
    FaTable,
    FaTags,
    FaList,
    FaListUl,
    FaCartPlus,
    FaCog, FaThLarge
} from "react-icons/fa";

import { SUPER_ADMIN_ROUTE, MANAGER_ROUTE, SUB_ADMIN_ROUTE, WAITER_ROUTE } from "../Constant/RoutesConstant";
import { ROLES } from "../Constant/CommonConstant";

export const sidebarConfig = [

    // Dashboard
    {
        title: "Dashboard",
        icon: FaHome,
        path: "/dashboard",
        roles: [
            ROLES.SUPER_ADMIN,
            ROLES.OWNER,
            ROLES.MANAGER,
            ROLES.WAITER,
            ROLES.KITCHEN,
        ],
    },
    // =======================SUPER_ADMIN=====================
    // Restaurant
    {
        title: "Restaurants",
        icon: FaUtensils,
        roles: [ROLES.SUPER_ADMIN],

        children: [
            {
                title: "Restaurant List",
                icon: FaClipboardList,
                path: SUPER_ADMIN_ROUTE.RESTOURANTSLIST,
            },

            {
                title: "Add Restaurant",
                icon: FaPlusCircle,
                path: SUPER_ADMIN_ROUTE.RESTOURANTSADD,
            },
        ],

    },
    // Owner
    {
        title: "Owner",
        icon: FaUtensils,
        roles: [ROLES.SUPER_ADMIN],

        children: [
            {
                title: "Owner List",
                icon: FaClipboardList,
                path: SUPER_ADMIN_ROUTE.OWNERLIST,
            },

            {
                title: "Add Owner",
                icon: FaPlusCircle,
                path: SUPER_ADMIN_ROUTE.OWNERADD,
            },
        ],
    },
    // Settings
    {
        title: " Settings",
        icon: FaCog,
        roles: [ROLES.SUPER_ADMIN],

        children: [
            {
                title: "Settings",
                icon: FaCog,
                path: SUB_ADMIN_ROUTE.SETTINGS,
            },


        ],
    },

    // ========================OWNER=========================
    // Category
    {
        title: "Category",
        icon: FaTags,
        roles: [ROLES.OWNER, ROLES.MANAGER],

        children: [
            {
                title: "Category List",
                icon: FaList,
                path: SUB_ADMIN_ROUTE.CATEGORYLIST,
            },

            {
                title: "Add Category",
                icon: FaPlusCircle,
                path: SUB_ADMIN_ROUTE.CATEGORYADD,
            },
        ],
    },
    // Menu
    {
        title: "Menu",
        icon: FaUtensils,
        roles: [ROLES.OWNER, ROLES.MANAGER],

        children: [
            {
                title: "Menu List",
                icon: FaListUl,
                path: SUB_ADMIN_ROUTE.MENULIST,
            },

            {
                title: "Add Menu",
                icon: FaPlusCircle,
                path: SUB_ADMIN_ROUTE.MENUADD,
            },


        ],
    },
    // table
    {
        title: "Table",
        icon: FaTable,
        roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.WAITER],

        children: [
            {
                title: "Table List",
                icon: FaThLarge,
                path: SUB_ADMIN_ROUTE.TABLE_LIST,
                roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.WAITER],

            },

            {
                title: "Add Table",
                icon: FaPlusCircle,
                path: SUB_ADMIN_ROUTE.TABLE_ADD,
                roles: [ROLES.OWNER, ROLES.MANAGER],
            },
        ],
    },

    // Staff
    {
        title: "Staff",
        icon: FaUsers,
        roles: [ROLES.OWNER],
        children: [
            {
                title: "Staff List",
                icon: FaListUl,
                path: SUB_ADMIN_ROUTE.STAFFLIST,
            },

            {
                title: "Add Staff",
                icon: FaPlusCircle,
                path: SUB_ADMIN_ROUTE.STAFFADD,
            },
        ],
    },

    // Orders
    {
        title: "Orders",
        icon: FaClipboardList,
        roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.WAITER],

        children: [
            {
                title: "Add Order",
                icon: FaCartPlus,
                path: SUB_ADMIN_ROUTE.ORDER_ADD,
            },
            {
                title: "Order List",
                icon: FaList,
                path: SUB_ADMIN_ROUTE.ORDER_LIST,
            },
        ],
    },

    // Active Orders
    {
        title: "Active Orders",
        icon: FaList,
        path: SUB_ADMIN_ROUTE.ACTIVE_ORDERS,
        roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.WAITER],
    },

    // Waiting
    {
        title: "WaitingQueue",
        icon: FaClipboardList,
          path: SUB_ADMIN_ROUTE.WAITINGQUEUE,
        roles: [ROLES.OWNER, ROLES.MANAGER],
    },

    {
        title: "Bill List",
        icon: FaList,
        path: SUB_ADMIN_ROUTE.BILL_LIST,
        roles: [ROLES.OWNER, ROLES.MANAGER],
    },

    {
        title: "Kitchen",
        icon: FaList,
        path: SUB_ADMIN_ROUTE.KITCHEN,
        roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.WAITER],
    },


//   livescreen
 {
        title: "LiveScreen",
        icon: FaList,
        path: SUB_ADMIN_ROUTE.LIVESCREEN,
        roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.WAITER],
    },

];