import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SUPER_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";
import { FaSave, FaUtensils, FaEdit } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    createRestaurant,
    getRestaurantById,
    updateRestaurant,
} from "../../../services/restaurant.service";

function RestaurantForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [initialValues, setInitialValues] = useState({
        restaurant_name: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        country: "",
    });

    const validationSchema = Yup.object({
        restaurant_name: Yup.string().required(
            "Restaurant name is required"
        ),
        email: Yup.string()
            .email("Invalid email")
            .required("Email is required"),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
            .required("Phone is required"),
        city: Yup.string().required("City is required"),
        address: Yup.string().required("Address is required"),
        country: Yup.string().required("Country is required"),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,

        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    restaurant_name: values.restaurant_name,
                    email: values.email,
                    phone: values.phone,
                    city: values.city,
                    address: values.address,
                    country: values.country,
                };

                let res;

                if (id) {
                    res = await updateRestaurant(id, payload);
                } else {
                    res = await createRestaurant(payload);
                }

                if (res.success) {
                    resetForm();
                    navigate(SUPER_ADMIN_ROUTE.RESTOURANTSLIST);
                }
            } catch (err) {
                console.log(err.response?.data || err.message);
                alert("Server error");
            }
        },
    });

    useEffect(() => {
        if (!id) return;

        const fetchRestaurant = async () => {
            try {
                const res = await getRestaurantById(id);

                setInitialValues({
                    restaurant_name: res.data.restaurant_name || "",
                    email: res.data.email || "",
                    phone: res.data.phone || "",
                    city: res.data.city || "",
                    address: res.data.address || "",
                    country: res.data.country || "",
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchRestaurant();
    }, [id]);

    return (
        <div className="container py-4">
            {/* HEADER */}
            <div className="d-flex align-items-center mb-4">
                {id ? (
                    <FaEdit className="me-2 text-warning" />
                ) : (
                    <FaUtensils className="me-2 text-primary" />
                )}

                <h3 className="mb-0">
                    {id ? "Edit Restaurant" : "Add Restaurant"}
                </h3>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            {/* NAME */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">
                                    Restaurant Name
                                </label>
                                <input
                                    name="restaurant_name"
                                    placeholder="Enter restaurant name"
                                    className={`form-control ${formik.touched.restaurant_name &&
                                        formik.errors.restaurant_name
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.restaurant_name}
                                />
                                <div className="invalid-feedback">
                                    {formik.errors.restaurant_name}
                                </div>
                            </div>

                            {/* EMAIL */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    name="email"
                                    placeholder="Enter email address"
                                    className={`form-control ${formik.touched.email &&
                                        formik.errors.email
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                <div className="invalid-feedback">
                                    {formik.errors.email}
                                </div>
                            </div>

                            {/* PHONE */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    name="phone"
                                    placeholder="Enter 10 digit phone number"
                                    className={`form-control ${formik.touched.phone &&
                                        formik.errors.phone
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.phone}
                                />
                                <div className="invalid-feedback">
                                    {formik.errors.phone}
                                </div>
                            </div>

                            {/* CITY */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">City</label>
                                <input
                                    name="city"
                                    placeholder="Enter city name"
                                    className={`form-control ${formik.touched.city &&
                                        formik.errors.city
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.city}
                                />
                                <div className="invalid-feedback">
                                    {formik.errors.city}
                                </div>
                            </div>

                            {/* ADDRESS */}
                            <div className="col-12 mb-3">
                                <label className="form-label">Address</label>
                                <textarea
                                    name="address"
                                    rows="3"
                                    placeholder="Enter full restaurant address"
                                    className={`form-control ${formik.touched.address &&
                                        formik.errors.address
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.address}
                                />
                                <div className="invalid-feedback">
                                    {formik.errors.address}
                                </div>
                            </div>

                            {/* COUNTRY */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Country</label>

                                <select
                                    name="country"
                                    className={`form-select ${formik.touched.country &&
                                        formik.errors.country
                                        ? "is-invalid"
                                        : ""
                                        }`}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.country}
                                >
                                    <option value="">Select Country</option>

                                    <option value="India">India</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="Singapore">Singapore</option>
                                </select>

                                <div className="invalid-feedback">
                                    {formik.errors.country}
                                </div>
                            </div>
                        </div>

                        {/* BUTTON */}
                        <div className="text-end">
                            <button
                                type="submit"
                                className={`btn px-4 ${id ? "btn-warning" : "btn-primary"
                                    }`}
                            >
                                <FaSave className="me-2" />
                                {id
                                    ? "Update Restaurant"
                                    : "Save Restaurant"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RestaurantForm;