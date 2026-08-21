import React, { useEffect, useState } from "react";
import {FaClock,FaUtensils,FaCheckCircle,FaUser,FaChair,} from "react-icons/fa";
import { getKitchenOrders,acceptKitchenOrder,readyKitchenOrder,servedKitchenOrder,} from "../../services/kitchenService";

const Kitchen = () => {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchKitchenOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getKitchenOrders();
      console.log("Kitchen Orders:", res);
      setKitchenOrders(res?.data || []);
    } catch (err) {
      console.error("Kitchen orders error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load kitchen orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKitchenOrders();
  }, []);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

  
  const handleStartCooking = async (id) => {
    try {
      setActionLoading(id);
      await acceptKitchenOrder(id);
      await fetchKitchenOrders();
    } catch (err) {
      console.error("Start cooking error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to start cooking"
      );
    } finally {
      setActionLoading(null);
    }
  };

 
  const handleReady = async (id) => {
    try {
      setActionLoading(id);

      await readyKitchenOrder(id);
      await fetchKitchenOrders();
    } catch (err) {
      console.error("Ready order error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to mark order ready"
      );
    } finally {
      setActionLoading(null);
    }
  };


  const handleServed = async (id) => {
    try {
      setActionLoading(id);

      await servedKitchenOrder(id);

      await fetchKitchenOrders();
    } catch (err) {
      console.log("Served order error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to serve order"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const getTableName = (order) => {
    if (order?.table_id?.tableNumber) {
      return `T${order.table_id.tableNumber}`;
    }

    if (order?.table_id?.table_number) {
      return `T${order.table_id.table_number}`;
    }

    return "T-NA";
  };
  
  const getOrderNumber = (order) => {
    return (
      order?.order_id?.order_number ||
      order?.kot_number ||
      order?._id?.slice(-6).toUpperCase() ||
      "N/A"
    );
  };
  const getQuantity = (item) => {
    return item?.quantity || item?.qty || 1;
  };


  const getItemName = (item) => {
    return (
      item?.name ||
      item?.menu_item_name ||
      item?.menu_item_id?.item_name ||
      "Unknown Item"
    );
  };


  const isVeg = (item) => {
    return (
      item?.food_type === "Veg" ||
      item?.foodType === "Veg" ||
      item?.menu_item_id?.food_type === "Veg"
    );
  };

  const getElapsedTime = (order) => {
    if (!order?.createdAt) {
      return "0:00";
    }

    const created = new Date(order.createdAt);
    const diff = Math.max(
      0,
      Math.floor((currentTime - created) / 1000)
    );

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "kds-pending";

      case "Preparing":
        return "kds-preparing";

      case "Ready":
        return "kds-ready";

      default:
        return "";
    }
  };

  const renderOrderCard = (order) => {
    const status = order.kitchen_status;

    return (
      <div
        key={order._id}
        className={`kds-card ${getStatusClass(status)}`}
      >
        {/* TOP */}
        <div className="kds-top">
          <div className="d-flex align-items-center gap-2">
            <div className="kds-table">
              {getTableName(order)}
            </div>
            <div className="kds-order-number">
              {getOrderNumber(order)}
            </div>
          </div>
          <div className="kds-time">
            <FaClock className="me-1" />
            {getElapsedTime(order)}
          </div>
        </div>
        {/* CUSTOMER */}
        <div className="kds-customer">
         
        </div>
        {/* ITEMS */}
        <div className="kds-items">
          {order.items?.map((item, index) => (
            <div
              key={item._id || index}
              className="kds-item">
              <div className="d-flex align-items-center">
                <span className="kds-qty">
                  {getQuantity(item)}
                </span>
                <span className="fw-semibold">
                  {getQuantity(item)} ×{" "}
                  {getItemName(item)}
                </span>
              </div>
              {isVeg(item) && (
                <span className="veg-icon">
                  ●
                </span>
              )}
            </div>
          ))}
        </div>
        {/* ACTION */}
        <div className="kds-action">
          {status === "Pending" && (
            <button
              className="kds-btn kds-btn-start"
              onClick={() =>
                handleStartCooking(order._id)}
              disabled={actionLoading === order._id}>
              {actionLoading === order._id ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Starting...
                </>
              ) : (
                <>
                  <FaUtensils className="me-2" />
                  Start Cooking
                </>
              )}
            </button>
          )}

          {status === "Preparing" && (
            <button
              className="kds-btn kds-btn-ready"
              onClick={() =>
                handleReady(order._id)
              }
              disabled={actionLoading === order._id}
            >
              {actionLoading === order._id ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Updating...
                </>
              ) : (
                <>
                  <FaCheckCircle className="me-2" />
                  Mark all ready
                </>
              )}
            </button>

          )}

          {status === "Ready" && (

            <button
              className="kds-btn kds-btn-waiter"
              onClick={() =>
                handleServed(order._id)
              }
              disabled={actionLoading === order._id}
            >
              {actionLoading === order._id
                ? "Serving..."
                : "Waiting for Waiter"}
            </button>

          )}

        </div>

      </div>
    );
  };
  if (loading) {
    return (
      <div className="text-center py-5">

        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="mt-2 text-muted">
          Loading kitchen orders...
        </p>

      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            <FaUtensils className="me-2" />
            Kitchen Display
          </h3>
          <small className="text-muted">
            Live Kitchen Orders
          </small>
        </div>
        <button
          className="btn btn-outline-primary"
          onClick={fetchKitchenOrders}>
          Refresh
        </button>
      </div>
      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      {/* ORDERS */}
      {kitchenOrders.length === 0 ? (
        <div className="text-center py-5">
          <FaUtensils size={50}
            className="text-muted mb-3"
          />
          <h5>
            No Kitchen Orders
          </h5>
          <p className="text-muted">
            New orders will appear here.
          </p>
        </div>
      ) : (
        <div className="kds-grid">
          {kitchenOrders.map((order) =>
            renderOrderCard(order)
          )}
        </div>
      )}
    </div>
  );
};

export default Kitchen;