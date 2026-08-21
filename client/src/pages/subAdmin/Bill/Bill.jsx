import React, { useEffect, useState } from "react";
import { FaPrint, FaReceipt, FaChair, FaUser, FaMoneyBillWave, FaQrcode, FaCreditCard } from "react-icons/fa";
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
    <div className="bill-page d-flex justify-content-center py-5 px-3 bg-light">
      <div className="settle-bill-card w-100 bg-white rounded-3 p-3 shadow">
        {/* HEADER */}
        <div className="settle-header d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="mb-1">
              Settle Bill {bill.order_id?.table_id?.tableNumber}
            </h5>
            <small className="text-muted">
              {bill.order_id?.order_number} · {bill.items?.length || 0} items ·{" "}
              {bill.order_id?.customer_name || "Customer"}
            </small>
          </div>
        </div>

        {/* TOTAL SECTION */}
        <div className="amount-box border rounded-3 p-3 bg-white">
          <div className="amount-row d-flex justify-content-between align-items-center mb-2 text-secondary">
            <span>Subtotal</span>
            <strong className="text-dark fw-medium">₹{Number(bill.sub_total || 0).toFixed(0)}</strong>
          </div>

          <div className="amount-row d-flex justify-content-between align-items-center mb-2 text-secondary">
            <span>Service charge (5%)</span>
            <strong className="text-dark fw-medium">
              ₹{Number(bill.service_charge_amount || 0).toFixed(0)}
            </strong>
          </div>

          <div className="amount-row d-flex justify-content-between align-items-center mb-2 text-secondary">
            <span>CGST (2.5%)</span>
            <strong className="text-dark fw-medium">
              ₹{(Number(bill.tax_amount || 0) / 2).toFixed(0)}
            </strong>
          </div>
          <hr />
          <div className="amount-row total-row d-flex justify-content-between align-items-center mb-2 text-secondary">
            <span>Total</span>
            <strong className="text-dark fw-medium">₹{Number(bill.grand_total || 0).toFixed(0)}</strong>
          </div>
        </div>

        {/* DISCOUNT */}
        <div className="discount-section mt-3">
          <div className="section-label text-secondary mb-2 fs-6">
            %  Discount
          </div>
          <div className="discount-options d-flex gap-2">
            <button
              type="button"
              className="discount-btn active flex-fill border bg-white rounded-5 text-secondary"
            >
              None
            </button>

            <button
              type="button"
              className="discount-btn flex-fill border bg-white rounded-5 text-secondary"
            > 5%
            </button>

            <button
              type="button"
              className="discount-btn flex-fill border bg-white rounded-5 text-secondary"
            > 10%
            </button>

            <button
              type="button"
              className="discount-btn flex-fill border bg-white rounded-5 text-secondary"
            > 15%
            </button>
          </div>

        </div>

        {/* PAYMENT METHOD */}
        <div className="payment-section mt-3">
          <div className="section-label text-secondary mb-2 fs-6">
            Payment method
          </div>
          <div className="payment-options d-flex gap-2">
            <button
              type="button"
              className="payment-btn rounded-5 flex-fill border bg-white  d-flex flex-column align-items-center justify-content-center"
              style={{ height: "75px" }}>
              <FaQrcode size={28} />
              <span>UPI</span>
            </button>

            <button
              type="button"
              className="payment-btn flex-fill border bg-white  d-flex flex-column align-items-center justify-content-center"
              style={{ height: "75px" }} >
              <FaCreditCard size={28} />
              <span>Card</span>
            </button>

            <button
              type="button"
              className="payment-btn  flex-fill border bg-white  d-flex flex-column align-items-center justify-content-center"
              style={{ height: "75px" }}>
              <FaMoneyBillWave size={28} />
              <span>Cash</span>
            </button>

          </div>

        </div>

        {/* COLLECT BUTTON */}
        <button
          type="button"
          className="collect-btn bg-blue w-100 border-0 rounded-3 mt-3  text-white fw-bold" style={{ height: "50px" }}
          onClick={handlePayment}
          disabled={bill.payment_status === "Paid"}
        >
          {bill.payment_status === "Paid"
            ? "Payment Completed"
            : `Collect ₹${Number(bill.grand_total || 0).toFixed(0)}`
          }
        </button>

      </div>
    </div>
  );
}

export default Bill;