import React, { useEffect, useState } from "react";
import { FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { confirmPayment, getBills } from "../../../services/billService";

function BillList() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await getBills();

      if (res.success) {
        setBills(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePayment = async (id) => {
    try {
      const res = await confirmPayment(id, {
        payment_method: "Cash",
      });

      if (res.success) {
        toast.success("Payment Completed");
        fetchBills();
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">Bill List</h3>
      <div className="card shadow">
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Order</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Method</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.bill_number}</td>

                  <td>{bill.order_id?.order_number}</td>

                  <td>₹{bill.grand_total}</td>

                  <td>
                    <span
                      className={`badge ${bill.payment_status === "Paid"
                          ? "bg-success"
                          : "bg-warning text-dark"
                        }`}
                    >
                      {bill.payment_status}
                    </span>
                  </td>

                  <td>{bill.payment_method}</td>

                  <td>
                    {bill.payment_status === "Pending" ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handlePayment(bill._id)}
                      >
                        <FaCheckCircle className="me-1" />
                        Pay
                      </button>
                    ) : (
                      <span className="text-success fw-bold">Paid</span>
                    )}
                  </td>
                </tr>
              ))}

              {bills.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No Bills Found
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

export default BillList;