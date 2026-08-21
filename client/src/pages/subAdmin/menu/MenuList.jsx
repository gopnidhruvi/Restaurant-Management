import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEyeSlash, FaEye, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMenuItems, deleteMenuItem, restoreMenuItem, changeMenuItemStatus, } from "../../../services/menuItemService";
import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";

function MenuList() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  // Fetch
  const fetchData = async () => {
    try {
      const res = await getMenuItems();
      setMenus(res?.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Filter
  const filteredMenus = menus.filter((menu) => {
    const categoryMatch =
      !selectedCategory ||
      menu.category_id?._id === selectedCategory;
    return categoryMatch;
  });

  const categories = [
    ...new Map(
      menus
        .filter((m) => m.category_id)
        .map((m) => [m.category_id._id, m.category_id])
    ).values(),
  ];

  // Select
  const handleSelect = (id) => {
    setSelectedMenus((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMenus(menus.map((m) => m._id));
    } else {
      setSelectedMenus([]);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This menu item will be deleted!",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteMenuItem(id);

      setMenus((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, is_deleted: true } : m
        )
      );

      Swal.fire("Deleted!", "Menu item deleted", "success");
    }
  };

  // Restore
  const handleRecover = async (id) => {
    const result = await Swal.fire({
      title: "Restore item?",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Restore",
    });

    if (result.isConfirmed) {
      await restoreMenuItem(id);

      setMenus((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, is_deleted: false } : m
        )
      );

      Swal.fire("Restored!", "Menu item restored", "success");
    }
  };

  // Status Toggle
  const handleToggleStatus = async (id) => {
    try {
      const item = menus.find((m) => m._id === id);
      const newStatus =
        item.status === "active" ? "inactive" : "active";

      const res = await changeMenuItemStatus(id, newStatus);

      setMenus((prev) =>
        prev.map((m) =>
          m._id === id
            ? { ...m, status: res?.data?.status }
            : m
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageClick = (menu) => {
    Swal.fire({
      title: menu.item_name,
      text: menu.description || "No description available",
      imageUrl: menu.image,
      imageWidth: 200,
      imageHeight: 200,
      imageAlt: "Menu Image",
    });
  };


  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Menu Management</h2>
        <small className="text-muted">
          Manage restaurant menu items
        </small>
      </div>

      {/* // ================== Owner Table ================== */}
      <>
        {/* Filter */}
        <div className="row mb-4">
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="row g-4">
          {filteredMenus.length > 0 ? (
            filteredMenus.map((menu) => (
              <div
                className="col-xl-3 col-lg-4 col-md-6"
                key={menu._id}
              >
                <div
                  className="card border-0 shadow-sm h-100 overflow-hidden"
                  style={{
                    borderRadius: "18px",
                    backgroundColor: menu.is_deleted ? "#ffebee" : "#fff",
                    opacity: menu.is_deleted ? 0.6 : 1,
                  }}
                >
                  {/* Image */}
                  <div className="position-relative">
                    <img
                      src={
                        menu.image ||
                        "https://via.placeholder.com/400x220?text=No+Image"
                      }
                      alt={menu.item_name}
                      className="w-100"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => handleImageClick(menu)}
                    />

                    {/* Status */}
                    <span
                      className={`badge position-absolute top-0 end-0 m-3 ${menu.status === "active"
                        ? "bg-success"
                        : "bg-danger"
                        }`}
                    >
                      {menu.status}
                    </span>

                    {/* Checkbox */}
                    <div className="position-absolute top-0 start-0 m-3">
                      <input
                        type="checkbox"
                        checked={selectedMenus.includes(menu._id)}
                        onChange={() => handleSelect(menu._id)}
                      />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="card-body">

                    <h5 className="fw-bold mb-2">
                      {menu.item_name}
                    </h5>

                    <div className="small text-secondary">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Category</span>
                        <span>{menu.category_id?.category_name || "-"}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Price</span>
                        <span className="fw-bold text-success">
                          ₹{menu.price}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span>Created</span>
                        <span>
                          {menu.createdAt
                            ? new Date(menu.createdAt).toLocaleDateString("en-IN")
                            : "-"}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Status</span>
                        <span
                          className={`fw-semibold ${menu.status === "active"
                            ? "text-success"
                            : "text-danger"
                            }`}
                        >
                          {menu.status}
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
                            `${SUB_ADMIN_ROUTE.MENUEDIT}/${menu._id}`
                          )
                        }
                        disabled={menu.is_deleted}
                      >
                        <FaEdit className="text-primary" />
                      </button>

                      {menu.is_deleted ? (
                        <button
                          className="btn btn-light rounded-circle shadow-sm"
                          onClick={() => handleRecover(menu._id)}
                        >
                          <FaUndo className="text-success" />
                        </button>
                      ) : (
                        <button
                          className="btn btn-light rounded-circle shadow-sm"
                          onClick={() => handleDelete(menu._id)}
                        >
                          <FaTrash className="text-danger" />
                        </button>
                      )}

                      <button
                        className="btn btn-light rounded-circle shadow-sm"
                        onClick={() =>
                          handleToggleStatus(menu._id)
                        }
                        disabled={menu.is_deleted}
                      >
                        {menu.status === "active" ? (
                          <FaEyeSlash className="text-warning" />
                        ) : (
                          <FaEye className="text-success" />
                        )}
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h5>No Menu Items Found</h5>
            </div>
          )}
        </div>
      </>
    </div>
  );
}

export default MenuList;