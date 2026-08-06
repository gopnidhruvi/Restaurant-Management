import React, { useEffect, useState } from "react";
import { FaUsers, FaChair, FaClock, FaPhoneAlt, FaUserFriends, } from "react-icons/fa";
import { addToWaiting, getWaitingList, seatCustomer, } from "../../../services/waitingService";
import { getAllTables } from "../../../services/tableservice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";

function WaitingQueue() {
  const navigate = useNavigate();
  const restaurantId = "63a8dfe933d4a14ad61cb1cc";
  const [waitingList, setWaitingList] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTable, setSelectedTable] = useState("");
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    party: "",
    wait: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchData = async () => {
    try {
      const res = await getWaitingList({
        restaurant_id: restaurantId,
      });

      if (res.success) {
        setWaitingList(res.data || []);
      } else {
        setWaitingList([]);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      setWaitingList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        restaurant_id: restaurantId,
        customer_name: formData.customer,
        phone: formData.phone,
        party_size: Number(formData.party),
        estimated_wait_minutes: Number(formData.wait),
        notes: formData.notes,
      };
      const res = await addToWaiting(payload);
      if (res.success) {
        toast.success("Customer Added Successfully");
        setFormData({
          customer: "",
          phone: "",
          party: "",
          wait: "",
          notes: "",
        });

        fetchData();
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  const openAssignModal = async (customer) => {
    setSelectedCustomer(customer);

    const res = await getAllTables();

    if (res.success) {
      const availableTables = res.data.filter(
        (table) =>
          table.status?.toLowerCase() === "available" &&
          table.capacity >= customer.party_size
      );
      setTables(availableTables);
    }
  };
  const handleAssignTable = async () => {
    if (!selectedTable) {
      toast.warning("Please Select Table");
      return;
    }

    try {
      const customer = selectedCustomer;

      const res = await seatCustomer(customer._id, {
        table_id: selectedTable,
      });

      if (res.success) {
        toast.success("Table Assigned Successfully");

        const selectedTableData = tables.find(
          (t) => t._id === selectedTable
        );

        navigate(SUB_ADMIN_ROUTE.WAITINGQUEUE, {
          state: {
            waiting_id: customer._id,
            restaurant_id: restaurantId,
            table_id: selectedTable,
            tableNumber: selectedTableData?.tableNumber,
            customer_name: customer.customer_name,
            phone: customer.phone,
            party_size: customer.party_size,
            order_type: "Dine In",
          },
        });

        setSelectedCustomer(null);
        setSelectedTable("");

        fetchData();
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  const getWaitingTime = (createdAt) => {
    if (!createdAt) return "-";

    const created = new Date(createdAt);
    const now = new Date();

    const diff = Math.floor((now - created) / (1000 * 60));

    if (diff < 1) return "Just Now";
    if (diff < 60) return `${diff} mins`;

    const hours = Math.floor(diff / 60);
    const mins = diff % 60;

    return `${hours}h ${mins}m`;
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3><FaUsers className="me-2" />Waiting Queue</h3>

        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#addCustomerModal"
        >
          + Add Customer
        </button>
      </div>

      <div className="row">
        {waitingList.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <h5 className="text-muted">No Waiting Customers</h5>
            </div>
          </div>
        ) : (
          waitingList.map((item) => (
            <div className="col-md-4 mb-3" key={item._id}>
              <div className="card shadow">
                <div className="card-header d-flex justify-content-between">
                  <div>
                    <h5>{item.token_number}</h5>
                    <small>{item.customer_name}</small>
                  </div>

                  <span className="badge bg-warning">
                    {item.status}
                  </span>
                </div>

                <div className="card-body">
                  <p>
                    <FaPhoneAlt className="me-2 text-success" />
                    {item.phone}
                  </p>

                  <p>
                    <FaUserFriends className="me-2 text-primary" />
                    Party Size : {item.party_size}
                  </p>

                  <p>
                    <FaClock className="me-2 text-danger" />
                    Wait : {getWaitingTime(item.createdAt)}
                  </p>

                  <button
                    className="btn btn-primary w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#assignTableModal"
                    onClick={() => openAssignModal(item)}
                  >
                    <FaChair className="me-2" />
                    Assign Table
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}

      <div
        className="modal fade"
        id="addCustomerModal"
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Add Customer</h5>
            </div>

            <div className="modal-body">

              <input
                className="form-control mb-3"
                placeholder="Customer Name"
                name="customer"
                value={formData.customer}
                onChange={handleChange}
              />

              <input
                className="form-control mb-3"
                placeholder="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                className="form-control mb-3"
                placeholder="Party Size"
                type="number"
                name="party"
                value={formData.party}
                onChange={handleChange}
              />

              <input
                className="form-control mb-3"
                placeholder="Wait Time"
                type="number"
                name="wait"
                value={formData.wait}
                onChange={handleChange}
              />

              <textarea
                className="form-control"
                placeholder="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />

            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleSave}
                data-bs-dismiss="modal"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="assignTableModal"
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Assign Table</h5>
            </div>

            <div className="modal-body">

              <p>
                Customer :
                <strong> {selectedCustomer?.customer_name}</strong>
              </p>

              <p>
                Party Size :
                <strong> {selectedCustomer?.party_size}</strong>
              </p>

              <select
                className="form-select"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                <option value="">Select Table</option>

                {tables.map((table) => (
                  <option key={table._id} value={table._id}>
                    {table.tableNumber} ({table.capacity} Seats)
                  </option>
                ))}
              </select>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>

              <button
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={handleAssignTable}
              >
                Assign
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingQueue;