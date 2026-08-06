import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {SUB_ADMIN_ROUTE} from "../../../Constant/RoutesConstant";
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaUndo, } from "react-icons/fa";
import { getRestaurants, deleteRestaurant, toggleVisibility, recoverRestaurant, } from "../../../services/restaurant.service";

function RestaurantsList() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const fetchData = async () => {
    try {
      const res = await getRestaurants();
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to recover this restaurant!",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    await deleteRestaurant(id);

    setRestaurants((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, isDeleted: true } : r
      )
    );

    Swal.fire(
      "Deleted!",
      "Restaurant has been deleted.",
      "success"
    );
  }
};
  const handleRecover = async (id) => {
  const result = await Swal.fire({
    title: "Recover Restaurant?",
    text: "This restaurant will become available again.",
    showCancelButton: true,
    confirmButtonColor: "rgb(32, 116, 51)",
    confirmButtonText: "Recover",
  });

  if (result.isConfirmed) {
    await recoverRestaurant(id);

    setRestaurants((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, isDeleted: false } : r
      )
    );

    Swal.fire(
      "Recovered!",
      "Restaurant recovered successfully.",
      "success"
    );
  }
};
  const handleToggleVisibility = async (id) => {
    try {
      const res = await toggleVisibility(id);

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, status: res.data.status }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Restaurant List</h3>

        <button
          className="btn btn-primary"
          onClick={() => navigate(SUB_ADMIN_ROUTE.RESTOURANTSADD)}
        >
          Add Restaurant
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-hover">

        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>Country</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {restaurants.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                No Restaurants Found
              </td>
            </tr>
          ) : (
            restaurants.map((restaurant) => (
              <tr
                key={restaurant._id}
                style={{
                  backgroundColor: restaurant.isDeleted ? "#ffebee" : "inherit",
                  opacity: restaurant.isDeleted ? 0.6 : 1
                }}
              >

                {/* NAME */}
                <td>{restaurant.restaurant_name}</td>
                <td>{restaurant.email}</td>
                <td>{restaurant.phone}</td>
                <td>{restaurant.address}</td>
                <td>{restaurant.city}</td>
                <td>{restaurant.country}</td>



                {/* STATUS */}
                <td>
                  {restaurant.status === "active" ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="text-center">

                  {/* EDIT */}
                  <button
                    className="btn btn-sm text-primary border-0 bg-transparent"
                    onClick={() =>
                      navigate(`${SUB_ADMIN_ROUTE.RESTOURANTSEDIT}/${restaurant._id}`)
                    }
                    disabled={restaurant.isDeleted}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  {/* DELETE / RECOVER */}
                  {restaurant.isDeleted ? (
                    <button

                      className="btn btn-sm text-success border-0 bg-transparent"
                      onClick={() => handleRecover(restaurant._id)}
                    >
                      <FaUndo />
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm text-danger border-0 bg-transparent"
                      onClick={() => handleDelete(restaurant._id)}
                    >
                      <FaTrash />
                    </button>
                  )}

                  {/* VISIBILITY */}
                  <button
                    className="btn btn-sm text-warning border-0 bg-transparent"
                    onClick={() => handleToggleVisibility(restaurant._id)}
                    disabled={restaurant.isDeleted}
                  >
                    {restaurant.status === "active" ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}

export default RestaurantsList;