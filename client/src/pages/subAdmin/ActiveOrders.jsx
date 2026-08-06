import React, { useEffect, useState } from "react";
import { FaEye, FaPlusCircle, FaMoneyBillWave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../services/orderService";
import { SUB_ADMIN_ROUTE, WAITER_ROUTE } from "../../Constant/RoutesConstant";
import { generateBill } from "../../services/billService";

function ActiveOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await getOrders();


            if (res.success) {
                const activeOrders = res.data.filter(
                    (o) =>
                        o.order_status !== "Completed" &&
                        o.order_status !== "Cancelled" &&
                        o.payment_status !== "Paid"
                );

                setOrders(activeOrders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.log(err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };
    const handleBill = async (order) => {
        try {
            const res = await generateBill({
                order_id: order._id,
                payment_method: "Cash",
            });

            if (res.success) {
                navigate(`${SUB_ADMIN_ROUTE.BILL}/${res.data._id}`);
            }
        } catch (err) {
            console.log(err.response?.data);
        }
    };

    return (
        <div className="container-fluid py-4">

            <h3 className="fw-bold mb-4">Active Orders</h3>

            <div className="row">

                {loading ? (
                    <div className="text-center py-5">
                        <h5>Loading...</h5>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                        <h5 className="text-muted">No Active Orders</h5>
                    </div>
                ) : (

                    orders.map((order) => (
                        <div className="col-lg-4 col-md-6 mb-4" key={order._id}>
                            <div className="card shadow-sm border-0 h-100">

                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="fw-bold mb-0">
                                            {order.orderNumber || order.order_number}
                                        </h6>
                                        <small className="text-muted">
                                            {new Date(order.createdAt).toLocaleTimeString()}
                                        </small>
                                    </div>

                                    <span
                                        className={`badge ${order.status === "Pending"
                                            ? "bg-warning text-dark"
                                            : order.status === "Preparing"
                                                ? "bg-primary"
                                                : order.status === "Completed"
                                                    ? "bg-success"
                                                    : "bg-danger"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="card-body">

                                    <div className="mb-2">
                                        <strong>Table :</strong>{" "}
                                        {order.table_id?.tableNumber || "-"}
                                    </div>

                                    <div className="mb-2">
                                        <strong>Customer :</strong>{" "}
                                        {order.customer_name || "Walk In"}
                                    </div>

                                    <div className="mb-2">
                                        <strong>Items :</strong>

                                        {order.items?.map((item, index) => (
                                            <div key={index}>
                                                {item.item_name} × {item.quantity}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-3">
                                        <strong>Total :</strong>{" "}
                                        ₹{order.total_amount || order.total || 0}
                                    </div>

                                    <div className="d-flex justify-content-between">

                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                        // onClick={() => navigate(`/waiter/order-view/${order._id}`)}
                                        >
                                            <FaEye className="me-1" />
                                            View
                                        </button>

                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() =>
                                                navigate(`${SUB_ADMIN_ROUTE.ORDER_EDIT}/${order._id}`)}>
                                            <FaPlusCircle className="me-1" />
                                            Add Item
                                        </button>

                                        <button
                                            className="btn btn-outline-warning btn-sm"
                                            onClick={() => handleBill(order)}
                                        >
                                            <FaMoneyBillWave className="me-1" />
                                            Bill
                                        </button>

                                    </div>

                                </div>

                            </div>
                        </div>
                    ))

                )}

            </div>

        </div>
    );
}

export default ActiveOrders;