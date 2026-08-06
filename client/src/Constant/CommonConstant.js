
export const ROLES = {
    SUPER_ADMIN: "super_admin",
    OWNER: "owner",      
    MANAGER: "manager",
    WAITER: "waiter",
    KITCHEN: "kitchen",
};

// export const CURRENT_ROLE = ROLES.OWNER;


export const DEFAULT_ADMIN = {
    NAME: "admin",
    EMAIL: "admin@gmail.com",
    PASSWORD: "123456",
    CONFIRMPASSWORD: "123456",
    ROLE: ROLES.SUPER_ADMIN
}

