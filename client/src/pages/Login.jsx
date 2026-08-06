import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { COMMON_ROUTE, SUB_ADMIN_ROUTE, SUPER_ADMIN_ROUTE } from "../Constant/RoutesConstant";
import { ROLES } from "../Constant/CommonConstant";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const { setUser } = useAuth();


  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await login(values);


        if (res.success) {
          const user = res.data;
          // console.log(user.role);
          // console.log(ROLES.SUPER_ADMIN);
          setUser(user);
          localStorage.setItem("user", JSON.stringify(user));


          // ROLE BASED REDIRECT
          if (user.role === ROLES.SUPER_ADMIN) {
            navigate(SUPER_ADMIN_ROUTE.RESTOURANTSLIST);
          }
          else if (
            user.role === ROLES.OWNER ||
            user.role === ROLES.MANAGER ||
            user.role === ROLES.WAITER ||
            user.role === ROLES.KITCHEN
          ) {
            navigate(COMMON_ROUTE.DASHBOARD);
          }
        }
      } catch (err) {
        console.log(err.response?.data?.message || "Login failed");
      }
    }
  });

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* <div className="login-logo">🍽</div> */}

        <h2>Restaurant POS</h2>
        <p>Sign in to continue</p>

        <form onSubmit={formik.handleSubmit}>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className={`form-control ${formik.touched.email && formik.errors.email
                ? "is-invalid"
                : ""
                }`}
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className={`form-control ${formik.touched.password && formik.errors.password
                ? "is-invalid"
                : ""
                }`}
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">
                {formik.errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;