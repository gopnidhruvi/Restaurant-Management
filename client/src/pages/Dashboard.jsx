import React, { useEffect, useState } from "react";
import { FaUtensils, FaChair, FaUsers, FaMoneyBillWave, FaClock, FaCheckCircle, FaStore, FaUserTie, FaUserFriends, FaClipboardList, FaListAlt, FaFileInvoiceDollar } from "react-icons/fa";
import { ROLES } from "../Constant/CommonConstant";
import StatCard from "../components/admin/StatCard";
import { getOrders } from "../services/orderService";
import { getAllTables } from "../services/tableservice";
import { getWaitingList } from "../services/waitingService";
import { getStaff } from "../services/staffService";
import { getRestaurants } from "../services/restaurant.service";
import { getBills } from "../services/billService";
import { getCategories } from "../services/categoryService";
import { getMenuItems } from "../services/menuItemService";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const CURRENT_ROLE = user?.role;
  const [dashboard, setDashboard] = useState({
    totalOrders: 0,
    revenue: 0,
    availableTables: 0,
    totalStaff: 0,
    totalMenu: 0,
    totalCategories: 0,
    activeOrders: 0,
    waitingCustomers: 0,
    totalBills: 0,
  });
  useEffect(() => {
    loadDashboard();
  }, []);
  const loadDashboard = async () => {
    try {
      const [
        ordersRes,
        tablesRes,
        waitingRes,
        staffRes,
        restaurantRes,
        billsRes,
        categoryRes,
        menuRes
      ] = await Promise.all([
        getOrders(),
        getAllTables(),
        getWaitingList(),
        getStaff(),
        getRestaurants(),
        getBills(),
        getCategories(),
        getMenuItems()
      ]);

      const orders = ordersRes.data || [];
      const tables = tablesRes.data || [];
      const waiting = waitingRes.data || [];
      const staff = staffRes.data || [];
      const restaurants = restaurantRes.data || [];
      const bills = billsRes.data || [];
      const menus = menuRes.data || [];
      const categories = categoryRes.data || [];

      const pendingOrders = orders.filter(
        (o) => o.status === "Pending"
      ).length;

      const completedOrders = orders.filter(
        (o) => o.status === "Completed"
      ).length;
      const pendingBills = bills.filter(
        (bill) => bill.payment_status === "Pending"
      ).length;
      const availableTables = tables.filter(
        (t) => t.status === "available"
      ).length;

      const revenue = orders
        .filter((o) => o.status === "Completed")
        .reduce(
          (sum, order) => sum + Number(order.total_amount || 0),
          0
        );

      setDashboard({
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        availableTables,
        pendingBills,
        waitingCustomers: waiting.length,
        totalStaff: staff.length,
        totalRestaurants: restaurants.length,
        revenue,
        totalMenu: menus.length,
        totalCategories: categories.length,
        totalBills: bills.length,
      });

    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container-fluid py-4">

      <div className="card border-0 shadow mb-4 bg-blue text-white">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-1">
              Welcome Back 👋
            </h2>
            <p className="mb-0">
              Restaurant Management Dashboard
            </p>
          </div>

          <div className="text-end">
            <h5>{new Date().toDateString()}</h5>
            <small>Today's Overview</small>
          </div>
        </div>
      </div>
      {/* SUPER ADMIN */}
      {CURRENT_ROLE === ROLES.SUPER_ADMIN && (
        <>
          <h3 className="fw-bold mb-4">Super Admin Dashboard</h3>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Restaurants"
                value={dashboard.totalRestaurants}
                icon={<FaStore />}
                color="primary"
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Owners"
                value={dashboard.totalStaff}
                icon={<FaUserTie />}
                color="success"
              />            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Staff"
                value={dashboard.totalStaff}
                icon={<FaUserFriends />}
                color="warning"
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Revenue"
                value={`₹${dashboard.revenue.toLocaleString()}`}
                icon={<FaMoneyBillWave />}
                color="danger" />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Category"
                value={dashboard.totalCategory}
                icon={<FaStore />}
                color="primary" />
            </div>
          </div>
        </>
      )}

      {/* OWNER */}
      {CURRENT_ROLE === ROLES.OWNER && (
        <>
          <h3 className="fw-bold mb-4">Owner Dashboard</h3>

          <div className="row g-4">

            {/* Orders */}
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Orders"
                value={dashboard.totalOrders}
                icon={<FaClipboardList />}
                color="primary"
              />
            </div>

            {/* Revenue */}
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Revenue"
                value={`₹${dashboard.revenue}`}
                icon={<FaMoneyBillWave />}
                color="success"
              />
            </div>

            {/* Tables */}
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Tables"
                value={dashboard.availableTables}
                icon={<FaChair />}
                color="warning"
              />
            </div>

            {/* Staff */}
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Staff"
                value={dashboard.totalStaff}
                icon={<FaUserFriends />}
                color="danger"
              />
            </div>

            {/* Menu */}
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Menu"
                value={dashboard.totalMenu}
                icon={<FaUtensils />}
                color="info"
              />
            </div>

            {/* Categories */}
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Categories"
                value={dashboard.totalCategories}
                icon={<FaListAlt />}
                color="secondary"
              />
            </div>


            {/* Waiting List */}
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Waiting List"
                value={dashboard.waitingCustomers}
                icon={<FaUsers />}
                color="warning"
              />
            </div>

            {/* Bill List */}
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Bill List"
                value={dashboard.totalBills}
                icon={<FaFileInvoiceDollar />}
                color="success"
              />
            </div>

          </div>
        </>
      )}

      {/* MANAGER */}
      {CURRENT_ROLE === ROLES.MANAGER && (
        <>
          <h3 className="fw-bold mb-4">Manager Dashboard</h3>

          <div className="row g-4">

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Total Orders"
                value={dashboard.totalOrders}
                icon={<FaUtensils />}
                color="primary"
              />            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Available Tables"
                value={dashboard.availableTables}
                icon={<FaChair />}
                color="success"
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Waiting Customers"
                value={dashboard.waitingCustomers}
                icon={<FaUsers />}
                color="warning"
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Revenue"
                value={`₹${dashboard.revenue}`}
                icon={<FaMoneyBillWave />}
                color="danger"
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Pending Orders"
                value={dashboard.pendingOrders}
                icon={<FaClock />}
                color="warning"
              />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Completed Orders"
                value={dashboard.completedOrders}
                icon={<FaCheckCircle />}
                color="success"
              />
            </div>

          </div>
        </>
      )}

      {/* WAITER */}
      {CURRENT_ROLE === ROLES.WAITER && (
        <>
          <h3 className="fw-bold mb-4">Waiter Dashboard</h3>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="My Orders"
                value={dashboard.totalOrders}
                icon={<FaUtensils />}
                color="primary" />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Assigned Tables"
                value={dashboard.availableTables}
                icon={<FaChair />}
                color="success"
              />            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Pending Bills"
                value={dashboard.pendingBills}
                icon={<FaMoneyBillWave />}
                color="warning"
              />           </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Completed Orders"
                value={dashboard.completedOrders}
                icon={<FaCheckCircle />}
                color="danger"
              />            </div>
          </div>
        </>
      )}

      {/* KITCHEN */}
      {CURRENT_ROLE === ROLES.KITCHEN && (
        <>
          <h3 className="fw-bold mb-4">Kitchen Dashboard</h3>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Pending Orders"
                value={dashboard.pendingOrders}
                icon={<FaClock />}
                color="warning"
              />            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Preparing"
                value={dashboard.pendingOrders}
                icon={<FaUtensils />}
                color="primary" />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Ready Orders"
                value={dashboard.completedOrders}
                icon={<FaCheckCircle />}
                color="success" />
            </div>

            <div className="col-lg-3 col-md-6">
              <StatCard
                title="Today's Orders"
                value={dashboard.todayOrders}
                icon={<FaClipboardList />}
                color="danger" />
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default Dashboard;