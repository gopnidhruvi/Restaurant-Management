import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrash,
  FaUndo,
  FaEyeSlash,
  FaEye,
  FaPlus
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  deleteCategory,
  getCategories,
  restoreCategory,
  toggleCategoryVisibility,
} from "../../../services/categoryService";

import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";

function CategoryList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // FETCH
  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCategories = categories.filter((category) => {
    if (filter === "all") return true;
    if (filter === "active") return category.status === "active";
    if (filter === "inactive") return category.status === "inactive";
    return true;
  });

  // MULTIPLE SELECT
  const handleSelect = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCategories(categories.map((c) => c._id));
    } else {
      setSelectedCategories([]);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this category!",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteCategory(id);

      setCategories((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isDeleted: true } : c
        )
      );

      Swal.fire(
        "Deleted!",
        "Category deleted successfully",
        "success"
      );
    }
  };

  // RESTORE
  const handleRecover = async (id) => {
    const result = await Swal.fire({
      title: "Recover Category?",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Recover",
    });

    if (result.isConfirmed) {
      await restoreCategory(id);

      setCategories((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isDeleted: false } : c
        )
      );

      Swal.fire(
        "Recovered!",
        "Category restored",
        "success"
      );
    }
  };

  // TOGGLE STATUS

  const handleToggleVisibility = async (id) => {
    try {
      const category = categories.find((c) => c._id === id);

      const newStatus =
        category.status === "active" ? "inactive" : "active";

      const res = await toggleCategoryVisibility(id, newStatus);

      setCategories((prev) =>
        prev.map((c) =>
          c._id === id
            ? {
              ...c,
              status: res.data.status,
            }
            : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Category Management</h2>
        <small className="text-muted">
          Manage restaurant categories efficiently
        </small>

        <div className="d-flex gap-2 mt-3 flex-wrap">
          <button
            className={`btn rounded-pill ${filter === "all" ? "btn-dark" : "btn-outline-dark"
              }`}
            onClick={() => setFilter("all")}
          >
            All ({categories.length})
          </button>

          <button
            className={`btn rounded-pill ${filter === "active"
              ? "btn-success"
              : "btn-outline-success"
              }`}
            onClick={() => setFilter("active")}
          >
            Active (
            {categories.filter((c) => c.status === "active").length})
          </button>

          <button
            className={`btn rounded-pill ${filter === "inactive"
              ? "btn-secondary"
              : "btn-outline-secondary"
              }`}
            onClick={() => setFilter("inactive")}
          >
            Inactive (
            {categories.filter((c) => c.status === "inactive").length})
          </button>

        </div>
      </div>

      {/* CARD VIEW */}
      <div className="row g-4">
        {filteredCategories.map((category) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={category._id}
            style={{
              backgroundColor: category.isDeleted ? "#ffebee" : "inherit",
              opacity: category.isDeleted ? 0.6 : 1
            }}>
            <div
              className="card border-0 shadow-sm overflow-hidden h-100"
              style={{
                borderRadius: "18px",
                transition: "0.3s",
              }}
            >
              {/* Image */}
              <div className="position-relative">
                <img
                  src={
                    category.image ||
                    "https://via.placeholder.com/400x220?text=No+Image"
                  }
                  alt={category.category_name}
                  className="w-100"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                {/* Status */}
                <span
                  className={`badge position-absolute top-0 end-0 m-3 ${category.status === "active"
                    ? "bg-success"
                    : "bg-danger"
                    }`}
                >
                  {category.status}
                </span>

                {/* Checkbox */}
                <div className="position-absolute top-0 start-0 m-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleSelect(category._id)}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="card-body">

                <h5 className="fw-bold mb-1">
                  {category.category_name}
                </h5>

                <div className="small text-secondary">

                  <div className="d-flex justify-content-between mb-2">
                    <span>Created</span>
                    <span>
                      {new Date(category.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>Visibility</span>

                    <span
                      className={`fw-semibold ${category.status === "active"
                        ? "text-success"
                        : "text-danger"
                        }`}
                    >
                      {category.status}
                    </span>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="card-footer bg-white border-0">

                <div className="d-flex justify-content-around">

                  <button
                    className="btn btn-light rounded-circle shadow-sm"
                    onClick={() =>
                      navigate(
                        `${SUB_ADMIN_ROUTE.CATEGORYEDIT}/${category._id}`
                      )
                    }
                  >
                    <FaEdit className="text-primary" />
                  </button>

                  {category.isDeleted ? (
                    <button
                      className="btn btn-light rounded-circle shadow-sm"
                      onClick={() => handleRecover(category._id)}
                    >
                      <FaUndo className="text-success" />
                    </button>
                  ) : (
                    <button
                      className="btn btn-light rounded-circle shadow-sm"
                      onClick={() => handleDelete(category._id)}
                    >
                      <FaTrash className="text-danger" />
                    </button>
                  )}

                  <button
                    className="btn btn-light rounded-circle shadow-sm"
                    onClick={() =>
                      handleToggleVisibility(category._id)
                    }
                  >
                    {category.status === "active" ? (
                      <FaEyeSlash className="text-warning" />
                    ) : (
                      <FaEye className="text-success" />
                    )}
                  </button>

                </div>

              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}

export default CategoryList;