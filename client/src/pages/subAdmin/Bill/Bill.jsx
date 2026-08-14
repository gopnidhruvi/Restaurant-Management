import React, { useEffect, useState } from "react";
import {
  FaPrint,
  FaReceipt,
  FaChair,
  FaUser,
  FaMoneyBillWave,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { confirmPayment, getBillById } from "../../../services/billService";
import { toast } from "react-toastify";


function Bill() {
  const { id } = useParams();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBill();
  }, []);

  const loadBill = async () => {
    // console.log("Bill Page ID:", id);
    try {
      const res = await getBillById(id);

      if (res.success) {
        setBill(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h3>Loading...</h3>;
  if (!bill) return <h3>Bill Not Found</h3>;

  const handlePayment = async () => {
    try {
      const res = await confirmPayment(bill._id, {
        payment_method: "Cash"
      });
      if (res.success) {
        toast.success("Payment Successful");
        loadBill();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container py-4">
      <div
        className="card shadow mx-auto"
        style={{ maxWidth: "850px", borderRadius: "15px" }}
      >
        {/* Header */}

        <div className="card-body">

          <div className="text-center border-bottom pb-3 mb-4">
            <h2 className="fw-bold text-success mb-1">
              {bill.order_id?.table_id?.restaurant_id?.restaurant_name}
            </h2>

            {/* <p>{bill.order_id?.table_id?.restaurant_id?.address}</p>
            <p>Phone: {bill.order_id?.table_id?.phone}</p> */}
          </div>
          {/* Bill Info */}
          <div className="row mb-4">
            <div className="col-md-6">
              <p className="mb-1">
                <strong>Bill No :</strong> {bill.bill_number}
              </p>
              <p className="mb-1">
                <strong>Order No :</strong> {bill.order_id?.order_number}
              </p>
              <p className="mb-1">
                <strong>Date :</strong>{" "}
                {new Date(bill.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-1">
                Payment :
                <span
                  className={`badge ms-2 ${bill.payment_status === "Paid"
                    ? "bg-success"
                    : "bg-warning text-dark"
                    }`}
                >
                  {bill.payment_status}
                </span>
              </p>
            </div>
          </div>
          {/* Items */}
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-success">
                <tr>
                  <th width="60">#</th>
                  <th>Item</th>
                  <th className="text-center" width="100">
                    Qty
                  </th>
                  <th className="text-end" width="120">
                    Rate
                  </th>
                  <th className="text-end" width="150">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {bill.items?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.item_name}</td>
                    <td className="text-center">
                      {item.quantity}
                    </td>
                    <td className="text-end">
                      ₹ {item.price}
                    </td>
                    <td className="text-end">
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="row justify-content-end">

            <div className="col-md-5">

              <table className="table table-borderless">

                <tbody>

                  <tr>

                    <td>Sub Total</td>

                    <td className="text-end">
                      ₹ {bill.sub_total}
                    </td>

                  </tr>

                  <tr>

                    <td>GST</td>

                    <td className="text-end">
                      ₹ {bill.tax_amount}
                    </td>

                  </tr>

                  <tr>

                    <td>Discount</td>

                    <td className="text-end text-danger">
                      - ₹ {bill.discount_amount}
                    </td>

                  </tr>

                  <tr className="border-top border-dark fw-bold fs-5">

                    <td>Grand Total</td>

                    <td className="text-end text-success">
                      ₹ {bill.grand_total}
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          <hr />

          {/* Footer */}

          <div className="text-center">

            <h5 className="fw-bold">
              🙏 Thank You, Visit Again 🙏
            </h5>

            <small className="text-muted">
              Powered by Restaurant POS System
            </small>

          </div>

          {/* Buttons */}

          <div className="text-center mt-4">

            <button
              className="btn btn-success me-3"
              onClick={() => window.print()}
            >
              <FaPrint className="me-2" />
              Print Bill
            </button>

            <button className="btn btn-secondary">
              <FaReceipt className="me-2" />
              Download PDF
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Bill;