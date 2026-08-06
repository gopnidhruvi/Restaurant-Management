// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import api from "../api/axios";

// const PrivateRoute = () => {

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
//         ? <Outlet />
//         : <Navigate to="/login" replace />;
// };

// export default PrivateRoute;

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import api from "../api/axios";

function PrivateRoute({ role }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await api.get("/profile");

            console.log("PROFILE DATA:", res.data.data);

            setUser(res.data.data);
        } catch (error) {
            console.log(error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role-based protection
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;