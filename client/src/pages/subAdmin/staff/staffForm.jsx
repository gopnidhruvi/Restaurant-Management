import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaUserTie, FaSave } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";
import { createStaff, getStaffById, updateStaff } from "../../../services/staffService";
import { getRestaurants } from "../../../services/restaurant.service";

function StaffForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Minimum 3 characters")
      .required("Name is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: id
      ? Yup.string()
      : Yup.string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),

    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone is required"),

    role: Yup.string().required("Role is required"),

    restaurant_id: Yup.string().required("Restaurant is required"),

    status: Yup.string().required("Status is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "",
      restaurant_id: "",
      status: "active"
    },

    validationSchema,

  
    onSubmit: async (values) => {
      try {
        let payload = { ...values };

        if (!payload.password) {
          delete payload.password;
        }

        let res;

        if (id) {
          res = await updateStaff(id, payload);
        } else {
          res = await createStaff(payload);
        }

        if (res?.success) {
          navigate(SUB_ADMIN_ROUTE.STAFFLIST);
        }
      } catch (err) {
        console.log(err.response?.data);
      }
    },
  });
  useEffect(() => {
    fetchRestaurants();

    if (id) {
      fetchStaff();
    }
  }, [id]);

  const fetchStaff = async () => {
    try {
      const res = await getStaffById(id);

      formik.setValues({
        name: res.data.name || "",
        email: res.data.email || "",
        password: "",
        phone: res.data.phone || "",
        role: res.data.role || "",
        restaurant_id: res.data.restaurant_id?._id || "",
        status: res.data.status || "active",
      });
    } catch (err) {
      console.log(err);
    }
  };
  const fetchRestaurants = async () => {
    try {
      const res = await getRestaurants();

      if (res.success) {
        setRestaurants(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container py-4 d-flex justify-content-center">

      <div className="form-card shadow-lg border-0 rounded-4 p-4">

        <div className="d-flex align-items-center gap-3 mb-4">

          <div className="bg-blue text-white p-3 rounded-circle">
            <FaUserTie />
          </div>

          <div>
            <h4>
              {id ? "Edit Staff" : "Create Staff"}
            </h4>

            <small className="text-muted">
              Manage restaurant staff
            </small>
          </div>

        </div>

        <form onSubmit={formik.handleSubmit}>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Staff Name"
            className={`form-control mb-3 ${formik.touched.name && formik.errors.name
              ? "is-invalid"
              : ""
              }`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="invalid-feedback">
            {formik.errors.name}
          </div>

          {/* Email */}
          <input type="email" name="email" placeholder="Email Address"
            className={`form-control mb-3 ${formik.touched.email && formik.errors.email
              ? "is-invalid" : ""}`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="invalid-feedback">
            {formik.errors.email}
          </div>

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder={
              id ? "Leave blank to keep same password" : "Password"}
            className={`form-control mb-3 ${formik.touched.password && formik.errors.password
                ? "is-invalid"
                : ""
              }`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.password && formik.errors.password && (
            <div className="invalid-feedback">
              {formik.errors.password}
            </div>
          )}

          {/* Phone */}
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className={`form-control mb-3 ${formik.touched.phone &&
              formik.errors.phone
              ? "is-invalid"
              : ""
              }`}
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <div className="invalid-feedback">
            {formik.errors.phone}
          </div>

          {/* Restaurant */}
          <select
            name="restaurant_id"
            className={`form-select mb-3 ${formik.touched.restaurant_id &&
              formik.errors.restaurant_id
              ? "is-invalid"
              : ""
              }`}
            value={formik.values.restaurant_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">
              Select Restaurant
            </option>

            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.restaurant_name}
              </option>
            ))}
          </select>
          <div className="invalid-feedback">
            {formik.errors.restaurant_id}
          </div>

          {/* Role */}
          <select
            name="role"
            className={`form-select mb-3 ${formik.touched.role &&
              formik.errors.role
              ? "is-invalid"
              : ""
              }`}
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">
              Select Role
            </option>

            <option value="manager">
              Manager
            </option>

            <option value="cashier">
              Cashier
            </option>

            <option value="waiter">
              Waiter
            </option>

            <option value="kitchen">
              Kitchen
            </option>
          </select>
          <div className="invalid-feedback">
            {formik.errors.role}
          </div>

          {/* Status */}
          <select
            name="status"
            className="form-select mb-4"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            <option value="active">
              Active
            </option>

            <option value="blocked">
              Blocked
            </option>
          </select>

          <button
            type="submit"
            className="btn bg-blue text-white  w-100"
          >
            <FaSave className="me-2" />
            {id
              ? "Update Staff"
              : "Save Staff"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default StaffForm;