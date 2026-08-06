

export const AUTH_ROUTE = {
    LOGIN: "/login",
    REGISTER: "/register",
    ERROR: "*"
}
// Common Route
export const COMMON_ROUTE = {
    DASHBOARD: "/dashboard",
};
// super admin
export const SUPER_ADMIN_ROUTE = {
    RESTOURANTSLIST: "/RestaurantsList",
    RESTOURANTSADD: "/RestaurantsAdd",
    RESTOURANTSEDIT: "/RestaurantsEdit",

    // OWNER
    OWNERLIST: "/ownersList",
    OWNERADD: "/ownersAdd",
    OWNEREDIT: "/ownersEdit",

    REPORTS: "/Reportsa"
}
// sub admin
export const SUB_ADMIN_ROUTE = {
    CATEGORYLIST: "/category/list",
    CATEGORYADD: "/category/add",
    CATEGORYEDIT: "/category/edit/:id",

    // Menu Item
    MENULIST: "/subadmin/menu-item",
    MENUADD: "/subadmin/menu-item/add",
    MENUEDIT: "/subadmin/menu-item/edit/:id",

    STAFFLIST: "/subadmin/staff/list",
    STAFFADD: "/subadmin/staff/add",
    STAFFEDIT: "/subadmin/staff/edit",

    // Table 
    TABLE_LIST: "/sub-admin/table-list",
    TABLE_ADD: "/sub-admin/table-add",
    TABLE_EDIT: "/sub-admin/table-edit",
    PROFILE: "/subadmin/profile",

    // Order
    ORDER_ADD: "/sub-admin/Order-add",
    ORDER_EDIT: "/sub-admin/Order-edit",
    ORDER_LIST: "/sub-admin/Order-list",

    // Activite
    ACTIVE_ORDERS: "/sub-admin/active-orders",

    // Bill
    BILL: "/sub-admin/bill",
    BILL_LIST: "/sub-admin/bill-list",

    // Waiting
    WAITINGQUEUE: "/manager/waiting-queue",
    WATINGORDERCARD: "/manager/waiting-order-card",
    TABLEASSINGMODAL: "/manager/table-assign-modal",


KITCHEN: "/kitchen",
};

