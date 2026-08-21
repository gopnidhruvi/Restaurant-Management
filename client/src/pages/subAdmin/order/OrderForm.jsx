import { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import { addItemsToOrder, createOrder, getOrderById, sendToKitchen } from "../../../services/orderService";
import { useNavigate, useParams } from "react-router-dom";
import { SUB_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";
import { getRestaurants } from "../../../services/restaurant.service";
import { getAllTables } from "../../../services/tableservice";
import { getStaff } from "../../../services/staffService";
import { getMenuItems } from "../../../services/menuItemService";
import { updateWaitingStatus } from "../../../services/waitingService";
import { toast } from "react-toastify";
import { FaChair, FaTimes } from "react-icons/fa";
import { generateBill } from "../../../services/billService";



function OrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const waitingData = location.state || {};
  
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const isEditMode = Boolean(id);
  const [restaurants, setRestaurants] = useState([]);
  const [tables, setTables] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
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

    items: Yup.array().of(Yup.object({
      menu_item_id: Yup.string().required("Menu Item is required"),
      quantity: Yup.number().min(1, "Minimum quantity is 1").required("Quantity is required"),
    })).min(1, "Add at least one item"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      table_id: waitingData?.table_id || "",
      order_type: waitingData?.order_type || "Dine In",
      customer_name: waitingData?.customer_name || "",
      waiting_entry_id:
        waitingData?.waiting_entry_id || null,
      discount: 0,
      notes: "",
      items: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          const newItems = [];
          values.items.forEach((item) => {
            if (
              item.isExisting === false &&
              Number(item.newQuantity || 0) > 0
            ) {
              newItems.push({
                menu_item_id: item.menu_item_id,
                quantity: Number(item.newQuantity),
              });
              return;
            }
            if (
              item.isExisting === true &&
              item.hasNewQuantity === true &&
              Number(item.newQuantity || 0) > 0
            ) {
              newItems.push({
                menu_item_id: item.menu_item_id,
                quantity: Number(item.newQuantity),
              });
            }
          });
          if (!newItems.length) {
            // No new items => Open Bill
            await handleBill(id);
            return;
          }
          const res = await addItemsToOrder(id, { items: newItems, });
          if (res.success) {
            await sendToKitchen(id);
            const orderRes = await getOrderById(id);
            if (orderRes.success) {
              const order = orderRes.data?.data || orderRes.data;
              const updatedItems = (order.items || []).map((item) => ({
                menu_item_id:
                  item.menu_item_id?._id || item.menu_item_id,
                quantity: Number(item.quantity || 0),
                originalQuantity: Number(item.quantity || 0),
                newQuantity: 0,
                price: Number(item.price || 0),
                total:
                  Number(item.total) ||
                  Number(item.price || 0) * Number(item.quantity || 0),
                status: item.status || "Pending",
                //  status: order.order_status || "Pending",
                isExisting: true,
                hasNewQuantity: false,
              }));
              formik.setFieldValue("items", updatedItems);
              setExistingItems(updatedItems);
            }
            toast.success("New items sent to kitchen!");
          }
          return;
        }
        const itemsPayload =
          values.items.map((item) => ({
            menu_item_id: item.menu_item_id,
            quantity: Number(item.quantity),
          }));
        const payload = {
          table_id: values.table_id,
          waiting_entry_id: waitingData?.waiting_entry_id || null,
          order_type: values.order_type,
          customer_name: values.customer_name,
          discount: Number(values.discount),
          notes: values.notes,
          items: itemsPayload,
        };
        console.log("CREATE ORDER PAYLOAD:", payload);
        const res = await createOrder(payload);
        if (res.success) {
          await sendToKitchen(res.data._id);
          if (waitingData?.waiting_entry_id) {
            await updateWaitingStatus(
              waitingData.waiting_entry_id,
              { status: "Seated" }
            );
          }

          toast.success("Order sent to kitchen!");
          navigate(SUB_ADMIN_ROUTE.ACTIVE_ORDERS);
        }
      } catch (err) {
        console.log("ORDER ERROR:", err);
        toast.error(err.response?.data?.message || err.message || "Something went wrong"
        );
      }
    },
  }); const addItem = (menu) => {
    if (!selectedTable) {
      toast.warning("Please select table first");
      setShowTableModal(true);
      return;
    }

    const currentItems = formik.values.items || [];
    const menuId = String(menu._id);
    const existingIndex = currentItems.findIndex((item) => {
      const itemId = String(
        item.menu_item_id?._id || item.menu_item_id
      );
      return itemId === menuId;
    });
    const updatedItems = [...currentItems];

    //Sem Item
    if (existingIndex !== -1) {
      const item = updatedItems[existingIndex];
      const currentQuantity = Number(item.quantity || 0);
      const newQuantity = currentQuantity + 1;
      const originalQuantity = Number(
        item.originalQuantity || 0
      );
      const addedQuantity = Math.max(
        newQuantity - originalQuantity,
        0
      );

      updatedItems[existingIndex] = {
        ...item,
        quantity: newQuantity,
        total:
          newQuantity *
          Number(item.price || menu.price || 0),
        newQuantity: addedQuantity,
        hasNewQuantity: addedQuantity > 0,
      };
    }
    // New Item
    else {
      updatedItems.push({
        menu_item_id: menuId,
        quantity: 1,
        originalQuantity: 0,
        newQuantity: 1,
        price: Number(menu.price || 0),
        total: Number(menu.price || 0),
        status: "Pending",
        isExisting: false,
        hasNewQuantity: true,
      });
    }
    formik.setFieldValue("items", updatedItems);
  };

  useEffect(() => {
    fetchData();
    fetchOrder();
  }, []);

  useEffect(() => {
    if (!tables.length) return;
    if (waitingData?.table) {
      setSelectedTable(waitingData.table);
      formik.setFieldValue("table_id", waitingData.table._id);
      if (waitingData.customer_name) {
        formik.setFieldValue("customer_name", waitingData.customer_name);
      }
      return;
    }
    if (waitingData?.table_id) {
      const table = tables.find(
        (t) => String(t._id) === String(waitingData.table_id));

      if (table) {
        setSelectedTable(table);
        formik.setFieldValue("table_id", table._id);

        if (waitingData.customer_name) {
          formik.setFieldValue("customer_name", waitingData.customer_name
          );
        }
      }
    }
  }, [tables, waitingData]);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    formik.setFieldValue("table_id", table._id);
    formik.setFieldValue("items", []);
    setShowTableModal(false);
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
        const formattedItems = (order.items || []).map((item) => {
          const quantity = Number(item.quantity || 1);
          const price = Number(item.price || 0);
          return {
            menu_item_id: item.menu_item_id?._id || item.menu_item_id,
            quantity,
            originalQuantity: quantity,
            newQuantity: 0,
            price,
            total: Number(item.total) || price * quantity,
            status: item.status || "Pending",
            isExisting: true,
            hasNewQuantity: false,
          };
        });
        setExistingItems(formattedItems);
        formik.setValues({
          table_id: order.table_id?._id || order.table_id,
          order_type: order.order_type || "Dine In",
          customer_name: order.customer_name || "",
          discount: Number(order.discount || 0),
          notes: order.notes || "",
          items: formattedItems,
        });
        if (order.table_id) {
          const tableId = order.table_id?._id || order.table_id;
          const table = tables.find(
            (t) => String(t._id) === String(tableId)
          );
          if (table) { setSelectedTable(table); }
        }
      }
    } catch (err) {
      console.log("FETCH ORDER ERROR:", err
      );
    }
  };

  const handleBill = async (orderId) => {
    try {
      if (!orderId) {
        toast.error("Order ID not found");
        return;
      }
      const res = await generateBill({
        order_id: orderId,
        payment_method: "Cash",
      });
      if (res.success) {
        navigate(`${SUB_ADMIN_ROUTE.BILL}/${res.data._id}`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Unable to generate bill"
      );
    }
  };
  const subtotal = formik.values.items.reduce(
    (sum, item) => sum + Number(item.total),
    0
  );
  const grandTotal =
    subtotal - Number(formik.values.discount);

  const hasNewItems =
    formik.values.items.some(
      (item) =>
        (
          item.isExisting === false &&
          Number(item.newQuantity || item.quantity) > 0
        ) ||
        (
          item.isExisting === true &&
          item.hasNewQuantity === true &&
          Number(item.newQuantity) > 0
        )
    );
  const filteredMenu = menuItems.filter((item) =>
    item.item_name.toLowerCase().includes(search.toLowerCase()));

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
                      onChange={(e) => setSearch(e.target.value)} />
                  </div>
                </div>
                {/* MENU */}
                <div className="row g-3">
                  {filteredMenu.map((menu) => (
                    <div className="col-xl-4 col-lg-6 col-md-6" key={menu._id}>
                      <div className="card border-0 shadow-sm h-100"
                        style={{ cursor: "pointer", borderRadius: "15px", transition: "0.3s" }}
                        onClick={() => addItem(menu)}>
                        {/* Image */}
                        <div className="position-relative">
                          <img src={menu.image || "https://via.placeholder.com/400x250?text=No+Image"}
                            className="card-img-top" alt={menu.item_name}
                            style={{
                              height: "180px", objectFit: "cover", borderTopLeftRadius: "15px", borderTopRightRadius: "15px"
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
                    position: "sticky", top: "80px", height: "100vh", zIndex: 1
                  }}>
                  <div className="card-header bg-blue text-white py-3 px-3">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      {/* LEFT SIDE */}
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        {/* TABLE */}
                        <h5 className="mb-0 fw-bold text-nowrap">
                          Table{" "}
                          {selectedTable?.tableNumber ||
                            waitingData?.tableNumber ||
                            "-"}
                        </h5>

                        {/* ORDER TYPE */}
                        <span
                          className="badge bg-white text-dark fw-semibold"
                          style={{ fontSize: "12px", padding: "6px 9px", borderRadius: "6px", }}>
                          {formik.values.order_type || waitingData?.order_type || "Dine In"}
                        </span>

                        {/* SEATS */}
                        <div
                          className="bg-white text-dark rounded-3 text-center"
                          style={{ minWidth: "75px", padding: "5px 8px", fontSize: "13px", }} >
                          <div className="fw-bold">
                            {selectedTable?.capacity ||
                              waitingData?.capacity ||
                              waitingData?.party_size || 0}
                            <small className="text-muted ps-1">
                              Seats
                            </small>
                          </div>
                        </div>

                        {/* TOKEN */}
                        {waitingData?.token_number && (
                          <div
                            className="bg-warning text-dark rounded-3 text-center"
                            style={{
                              minWidth: "85px",
                              padding: "5px 9px",
                              fontSize: "13px",
                            }}
                          >
                            <div className="fw-bold">
                              Token #{waitingData.token_number}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CUSTOMER */}
                    <div className="mt-3">
                      <div
                        className="d-flex align-items-center bg-white rounded-2"
                        style={{ maxWidth: "320px", height: "40px", overflow: "hidden", }}>
                        <input
                          type="text"
                          name="customer_name"
                          className="form-control border-0 shadow-none"
                          placeholder="Enter customer name"
                          value={formik.values.customer_name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          style={{ fontSize: "14px", height: "40px", }}
                        />
                      </div>
                      {formik.touched.customer_name &&
                        formik.errors.customer_name && (
                          <small className="text-warning">
                            {formik.errors.customer_name}
                          </small>
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
                                  x =>
                                    String(x._id) ===
                                    String(item.menu_item_id?._id || item.menu_item_id)
                                );
                                const status = item.status || "Pending";
                                return (
                                  <div
                                    key={index}
                                    className="py-2 border-bottom"
                                    style={{ fontSize: "13px" }}
                                  >
                                    {/* Item Row */}
                                    <div className="d-flex justify-content-between align-items-start">

                                      <div>
                                        <div className="fw-semibold text-dark">
                                          {menu?.item_name}
                                        </div>

                                        <div className="text-muted mt-1">
                                          ₹{item.price} × {item.quantity}
                                        </div>

                                        {/* Kitchen Status */}
                                        <div className="mt-1">
                                          <span
                                            className={`badge rounded-pill px-2 py-1 ${status === "Ready"
                                              ? "bg-success-subtle text-success"
                                              : status === "Preparing"
                                                ? "bg-warning-subtle text-warning"
                                                : status === "Cancelled"
                                                  ? "bg-danger-subtle text-danger"
                                                  : "bg-secondary-subtle text-secondary"
                                              }`}
                                            style={{ fontSize: "11px" }}
                                          >
                                            {status}
                                          </span>
                                        </div>
                                      </div>
                                      {/* Delete */}
                                      <button
                                        type="button"
                                        className="btn btn-sm border-0 text-muted p-0"
                                        onClick={() => {
                                          const updated = [...formik.values.items];
                                          updated.splice(index, 1);
                                          formik.setFieldValue("items", updated);
                                        }}>
                                        ×
                                      </button>
                                    </div>

                                    {/* Bottom Row */}
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                      {/* Quantity */}
                                      <div
                                        className="d-flex align-items-center border rounded"
                                        style={{
                                          height: "28px",
                                          overflow: "hidden",
                                        }}
                                      >
                                        <button
                                          type="button"
                                          className="btn btn-sm border-0 px-2"
                                          style={{
                                            height: "28px",
                                          }}
                                          onClick={() => {
                                            const item =
                                              formik.values.items[index];
                                            if (
                                              item.isExisting &&
                                              (
                                                item.status === "Served" ||
                                                item.status === "Ready" ||
                                                item.status === "Preparing"
                                              )
                                            ) {
                                              toast.info("Served/processed item quantity cannot be reduced"
                                              );
                                              return;
                                            }
                                            const updated = [...formik.values.items,];
                                            const currentQuantity =
                                              Number(updated[index].quantity || 0);
                                            if (currentQuantity <= 1) {
                                              return;
                                            }

                                            const newQuantity = currentQuantity - 1;
                                            const originalQuantity = Number(
                                              updated[index].originalQuantity || 0
                                            );

                                            const addedQuantity =
                                              Math.max(
                                                newQuantity - originalQuantity,
                                                0
                                              );

                                            updated[index] = {
                                              ...updated[index],
                                              quantity: newQuantity,
                                              total: newQuantity * Number(updated[index].price || 0),
                                              newQuantity: addedQuantity,
                                              hasNewQuantity: addedQuantity > 0,
                                            };
                                            formik.setFieldValue("items", updated);
                                          }}
                                        >
                                          −
                                        </button>
                                        <span className="px-2 fw-semibold"
                                          style={{ minWidth: "25px", textAlign: "center", }}>{item.quantity}
                                        </span>

                                        <button
                                          type="button"
                                          className="btn btn-sm border-0 px-2"
                                          style={{ height: "28px", }}
                                          onClick={() => {
                                            const updated = [...formik.values.items,];
                                            const item = { ...updated[index], };
                                            const currentQuantity = Number(item.quantity || 0);
                                            const originalQuantity = Number(item.originalQuantity || 0);
                                            const newQuantity = currentQuantity + 1;
                                            const addedQuantity = Math.max(newQuantity - originalQuantity, 0);
                                            updated[index] = {
                                              ...item, quantity: newQuantity,
                                              total: newQuantity * Number(item.price || 0),
                                              newQuantity: addedQuantity,
                                              hasNewQuantity: addedQuantity > 0,
                                            };
                                            console.log("PLUS ITEM:", updated[index]);
                                            formik.setFieldValue("items", updated);
                                          }}> + </button>
                                      </div>

                                      {/* Total */}
                                      <div className="fw-semibold text-dark">
                                        ₹{item.total}
                                      </div>
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
                            </div>
                            <hr />

                            <div className="d-flex justify-content-between">
                              <h5>Total</h5>
                              <h4>₹{grandTotal.toFixed(2)}</h4>
                            </div>
                            {/* <div className="d-flex justify-content-center align-items-center ">
                              {hasNewItems ? (
                                <button type="submit" className="btn bg-blue text-white " >
                                  Send to Kitchen
                                </button>
                              ) : (
                                <button type="button" className="btn bg-blue text-white"
                                  onClick={() => handleBill(id)}>
                                  Send to Bill
                                </button>
                              )}

                            </div> */}
                            <div className="mt-3">

                              {hasNewItems ? (
                                <button
                                  type="submit"
                                  className="btn bg-blue text-white w-100"
                                  disabled={
                                    !selectedTable ||
                                    formik.values.items.length === 0
                                  }
                                >
                                  Send to Kitchen
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn bg-blue text-white w-100"
                                  disabled={
                                    formik.values.items.length === 0
                                  }
                                  onClick={() => handleBill(id)}
                                >
                                  Send to Bill
                                </button>
                              )}

                            </div>
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
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                        onClick={() => setShowTableModal(false)}>
                        <FaTimes />
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