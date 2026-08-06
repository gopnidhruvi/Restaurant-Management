import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaUndo,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  getStaff,
  deleteStaff,
  changeStaffStatus,
  restoreStaff,
} from "../../../services/staffService";

import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";

function StaffList() {
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // FETCH
  const fetchStaff = async () => {
    try {
      const res = await getStaff();
      setStaffData(res?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStaff();
     setCurrentPage(1);
  }, [selectedRole, selectedStatus]);
  // FILTER
  const filteredStaff = staffData.filter((s) => {
    const roleMatch = !selectedRole || s.role === selectedRole;
    const statusMatch = !selectedStatus || s.status === selectedStatus;
    return roleMatch && statusMatch;
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentStaff = filteredStaff.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    filteredStaff.length / itemsPerPage
  );

  // SELECT ALL
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStaff(staffData.map((s) => s._id));
    } else {
      setSelectedStaff([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedStaff((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // DELETE (soft delete UI)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Staff?",
      text: "This action cannot be undone",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes Delete",
    });

    if (result.isConfirmed) {
      await deleteStaff(id);

      setStaffData((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, is_deleted: true } : s
        )
      );

      Swal.fire("Deleted!", "Staff removed", "success");
    }
  };

  // RESTORE
  const handleRecover = async (id) => {
    const result = await Swal.fire({
      title: "Restore Staff?",
      showCancelButton: true,
      confirmButtonColor: "green",
      confirmButtonText: "Restore",
    });

    if (result.isConfirmed) {
      await restoreStaff(id);

      setStaffData((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, is_deleted: false } : s
        )
      );

      Swal.fire("Restored!", "Staff restored successfully", "success");
    }
  };

  // STATUS TOGGLE
  const handleToggleStatus = async (id) => {
    try {
      const staff = staffData.find((s) => s._id === id);
      if (!staff) return;

      const newStatus =
        staff.status === "active" ? "blocked" : "active";

      const res = await changeStaffStatus(id, newStatus);

      if (res?.success) {
        setStaffData((prev) =>
          prev.map((s) =>
            s._id === id ? { ...s, status: res.data.status } : s
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold mb-1">Staff Management</h2>
          <small className="text-muted">Manage restaurant staff</small>
        </div>
    
        <button
          className="btn btn-success"
          onClick={() => navigate(SUB_ADMIN_ROUTE.STAFFADD)}>
          <FaPlus className="me-2" />
          Add Staff
        </button>
      </div>

      {/* FILTER */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
            <option value="waiter">Waiter</option>
            <option value="kitchen">Kitchen</option>
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">

          <table className="table table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      staffData.length > 0 &&
                      selectedStaff.length === staffData.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentStaff.length > 0 ? (
                currentStaff.map((staff, index) => (
                  <tr
                    key={staff._id}
                    style={{
                      backgroundColor: staff.is_deleted
                        ? "#ffebee"
                        : "inherit",
                      opacity: staff.is_deleted ? 0.6 : 1,
                    }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(staff._id)}
                        onChange={() => handleSelect(staff._id)}
                      />
                    </td>

                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{staff.name}</td>
                    <td>{staff.email}</td>
                    <td>{staff.phone}</td>
                    <td>{staff.role}</td>

                    <td>
                      <span
                        className={`badge ${staff.status === "active"
                          ? "bg-success"
                          : "bg-danger"
                          }`}
                      >
                        {staff.status}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">

                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            navigate(
                              `${SUB_ADMIN_ROUTE.STAFFEDIT}/${staff._id}`
                            )
                          }
                          disabled={staff.is_deleted}
                        >
                          <FaEdit />
                        </button>

                        {staff.is_deleted ? (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleRecover(staff._id)}
                          >
                            <FaUndo />
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(staff._id)}
                          >
                            <FaTrash />
                          </button>
                        )}

                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleToggleStatus(staff._id)}
                          disabled={staff.is_deleted}
                        >
                          {staff.status === "active" ? <FaEyeSlash /> : <FaEye />}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No Staff Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <small className="text-muted">
          Showing {filteredStaff.length === 0 ? 0 : indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, filteredStaff.length)} of{" "}
          {filteredStaff.length} entries
        </small>

        <nav>
          <ul className="pagination mb-0">
            <li
              className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""
                  }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages || totalPages === 0
                  ? "disabled"
                  : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

    </div>
  );
}

export default StaffList;