import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaEyeSlash, FaUndo, FaEye, FaChair } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SUB_ADMIN_ROUTE, WAITER_ROUTE } from "../../../Constant/RoutesConstant";
import { deleteTable, getAllTables, restoreTable, updateTableStatus } from "../../../services/tableservice";
import { getWaitingList } from "../../../services/waitingService";
import { useAuth } from "../../../context/AuthContext";


function TableList() {
  const { user } = useAuth();
  const CURRENT_ROLE = user?.role;
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const isManager = CURRENT_ROLE?.toLowerCase() === "manager";
  const location = useLocation();
  const waitingData = location.state || {};
  const [loading, setLoading] = useState(true);

  const isWaiter = CURRENT_ROLE?.toLowerCase() === "waiter";
  const isAdmin = !isManager && !isWaiter;
  const [statusDropdown, setStatusDropdown] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const tableRes = await getAllTables();
      let waitingList = [];
      if (isWaiter || isManager) {
        const waitingRes = await getWaitingList({ status: "Seated" });
        if (waitingRes.success) {
          waitingList = waitingRes.data;
        }
      }

      const tableData = (tableRes.data || []).map((table) => {
        const waiting =
          table.status?.toLowerCase() === "occupied"
            ? waitingList.find(
              (w) => w.table_id && w.table_id._id === table._id
            )
            : null;
        return {
          ...table,
          customer_name: table.customer_name || "",
          waiting_id: waiting?._id || null,
          phone: waiting?.phone || "",
          party_size: waiting?.party_size || "",

        };
      });

      setTables(tableData);
    } catch (err) {
      console.log(err);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };


  const handleTableClick = (table) => {
    console.log("HANDLE CLICK", table);
    navigate(SUB_ADMIN_ROUTE.ORDER_ADD, {
      state: {
        table: table,
        table_id: table._id,
        tableNumber: table.tableNumber,
        customer_name: table.customer_name,
        // waiting_entry_id: null,
        phone: table.phone,
        party_size: table.party_size,
        order_type: "Dine In",
      }
    });
  };
  // Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This table will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTable(id);

      setTables((prev) =>
        prev.map((t) =>
          t?._id === id
            ? {
              ...t,
              isDeleted: true,
            }
            : t
        )
      );

      Swal.fire("Deleted!", "", "success");
    } catch (err) {
      console.log(err);
    }
  };
  // Restore
  const handleRecover = async (id) => {
    const result = await Swal.fire({
      title: "Restore Table?",
      icon: "question",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      await restoreTable(id);

      setTables((prev) =>
        prev.map((t) =>
          t?._id === id
            ? {
              ...t,
              isDeleted: false,
            }
            : t
        )
      );

      Swal.fire("Restored!", "", "success");
    } catch (err) {
      console.log(err);
    }
  };
  // Status Toggle
  const handleToggleStatus = async (id, selectedStatus = null) => {
    try {
      const item = tables.find((t) => t?._id === id);
      if (!item) return;
      let newStatus;
      if (selectedStatus) {
        newStatus = selectedStatus;
      }
      else {
        switch (item.status?.toLowerCase()) {
          case "available":
            newStatus = "occupied";
            break;

          case "occupied":
            newStatus = "reserved";
            break;

          case "reserved":
            newStatus = "cleaning";
            setTimeout(async () => {
              try {
                await updateTableStatus(id, "available");

                setTables((prev) =>
                  prev.map((t) =>
                    t._id === id
                      ? {
                        ...t,
                        status: "available",
                      }
                      : t
                  )
                );
              } catch (err) {
                console.log("Auto available error:", err);
              }
            }, 10 * 60 * 1000);

            break;

          case "cleaning":
            newStatus = "available";
            break;

          default:
            newStatus = "available";
        }
      }
      const res = await updateTableStatus(id, newStatus);
      console.log("TABLE STATUS UPDATED:", newStatus);
      setTables((prev) =>
        prev.map((t) =>
          t?._id === id
            ? {
              ...t,
              status: res?.data?.status || newStatus,
            }
            : t
        )
      );

    } catch (err) {
      console.log("STATUS UPDATE ERROR:", err);
    }
  };
  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Table Management</h2>
          <small className="text-muted">
            Manage restaurant tables
          </small>
        </div>
        {!isManager && !isWaiter && (
          <button className="btn btn-success"
            onClick={() => navigate(SUB_ADMIN_ROUTE.TABLE_ADD)}>
            <FaPlus className="me-2" />Add Table
          </button>
        )}
      </div>

      {/* card */}
      <div className="row">
        {tables.filter((table) => {
          if (!table) return false;

          // Waiter & Manager Occupied table hide
          if (
            (isWaiter || isManager) &&
            table.status?.toLowerCase() === "occupied"
          ) {
            return false;
          }

          return true;
        }).length > 0 ? (
          tables
            .filter((table) => {
              if (!table) return false;
              if (
                (isWaiter || isManager) &&
                table.status?.toLowerCase() === "occupied"
              ) {
                return false;
              }
              return true;
            })
            .map((table) => {
              const status = (
                table.status ||
                table.tableStatus ||
                table.table_status ||
                (table.isOccupied ? "Occupied" : "Available")
              ).toLowerCase();

              return (
                <div
                  className="col-xl-3 col-lg-4 col-md-6 mb-4"
                  key={table._id}>
                  <div
                    className="card shadow border-0 h-100"
                    style={{
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                    onClick={() => handleTableClick(table)}
                  >
                    <div className="card-body text-center">
                      <FaChair
                        size={45}
                        className={
                          status === "available"
                            ? "text-success"
                            : status === "occupied"
                              ? "text-danger"
                              : status === "reserved"
                                ? "text-warning"
                                : status === "cleaning"
                                  ? "text-warning"
                                  : "text-warning"
                        } />
                      <h4 className="mt-3">
                        Table {table.tableNumber}
                      </h4>
                      <p className="mb-1">
                        <strong>Capacity:</strong> {table.capacity} Seats
                      </p>
                      <span
                        className={`badge ${status === "available"
                          ? "bg-success"
                          : status === "occupied"
                            ? "bg-danger"
                            : status === "reserved"
                              ? "bg-warning text-dark"
                              : status === "cleaning"
                                ? "bg-warning"
                                : "bg-warning"
                          }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {isAdmin && (
                        <div className="d-flex justify-content-center gap-2 mt-3">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `${SUB_ADMIN_ROUTE.TABLE_EDIT}/${table._id}`
                              );
                            }}
                            disabled={table.isDeleted}>
                            <FaEdit />
                          </button>
                          {table.isDeleted ? (
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRecover(table._id);
                              }}>
                              <FaUndo />
                            </button>
                          ) : (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(table._id);
                              }}>
                              <FaTrash />
                            </button>
                          )}

                          {statusDropdown === table._id ? (
                            <select
                              className="form-select form-select-sm text-nowrap"
                              value={table.status}
                              onChange={(e) => {
                                const newStatus = e.target.value;

                                handleToggleStatus(table._id, newStatus);
                                setStatusDropdown(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              disabled={table.isDeleted}
                            >
                              <option value="available">Available</option>
                              <option value="occupied">Occupied</option>
                              <option value="reserved">Reserved</option>
                              <option value="cleaning">Cleaning</option>
                            </select>
                          ) : (
                            <button
                              className={`btn btn-sm text-nowrap ${table.status === "cleaning"
                                  ? "btn-outline-success"
                                  : "btn-outline-warning"
                                }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (table.status === "cleaning") {
                                  handleToggleStatus(table._id, "available");
                                } else {
                                  setStatusDropdown(table._id);
                                }
                              }}
                              disabled={table.isDeleted}>
                              {table.status === "cleaning"
                                ? "Make Available"
                                : "Change Status"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        ) : (
          <div className="col-12 text-center">
            <h5>No Tables Available</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableList;