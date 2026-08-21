import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import { createCategory,getCategoryById,updateCategory} from "../../../services/categoryService";
import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";
import { FaTags, FaImage, FaSave } from "react-icons/fa";

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageName, setImageName] = useState("No file chosen");
  const [imagePreview, setImagePreview] = useState(null);
  // validation
  const validationSchema = Yup.object({
    category_name: Yup.string()
      .min(2)
      .required("Category name is required"),
    status: Yup.string()
      .oneOf(["active", "inactive"])
      .required("Status required"),
  });

  //  Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      category_name: "",
      description: "",
      status: "active",
      image: null,

    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("category_name", values.category_name);
        formData.append("description", values.description || "");
        formData.append("status", values.status);
        if (values.image && typeof values.image !== "string") {
          formData.append("image", values.image);
        }
        let res;
        if (id) {
          res = await updateCategory(id, formData);
        } else {
          res = await createCategory(formData);
        }
        if (res?.success) {
          navigate(SUB_ADMIN_ROUTE.CATEGORYLIST);
        }
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    }
  });
  // fetch category for edit
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const res = await getCategoryById(id);
        formik.setValues({
          category_name: res.data.category_name || "",
          description: res.data.description || "",
          status: res.data.status || "active",
          image: res.data.image || null,
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

    fetchCategory();
  }, [id]);

  return (
    <div className="container py-4 d-flex justify-content-center">
      <div className="form-card shadow-lg border-0 rounded-4 p-4" >
        {/* HEADER */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="bg-blue text-white p-3 rounded-circle">
            <FaTags />
          </div>

          <div>
            <h4>{id ? "Edit Category" : "Create Category"}</h4>
            <small className="text-muted">Manage categories</small>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={formik.handleSubmit}>
          {/* Name */}
          <input name="category_name" className="form-control mb-2"  placeholder="Category Name"
            value={formik.values.category_name}
            onChange={formik.handleChange}/>

          {/* Description */}
          <textarea  name="description" className="form-control mb-2" placeholder="Description"
            value={formik.values.description} onChange={formik.handleChange} />

          {/* Image */}
          <div className="input-group mb-2">
            <label htmlFor="image" className="btn btn-outline-secondary">  Choose File</label>

            <input id="image"  type="file" hidden
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  formik.setFieldValue("image", file);
                  setImageName(file.name);
                }
              }}/>

            <input  type="text" className="form-control" value={imageName}
              readOnly />
          </div>

          {/* Status */}
          <select  name="status" className="form-select mb-3"
            value={formik.values.status} onChange={formik.handleChange} >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Subnit */}
          <button type="submit" className="btn bg-blue text-white w-100">
            <FaSave className="me-2" />
            {id ? "Update Category" : "Save Category"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CategoryForm;