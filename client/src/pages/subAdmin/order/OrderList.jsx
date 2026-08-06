import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye
} from "react-icons/fa";
import { getOrders, deleteOrder } from "../../../services/orderService";
import { useAuth } from "../../../context/AuthContext";
import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";

function OrderList() {

  const { user } = useAuth();

  const CURRENT_ROLE = user?.role;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [tableFilter, setTableFilter] = useState("All");

  const filteredOrders = orders.filter((order) =>
    (order.order_number || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (order.customer_name || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (order.table_id?.tableNumber?.toString() || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    (order.waiter_id?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getOrders();

      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Order deleted successfully.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteOrder(id);

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, is_deleted: true } : o
        )
      );

      Swal.fire("Deleted!", "Menu item deleted", "success");
    }
  };
  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">Order Management</h3>
          <small className="text-muted">
            Manage Restaurant Orders
          </small>
        </div>


        <button
          className="btn btn-success"
          onClick={() => navigate(SUB_ADMIN_ROUTE.ORDER_ADD)}
        >
          <FaPlus className="me-2" />
          Add Order
        </button>
        {/* )} */}
      </div>

      {/* Search & Filter */}
      <div className="card shadow-sm border-0 mb-4">

        <div className="card-body">

          <div className="row g-3">

            <div className="col-md-4">
              <div className="input-group">

                <span className="input-group-text">
                  <FaSearch />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Order..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
              >
                <option value="All">All Tables</option>

                {[
                  ...new Map(
                    orders
                      .filter((o) => o.table_id)
                      .map((o) => [o.table_id._id, o.table_id])
                  ).values(),
                ].map((table) => (
                  <option key={table._id} value={table._id}>
                    Table {table.tableNumber}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Order Table */}
      <div className="card shadow-sm border-0">

        <div className="card-header bg-white">
          <h5 className="mb-0">Order List</h5>
        </div>

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">

              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Table</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>

                    <td>{order.order_number || order._id.slice(-6)}</td>

                    <td>
                      {order.table_id?.tableNumber || "-"}
                    </td>

                    <td>
                      {order.customer_name || "-"}
                    </td>


                    <td>
                      ₹{order.total_amount || order.total || 0}
                    </td>

                    <td>
                      <span
                        className={`badge ${order.order_status === "Pending"
                          ? "bg-warning text-dark"
                          : order.order_status === "Preparing"
                            ? "bg-primary"
                            : order.order_status === "Ready"
                              ? "bg-info"
                              : order.order_status === "Served"
                                ? "bg-secondary"
                                : order.order_status === "Completed"
                                  ? "bg-success"
                                  : "bg-danger"
                          }`}
                      >
                        {order.order_status}
                      </span>
                    </td>

                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    {/* <td>

                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          navigate(`${WAITER_ROUTE.ORDER_EDIT}/${order._id}`)
                        }
                        disabled={order.is_deleted}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(order._id)}>
                        <FaTrash />
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default OrderList;