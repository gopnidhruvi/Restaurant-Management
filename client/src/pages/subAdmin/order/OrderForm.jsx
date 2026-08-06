import React, { useEffect, useState } from "react";
import { FaClipboardList, FaSave } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import { addItemsToOrder, createOrder, getOrderById } from "../../../services/orderService";
import { useNavigate, useParams } from "react-router-dom";
import { MANAGER_ROUTE, SUB_ADMIN_ROUTE, WAITER_ROUTE } from "../../../Constant/RoutesConstant";
import { getRestaurants } from "../../../services/restaurant.service";
import { getAllTables } from "../../../services/tableservice";
import { getStaff } from "../../../services/staffService";
import { getMenuItems } from "../../../services/menuItemService";
import { updateWaitingStatus } from "../../../services/waitingService";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { FaChair } from "react-icons/fa";


function OrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableOrders, setTableOrders] = useState({});
  const isEditMode = Boolean(id);
  const waitingData = location.state;
  const [restaurants, setRestaurants] = useState([]);
  const [tables, setTables] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  // const [page, setPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  const [existingItems, setExistingItems] = useState([]);
  const [search, setSearch] = useState("");

  const validationSchema = Yup.object({
    table_id: Yup.string().required("Table is required"),
    order_type: Yup.string().required("Order Type is required"),
    customer_name: Yup.string().required("Customer Name is required"),
    notes: Yup.string(),
    discount: Yup.number()
      .min(0, "Discount cannot be negative")
      .required("Discount is required"),

    items: Yup.array()
      .of(
        Yup.object({
          menu_item_id: Yup.string().required("Menu Item is required"),
          quantity: Yup.number()
            .min(1, "Minimum quantity is 1")
            .required("Quantity is required"),
        })
      )
      .min(1, "Add at least one item"),
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      // restaurant_id: selectedRestaurant?.id || "",
      table_id: waitingData?.table_id || "",
      order_type: waitingData?.order_type || "Dine In",
      customer_name: waitingData?.customer_name || "",
      discount: 0,
      notes: "",

      items: [],
    },

    validationSchema,

    onSubmit: async (values) => {
      try {
        const itemsPayload = values.items.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: Number(item.quantity),
        }));

        if (isEditMode) {
          const res = await addItemsToOrder(id, {
            items: itemsPayload,
          });

          if (res.success) {
            toast.success("Items added to existing order");
            navigate(SUB_ADMIN_ROUTE.ACTIVE_ORDERS);
          }
        } else {
          const payload = {
            // restaurant_id: selectedRestaurant.id,
            table_id: values.table_id,
            order_type: values.order_type,
            customer_name: values.customer_name,
            discount: Number(values.discount),
            notes: values.notes,
            items: itemsPayload,
          };

          const res = await createOrder(payload);

          if (res.success) {
            if (waitingData?.waiting_id) {
              await updateWaitingStatus(waitingData.waiting_id, {
                status: "Seated",
              });
            }

            toast.success("Order created successfully!");
            navigate(SUB_ADMIN_ROUTE.ACTIVE_ORDERS);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  useEffect(() => {
    fetchData();
    fetchOrder();
  }, []);



  const handleTableSelect = (table) => {
    setSelectedTable(table);
    formik.setFieldValue("table_id", table._id);
    if (tableOrders[table._id]) {
      formik.setFieldValue(
        "items",
        tableOrders[table._id]
      );
    } else {
      formik.setFieldValue(
        "items",
        []
      );
    }
    setShowTableModal(false);
  };
  const saveTableOrder = (items) => {
    if (!selectedTable) return;

    setTableOrders(prev => ({
      ...prev,
      [selectedTable._id]: items
    }));
  };
  const fetchData = async () => {
    const restaurantRes = await getRestaurants();
    const tableRes = await getAllTables();
    const waiterRes = await getStaff();
    const menuRes = await getMenuItems();

    setRestaurants(restaurantRes.data);
    setTables(tableRes.data);

    setWaiters(
      waiterRes.data.filter((staff) => staff.role === "waiter")
    );

    setMenuItems(menuRes.data);
  };

  const fetchOrder = async () => {
    if (!isEditMode) return;

    try {
      const res = await getOrderById(id);

      if (res.success) {
        const order = res.data?.data || res.data;

        formik.setValues({
          // restaurant_id: order.restaurant_id?._id || order.restaurant_id,
          table_id: order.table_id?._id || order.table_id,
          order_type: order.order_type,
          customer_name: order.customer_name || "",
          discount: order.discount || 0,
          notes: order.notes || "",

          items: [],
        });

        setExistingItems(order.items || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const subtotal = formik.values.items.reduce(
    (sum, item) => sum + Number(item.total),
    0
  );

  const grandTotal =
    subtotal - Number(formik.values.discount);

  const addItem = (menu) => {

    if (!selectedTable) {
      toast.warning("Please select table first");
      setShowTableModal(true);
      return;
    }
    if (!formik.values.items) {

      formik.setFieldValue("items", []);

    }

    let updated = [...formik.values.items];

    const index = updated.findIndex(
      item => item.menu_item_id === menu._id
    );

    if (index !== -1) {
      updated[index].quantity += 1;
      updated[index].total =
        updated[index].quantity *
        updated[index].price;
    } else {
      updated.push({
        menu_item_id: menu._id,
        quantity: 1,
        price: menu.price,
        total: menu.price,
      });
    }

    formik.setFieldValue("items", updated);
    saveTableOrder(updated);
  };
  const filteredMenu = menuItems.filter((item) =>
    item.item_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );



  return (
    <div className="container"
      style={{ maxWidth: "1350px" }}>
      <div className="card shadow-lg border-0 rounded-4">
        {/* Header */}
        <div className="card-header bg-blue text-white py-3 rounded-top-4">
          <div className="d-flex align-items-center">
            <FaClipboardList size={24} />
            <div className="ms-3">
              <h4 className="mb-0">
                {isEditMode ? "Add Items To Order" : "Create Order"}
              </h4>
              <small>{isEditMode
                ? "Add Items To Existing Order"
                : "Create New Restaurant Order"}</small>
            </div>
          </div>
        </div>

        <div className="container-fluid py-2">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              {/* LEFT SIDE */}
              <div className="col-lg-8">
                {/* Search */}
                <div className="card shawdow-sm border-0 mb-3">
                  <div className="card-body">
                    <input
                      className="form-control"
                      placeholder="Search menu..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                  </div>

                </div>

                {/* Category */}

                <div className="d-flex gap-2 mb-3 flex-wrap">

                  <button
                    type="button"
                    className="btn btn-warning rounded-pill"
                  >
                    All
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-warning rounded-pill"
                  >
                    Starter
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-warning rounded-pill"
                  >
                    Pizza
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-warning rounded-pill"
                  >
                    Burger
                  </button>

                </div>

                {/* MENU */}

                <div className="row g-3">

                  {filteredMenu.map((menu) => (
                    <div className="col-xl-4 col-lg-6 col-md-6" key={menu._id}>

                      <div
                        className="card border-0 shadow-sm h-100"
                        style={{
                          cursor: "pointer",
                          borderRadius: "15px",
                          transition: "0.3s"
                        }}
                        onClick={() => addItem(menu)}>
                        {/* Image */}
                        <div className="position-relative">
                          <img
                            src={
                              menu.image ||
                              "https://via.placeholder.com/400x250?text=No+Image"
                            }
                            className="card-img-top"
                            alt={menu.item_name}
                            style={{
                              height: "180px",
                              objectFit: "cover",
                              borderTopLeftRadius: "15px",
                              borderTopRightRadius: "15px"
                            }} />
                          {/* Veg / NonVeg */}
                          <span
                            className={`badge position-absolute top-0 end-0 m-2 ${menu.food_type === "Veg"
                              ? "bg-success"
                              : "bg-danger"
                              }`}>
                            {menu.food_type}
                          </span>
                        </div>

                        {/* Body */}
                        <div className="card-body">
                          <h5 className="fw-bold">
                            {menu.item_name}
                          </h5>
                          <small className="text-muted d-block mb-2">
                            {menu.description}
                          </small>
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="text-success mb-0">
                              ₹{menu.price}
                            </h5>
                            <button
                              type="button"
                              className="btn btn-sm bg-blue text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                addItem(menu);
                              }}>
                              + Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="col-lg-4 ">
                <div
                  className="card shadow border-0 d-flex flex-column"
                  style={{
                    position: "sticky",
                    top: "80px",
                    height: "100vh",
                    zIndex: 1
                  }}>
                  {/* <div className="card-header bg-blue text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      {selectedTable
                        ? `Table ${selectedTable.tableNumber}`
                        : "Start Order"}</h5>
                        
                    <small>{selectedTable?.capacity} Seats</small>
                  </div>
                   */}
                  <div className="card-header bg-blue text-white py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">
                          {selectedTable
                            ? `Table ${selectedTable.tableNumber}`
                            : "Start Order"}
                        </h5>

                        {selectedTable && (
                          <small className="text-light">
                            {formik.values.order_type}
                          </small>
                        )}
                      </div>

                      {selectedTable && (
                        <div className="text-end">
                          <span className="badge bg-light text-dark px-3 py-2">
                            <FaChair className="me-1" />
                            {selectedTable.capacity} Seats
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column flex-grow-1">
                    {!selectedTable ? (
                      <div className="text-center mt-5">
                        <FaChair
                          size={70}
                          className="text-secondary mb-3" />
                        <h4>
                          Start an Order
                        </h4>
                        <p className="text-muted">
                          Select a table to begin
                        </p>
                        <button
                          type="button"
                          className="btn bg-blue text-white"
                          onClick={() => setShowTableModal(true)}>
                          Select Table
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="d-flex flex-column h-100">

                          <div className="flex-grow-1 overflow-auto pe-2">

                            {formik.values.items.length === 0 ? (

                              <div className="text-center mt-5">
                                <h5>No Items Added</h5>
                                <small className="text-muted">
                                  Click any menu item
                                </small>
                              </div>

                            ) : (

                              formik.values.items.map((item, index) => {
                                const menu = menuItems.find(
                                  x => x._id === item.menu_item_id
                                );
                                return (
                                  <div
                                    key={index}
                                    className="border-bottom pb-3 mb-3">
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        <h6>
                                          {menu?.item_name}
                                        </h6>
                                        <small>
                                          ₹{item.price}
                                        </small>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => {
                                          const updated = [...formik.values.items];
                                          updated.splice(index, 1);
                                          formik.setFieldValue("items", updated);
                                          saveTableOrder(updated);
                                        }}>
                                        ✕
                                      </button>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                      <div className="btn-group">
                                        <button
                                          type="button"
                                          className="btn btn-outline-secondary btn-sm"
                                          onClick={() => {
                                            const updated = [...formik.values.items];
                                            if (updated[index].quantity > 1) {
                                              updated[index].quantity--;
                                              updated[index].total =
                                                updated[index].quantity *
                                                updated[index].price;
                                              formik.setFieldValue("items", updated);
                                              saveTableOrder(updated);
                                            }
                                          }}>
                                          -
                                        </button>
                                        <button
                                          className="btn btn-light btn-sm">
                                          {item.quantity}
                                        </button>
                                        <button
                                          type="button"
                                          className="btn btn-outline-secondary btn-sm"
                                          onClick={() => {
                                            const updated = [...formik.values.items];
                                            updated[index].quantity++;
                                            updated[index].total =
                                              updated[index].quantity *
                                              updated[index].price;
                                            formik.setFieldValue("items", updated);
                                            saveTableOrder(updated);
                                          }}>
                                          +
                                        </button>
                                      </div>
                                      <strong>
                                        ₹{item.total}
                                      </strong>
                                    </div>
                                  </div>
                                );
                              })

                            )}

                          </div>

                          <div className="border-top pt-3 mt-2">

                            <div className="d-flex justify-content-between">
                              <span>Subtotal</span>
                              <strong>₹{subtotal.toFixed(2)}</strong>
                            </div>

                            <div className="mt-3">
                              <label>Discount</label>
                              {/* <input
                                type="number"
                                className="form-control"
                                name="discount"
                                value={formik.values.discount}
                                onChange={formik.handleChange}
                              /> */}
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between">
                              <h5>Total</h5>
                              <h4>₹{grandTotal.toFixed(2)}</h4>
                            </div>
                            <button
                              type="submit"
                              className="btn bg-blue text-white w-100">
                              <FaSave className="me-2" />
                              Create Order
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </form>
          {showTableModal && (
            <>
              <div
                className="modal fade show d-block"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title d-flex align-items-center">
                        <FaChair className="me-2" />
                        Select Table
                      </h5>

                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => setShowTableModal(false)}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="modal-body">
                      <div className="row g-3">
                        {tables.map((table) => (
                          <div className="col-md-3" key={table._id}>
                            <button
                              type="button"
                              disabled={table.status !== "available"}
                              className={`btn w-100 py-4 ${table.status === "available"
                                ? "btn-success"
                                : table.status === "occupied"
                                  ? "btn-danger"
                                  : table.status === "reserved"
                                    ? "btn-warning"
                                    : "btn-secondary"
                                }`}
                              onClick={() => handleTableSelect(table)}
                            >
                              <h5>Table {table.tableNumber}</h5>
                              <small>{table.capacity} </small><br></br>
                              <small>{table.status}</small>

                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Backdrop */}
              <div className="modal-backdrop fade show"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderForm;