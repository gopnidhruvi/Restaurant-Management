import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { SUPER_ADMIN_ROUTE } from "../../../Constant/RoutesConstant";
import { FaEye, FaEdit, FaTrash, FaUndo, FaEyeSlash } from "react-icons/fa";
import { deleteOwner, getOwners, recoverOwner, toggleOwnerVisibility } from "../../../services/ownerService";

function OwnerList() {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      const res = await getOwners();
    console.log("OWNER API RESPONSE:", res.data);

      setOwners(res.data); // 👈 array set કર
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOwners();
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
      await deleteOwner(id);

      setOwners((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, is_deleted: true } : r
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
      await recoverOwner(id);

      setOwners((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, is_deleted: false } : r
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
      const res = await toggleOwnerVisibility(id);

      setOwners((prev) =>
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
      <div className="d-flex justify-content-between mb-3">
        <h3>Owner List</h3>

        <button
          className="btn btn-primary"
          onClick={() => navigate(SUPER_ADMIN_ROUTE.OWNERADD)}
        >
          Add Owner
        </button>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-hover">

        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Restaurants Name</th>
            <th>Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {!Array.isArray(owners) || owners.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Owners Found
              </td>
            </tr>
          ) : (
            owners.map((owner) => (
              <tr
                key={owner._id}
                style={{
                  backgroundColor: owner.is_deleted ? "#ffebee" : "inherit",
                  opacity: owner.is_deleted ? 0.6 : 1,
                }}
              >
                <td>{owner.name}</td>
                <td>{owner.email}</td>
                <td>{owner.phone}</td>
                <td>
                  {owner.restaurant_id?.restaurant_name || "N/A"}
                </td>

                {/* STATUS */}
                <td>
                  {owner.status === "active" ? (
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
                      navigate(`${SUPER_ADMIN_ROUTE.OWNEREDIT}/${owner._id}`)
                    }
                    disabled={owner.is_deleted}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  {/* DELETE / RECOVER */}
                  {owner.is_deleted ? (
                    <button
                      className="btn btn-sm text-success border-0 bg-transparent"
                      onClick={() => handleRecover(owner._id)}
                    >
                      <FaUndo />
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm text-danger border-0 bg-transparent"
                      onClick={() => handleDelete(owner._id)}
                    >
                      <FaTrash />
                    </button>
                  )}

                  {/* VISIBILITY */}
                  <button
                    className="btn btn-sm text-warning border-0 bg-transparent"
                    onClick={() => handleToggleVisibility(owner._id)}
                    disabled={owner.is_deleted}
                  >
                    {owner.status === "active" ? (
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

export default OwnerList;