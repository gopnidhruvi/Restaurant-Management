import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import {
  createMenuItem,
  getMenuItemById,
  updateMenuItem,
} from "../../../services/menuItemService";
import { getCategories } from "../../../services/categoryService";
import { getRestaurants } from "../../../services/restaurant.service";

import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";

import { FaUtensils, FaSave } from "react-icons/fa";

function MenuForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [preview, setPreview] = useState("");
  const [imageName, setImageName] = useState("No file chosen");
  const [imagePreview, setImagePreview] = useState(null);

  const validationSchema = Yup.object({
    item_name: Yup.string().required("Menu name is required"),
    category_id: Yup.string().required("Category is required"),
    price: Yup.number().required("Price is required"),
    status: Yup.string().required("Status is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      item_name: "",
      category_id: "",
      price: "",
      description: "",
      image: null,
      status: "active",
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("item_name", values.item_name);
        formData.append("category_id", values.category_id);
        formData.append("price", values.price);
        formData.append("description", values.description);
        formData.append("status", values.status);

        if (values.image && typeof values.image !== "string") {
          formData.append("image", values.image);
        }

        let res;

        if (id) {
          res = await updateMenuItem(id, formData);
        } else {
          res = await createMenuItem(formData);
        }

        if (res?.success) {
          navigate(SUB_ADMIN_ROUTE.MENULIST);
        }

      } catch (err) {
        console.log(err);
      }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryRes = await getCategories();

        setCategories(categoryRes.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchMenu = async () => {
      try {
        const res = await getMenuItemById(id);
        const data = res.data;

        formik.setValues({
          item_name: data.item_name || "",
          category_id: data.category_id?._id || "",
          price: data.price || "",
          description: data.description || "",
          image: data.image || "",
          status: data.status || "active",
        });
        const imageUrl = res.data.image;
        if (imageUrl) {
          const fileName = imageUrl.split("/").pop();
          setImageName(fileName);
          setImagePreview(imageUrl);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchMenu();
  }, [id]);

  return (
    <div className="container py-4 d-flex justify-content-center">

      <div className="form-card shadow-lg border-0 rounded-4 p-4" >
        <div className="d-flex align-items-center gap-3 mb-4">

          <div className="bg-blue text-white p-3 rounded-circle">
            <FaUtensils />
          </div>

          <div>
            <h4>{id ? "Edit Menu Item" : "Create Menu Item"}</h4>
            <small className="text-muted">
              Manage restaurant menu
            </small>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit}>

          <input
            type="text"
            name="item_name"
            placeholder="Menu Name"
            className="form-control mb-3"
            value={formik.values.item_name}
            onChange={formik.handleChange}
          />
          <select
            name="category_id"
            className="form-select mb-3"
            value={formik.values.category_id}
            onChange={formik.handleChange}
          >
            <option value="">
              Select Category
            </option>

            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.category_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price"
            className="form-control mb-3"
            value={formik.values.price}
            onChange={formik.handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="form-control mb-3"
            rows="3"
            value={formik.values.description}
            onChange={formik.handleChange}
          />

          {/* IMAGE */}
          <div className="input-group mb-2">
            <label htmlFor="image" className="btn btn-outline-secondary">
              Choose File
            </label>

            <input
              id="image"
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  formik.setFieldValue("image", file);
                  setImageName(file.name);
                }
              }}
            />

            <input
              type="text"
              className="form-control"
              value={imageName}
              readOnly
            />
          </div>

          <select
            name="status"
            className="form-select mb-4"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <button type="submit" className="btn bg-blue text-white  w-100" >
            <FaSave className="me-2" />
            {id ? "Update Menu Item" : "Save Menu Item"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default MenuForm;