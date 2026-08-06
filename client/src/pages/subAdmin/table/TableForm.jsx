import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { FaTable, FaSave } from "react-icons/fa";

import {
  createTable,
  updateTable,
  getTableById,
} from "../../../services/tableservice";

import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";

function TableForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    tableNumber: Yup.string().required("Table Number is required"),
    capacity: Yup.number()
      .required("Capacity is required")
      .min(1, "Minimum capacity is 1"),
    status: Yup.string().required("Status is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      tableNumber: "",
      capacity: "",
      status: "available",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        let res;
        if (id) {
          res = await updateTable(id, values);
        } else {
          res = await createTable(values);
        }

        if (res?.success) {
          navigate(SUB_ADMIN_ROUTE.TABLE_LIST);
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    if (id) {
      fetchTable();
    }
  }, [id]);

  const fetchTable = async () => {
    try {
      const res = await getTableById(id);

      formik.setValues({
        tableNumber: res.data.tableNumber || "",
        capacity: res.data.capacity || "",
        status: res.data.status || "available",
      });
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="container py-4 d-flex justify-content-center">

      <div
        className="form-card shadow-lg border-0 rounded-4 p-4"
        style={{ width: "600px" }}
      >

        <div className="d-flex align-items-center gap-3 mb-4">

          <div className="bg-blue text-white p-3 rounded-circle">
            <FaTable size={22} />
          </div>

          <div>
            <h4 className="mb-1 fw-bold">
              {id ? "Edit Table" : "Create Table"}
            </h4>

            <small className="text-muted">
              Manage restaurant tables
            </small>
          </div>

        </div>

        <form onSubmit={formik.handleSubmit}>

          {/* Table Number */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Table Number
            </label>
            <input
              type="text"
              name="tableNumber"
              placeholder="Enter Table Number"
              className="form-control"
              value={formik.values.tableNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.tableNumber &&
              formik.errors.tableNumber && (
                <small className="text-danger">
                  {formik.errors.tableNumber}
                </small>
              )}

          </div>

          {/* Capacity */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Capacity
            </label>

            <input
              type="number"
              name="capacity"
              placeholder="Enter Capacity"
              className="form-control"
              value={formik.values.capacity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />

            {formik.touched.capacity &&
              formik.errors.capacity && (
                <small className="text-danger">
                  {formik.errors.capacity}
                </small>
              )}

          </div>

          {/* Status */}

          <div className="mb-4">

            <label className="form-label fw-semibold">
              Status
            </label>

            <select
              name="status"
              className="form-select"
              value={formik.values.status}
              onChange={formik.handleChange}
            >
              <option value="available">
                Available
              </option>

              <option value="occupied">
                Occupied
              </option>

              <option value="reserved">
                Reserved
              </option>

              <option value="cleaning">
                Cleaning
              </option>
            </select>

          </div>

          <button
            type="submit"
            className="btn bg-blue text-white  w-100 py-2"
          >
            <FaSave className="me-2" />

            {id ? "Update Table" : "Save Table"}

          </button>

        </form>

      </div>
    </div>
  );
}

export default TableForm;