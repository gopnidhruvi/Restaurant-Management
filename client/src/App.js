import React from 'react';
import { BrowserRouter, Routes, Route, Form } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './routes/PrivateRoute';
import { ROLES } from './Constant/CommonConstant';
import AdminLayout from './layouts/AdminLayout';
// import Dashboard from './pages/Superadmin/Dashboard';
import RestaurantForm from './pages/Superadmin/Restaurants/RestaurantForm';
import RestaurantsList from './pages/Superadmin/Restaurants/RestaurantsList';
import { SUPER_ADMIN_ROUTE, AUTH_ROUTE, COMMON_ROUTE, SUB_ADMIN_ROUTE } from './Constant/RoutesConstant';
import OwnerList from './pages/Superadmin/owner/OwnerList';
import OwnerForm from './pages/Superadmin/owner/OwnerForm';
import Reports from './pages/Superadmin/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryList from './pages/subAdmin/Category/CategoryList';
import CategoryForm from './pages/subAdmin/Category/CategoryForm';
import MenuList from './pages/subAdmin/menu/MenuList';
import MenuForm from './pages/subAdmin/menu/MenuForm';
import TableList from './pages/subAdmin/table/TableList';
import TableForm from './pages/subAdmin/table/TableForm';
import StaffForm from './pages/subAdmin/staff/staffForm';
import StaffList from './pages/subAdmin/staff/staffList';
import OrderForm from './pages/subAdmin/order/OrderForm';
import Dashboard from './pages/Dashboard';
import ActiveOrders from './pages/subAdmin/ActiveOrders';
import WaitingQueue from './pages/subAdmin/waiting/WaitingQueue';
import OrderList from './pages/subAdmin/order/OrderList';
import Bill from './pages/subAdmin/Bill/Bill';
import BillList from './pages/subAdmin/Bill/BillList'
import Kitchen from './pages/Kitchen/Kitchen';

function App(props) {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        {/* <Route > */}
        {/* </Route> */}
        <Routes>
          <Route path={AUTH_ROUTE.LOGIN} element={<Login />} />
          <Route path={AUTH_ROUTE.REGISTER} element={<Register />} />

          <Route element={<AdminLayout />}>
            {/* <Route path={ADMIN_ROUTE.DASHBOARD} element={<Dashboard />} /> */}
            <Route path={COMMON_ROUTE.DASHBOARD} element={<Dashboard />} />
            <Route path={SUPER_ADMIN_ROUTE.RESTOURANTSLIST} element={<RestaurantsList />} />
            <Route path={SUPER_ADMIN_ROUTE.RESTOURANTSADD} element={<RestaurantForm />} />
            <Route path={SUPER_ADMIN_ROUTE.RESTOURANTSEDIT + "/:id"} element={<RestaurantForm />} />
            <Route path={SUPER_ADMIN_ROUTE.OWNERLIST} element={<OwnerList />} />
            <Route path={SUPER_ADMIN_ROUTE.OWNERADD} element={<OwnerForm />} />
            <Route path={SUPER_ADMIN_ROUTE.OWNEREDIT + "/:id"} element={<OwnerForm />} />
            <Route path={SUPER_ADMIN_ROUTE.REPORTS} element={<Reports />} />
            <Route path={SUB_ADMIN_ROUTE.CATEGORYLIST} element={<CategoryList />} />
            <Route path={SUB_ADMIN_ROUTE.CATEGORYADD} element={<CategoryForm />} />
            <Route path={SUB_ADMIN_ROUTE.CATEGORYEDIT + "/:id"} element={<CategoryForm />} />
            <Route path={SUB_ADMIN_ROUTE.MENULIST} element={<MenuList />} />
            <Route path={SUB_ADMIN_ROUTE.MENUADD} element={<MenuForm />} />
            <Route path={SUB_ADMIN_ROUTE.MENUEDIT + "/:id"} element={<MenuForm />} />
            <Route path={SUB_ADMIN_ROUTE.TABLE_LIST} element={<TableList />} />
            <Route path={SUB_ADMIN_ROUTE.TABLE_ADD} element={<TableForm />} />
            <Route path={SUB_ADMIN_ROUTE.TABLE_EDIT + "/:id"} element={<TableForm />} />
            <Route path={SUB_ADMIN_ROUTE.STAFFLIST} element={<StaffList />} />
            <Route path={SUB_ADMIN_ROUTE.STAFFADD} element={<StaffForm />} />
            <Route path={SUB_ADMIN_ROUTE.STAFFEDIT + "/:id"} element={<StaffForm />} />
            <Route path={SUB_ADMIN_ROUTE.ORDER_ADD} element={<OrderForm />} />
            <Route path={SUB_ADMIN_ROUTE.ORDER_EDIT + "/:id"} element={<OrderForm />} />
            <Route path={SUB_ADMIN_ROUTE.ACTIVE_ORDERS} element={<ActiveOrders />} />
            <Route path={SUB_ADMIN_ROUTE.WAITINGQUEUE} element={<WaitingQueue />} />
            <Route path={SUB_ADMIN_ROUTE.ORDER_LIST} element={<OrderList />} />
            <Route path={SUB_ADMIN_ROUTE.ORDER_ADD} element={<OrderForm />} />
            {/* <Route path={SUB_ADMIN_ROUTE.BILL + "/:id"} element={<Bill />} />     */}
            <Route path={SUB_ADMIN_ROUTE.BILL_LIST} element={<BillList />} />
            <Route path={`${SUB_ADMIN_ROUTE.BILL}/:id`} element={<Bill />} />

            <Route path={SUB_ADMIN_ROUTE.KITCHEN} element={<Kitchen />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;