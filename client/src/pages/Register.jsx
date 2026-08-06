import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

function Register() {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Add New Restaurant Owner</p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Full Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.name && formik.errors.name && (
              <small className="text-danger">
                {formik.errors.name}
              </small>
            )}
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.email && formik.errors.email && (
              <small className="text-danger">
                {formik.errors.email}
              </small>
            )}
          </div>

          <div className="mb-3">
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Phone Number"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.phone && formik.errors.phone && (
              <small className="text-danger">
                {formik.errors.phone}
              </small>
            )}
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.password && formik.errors.password && (
              <small className="text-danger">
                {formik.errors.password}
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;