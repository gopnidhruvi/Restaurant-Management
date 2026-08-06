import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SUPER_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";
import {
    FaUserTie,
    FaEnvelope,
    FaPhone,
    FaSave,
    FaTimes,
    FaEdit,
} from "react-icons/fa";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
    createOwner,
    getOwnerById,
    updateOwner,
} from "../../../services/ownerService";
import { getRestaurants } from "../../../services/restaurant.service";

function OwnerForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [restaurants, setRestaurants] = useState([]);
    const [initialValues, setInitialValues] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        restaurant_id: "",
        status: "active",
    });
// validationSchema
    const validationSchema = Yup.object({
        name: Yup.string()
            .min(2, "Too short")
            .required("Owner name is required"),

        email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),

        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
            .required("Phone is required"),

        ...(id
            ? {}
            : {
                password: Yup.string()
                    .min(6, "Password must be at least 6 characters")
                    .required("Password is required"),
            }),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,

        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    restaurant_id: values.restaurant_id,
                };

                if (!id) {
                    payload.password = values.password;
                }

                let res;

                if (id) {
                    res = await updateOwner(id, payload);
                } else {
                    res = await createOwner(payload);
                }

                if (res.success) {
                    resetForm();
                    navigate(SUPER_ADMIN_ROUTE.OWNERLIST);
                }
            } catch (err) {
                console.log(err.response?.data || err.message);
                alert(err.response?.data?.message || "Server Error");
            }
        },
    });

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const res = await getRestaurants();
                setRestaurants(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRestaurants();
        if (!id) return;
        const fetchOwner = async () => {
            try {
                const res = await getOwnerById(id);
                setInitialValues({
                    name: res.data.name || "",
                    email: res.data.email || "",
                    password: "",
                    phone: res.data.phone || "",
                    restaurant_id:
                        res.data.restaurant_id ||
                        res.data.restaurant ||
                        "",
                    status: res.data.status || "active",
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchOwner();
    }, [id]);

  

    return (
        <div className="container py-4">
            {/* HEADER */}
            <div className="mb-4">
                <h3 className="fw-bold d-flex align-items-center gap-2">
                    {id ? <FaEdit /> : <FaUserTie />}
                    {id ? "Edit Owner" : "Create Owner"}
                </h3>

                <p className="text-muted mb-0">
                    {id
                        ? "Update owner details"
                        : "Add new restaurant owner details"}
                </p>
            </div>

            {/* CARD */}
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">

                    <form onSubmit={formik.handleSubmit}>
                        <div className="row g-3">

                            {/* Owner Name */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Owner Name
                                </label>

                                <input
                                    name="name"
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Enter owner name"
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

                            {/* Email */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Email Address
                                </label>

                                <input
                                    name="email"
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter email"
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

                            {/* Password */}
                            {!id && (
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Password
                                    </label>

                                    <input
                                        name="password"
                                        type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Enter password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />

                                    {formik.touched.password &&
                                        formik.errors.password && (
                                            <small className="text-danger">
                                                {formik.errors.password}
                                            </small>
                                        )}
                                </div>
                            )}

                            {/* Phone */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Phone Number
                                </label>

                                <input
                                    name="phone"
                                    type="text"
                                    className="form-control form-control-lg"
                                    placeholder="Enter phone number"
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

                            {/* Restaurant Dropdown */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Restaurant
                                </label>

                                <select
                                    name="restaurant_id"
                                    className="form-select form-select-lg"
                                    value={formik.values.restaurant_id}
                                    onChange={formik.handleChange}
                                >
                                    <option value="">
                                        Select Restaurant
                                    </option>

                                    {restaurants.map((restaurant) => (
                                        <option
                                            key={restaurant._id}
                                            value={restaurant._id}
                                        >
                                            {restaurant.restaurant_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    className="form-select form-select-lg"
                                    value={formik.values.status || "active"}
                                    onChange={formik.handleChange}
                                >
                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4"
                                onClick={() =>
                                    navigate(SUPER_ADMIN_ROUTE.OWNERLIST)
                                }
                            >
                                <FaTimes className="me-2" />
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className={`btn px-4 ${id ? "btn-warning" : "btn-primary"
                                    }`}
                            >
                                <FaSave className="me-2" />
                                {id ? "Update Owner" : "Save Owner"}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default OwnerForm;