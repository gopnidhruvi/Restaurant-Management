import React from "react";
import {
  FaClock,
  FaUtensils,
  FaCheckCircle,
} from "react-icons/fa";

const Kitchen = () => {

  // Temporary Data
  const pendingOrders = [
    {
      _id: 1,
      table: "Table 1",
      customer: "Rahul",
      items: [
        { name: "Pizza", qty: 2 },
        { name: "Coke", qty: 1 },
      ],
    },
  ];

  const preparingOrders = [
    {
      _id: 2,
      table: "Table 3",
      customer: "Amit",
      items: [
        { name: "Burger", qty: 2 },
      ],
    },
  ];

  const readyOrders = [
    {
      _id: 3,
      table: "Table 5",
      customer: "Priya",
      items: [
        { name: "Pasta", qty: 1 },
      ],
    },
  ];

  return (
    <div className="container-fluid py-3">

      <h3 className="fw-bold mb-4">
        <FaUtensils className="me-2" />
        Kitchen
      </h3>

      <div className="row">

        {/* Pending */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark fw-bold">
              <FaClock className="me-2" />
              Pending Orders
            </div>

            <div className="card-body">
              {pendingOrders.length === 0 ? (
                <p className="text-muted">No Pending Orders</p>
              ) : (
                pendingOrders.map((order) => (
                  <div key={order._id} className="border rounded p-3 mb-3">

                    <h6>{order.table}</h6>
                    <small>{order.customer}</small>

                    <hr />

                    {order.items.map((item, index) => (
                      <p key={index} className="mb-1">
                        {item.name} × {item.qty}
                      </p>
                    ))}

                    <button className="btn btn-primary btn-sm mt-3 w-100">
                      Start Cooking
                    </button>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Preparing */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white fw-bold">
              <FaUtensils className="me-2" />
              Preparing
            </div>

            <div className="card-body">
              {preparingOrders.length === 0 ? (
                <p className="text-muted">No Preparing Orders</p>
              ) : (
                preparingOrders.map((order) => (
                  <div key={order._id} className="border rounded p-3 mb-3">

                    <h6>{order.table}</h6>

                    {order.items.map((item, index) => (
                      <p key={index} className="mb-1">
                        {item.name} × {item.qty}
                      </p>
                    ))}

                    <button className="btn btn-success btn-sm mt-3 w-100">
                      Ready
                    </button>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ready */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white fw-bold">
              <FaCheckCircle className="me-2" />
              Ready Orders
            </div>

            <div className="card-body">
              {readyOrders.length === 0 ? (
                <p className="text-muted">No Ready Orders</p>
              ) : (
                readyOrders.map((order) => (
                  <div key={order._id} className="border rounded p-3 mb-3">

                    <h6>{order.table}</h6>

                    {order.items.map((item, index) => (
                      <p key={index} className="mb-1">
                        {item.name} × {item.qty}
                      </p>
                    ))}

                    <button
                      className="btn btn-secondary btn-sm mt-3 w-100"
                      disabled
                    >
                      Waiting for Waiter
                    </button>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Kitchen;