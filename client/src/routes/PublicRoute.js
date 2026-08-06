// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import api from "../api/axios";

// function PublicRoute() {

//     const [loading, setLoading] = useState(true);

//     const [isAuthenticated, setIsAuthenticated] = useState(false);

//     useEffect(() => {

//         checkAuth();

//     }, []);

//     const checkAuth = async () => {

//         try {

//             await api.get("/profile");

//             setIsAuthenticated(true);

//         } catch (error) {

//             setIsAuthenticated(false);
//         }

//         setLoading(false);
//     };

//     if (loading) {

//         return <h1>Loading...</h1>;
//     }

//     return isAuthenticated
//         ? <Navigate to="/" replace />
//         : <Outlet />;
// }

// export default PublicRoute;

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";
import { ROLES } from "../constant/CommonConstant";

function PublicRoute() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await api.get("/profile");

            setUser(res.data.data);

        } catch (error) {
            setUser(null);
        }

        setLoading(false);
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (user) {

        if (user.role === ROLES.ADMIN) {
            return <Navigate to="/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PublicRoute; 