import React from "react";
import {
  FaChartLine,
  FaUsers,
  FaUtensils,
  FaMoneyBillWave,
  FaDownload,
} from "react-icons/fa";

function Reports() {
  return (
    <div className="container-fluid py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Reports</h2>
          <p className="text-muted mb-0">
            Overview of restaurant and owner activities
          </p>
        </div>

        <button className="btn btn-primary">
          <FaDownload className="me-2" />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <FaUtensils size={30} className="text-primary mb-3" />
              <h6>Total Restaurants</h6>
              <h3 className="fw-bold">120</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <FaUsers size={30} className="text-success mb-3" />
              <h6>Total Owners</h6>
              <h3 className="fw-bold">85</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <FaMoneyBillWave size={30} className="text-warning mb-3" />
              <h6>Total Revenue</h6>
              <h3 className="fw-bold">₹2.5L</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <FaChartLine size={30} className="text-danger mb-3" />
              <h6>Growth</h6>
              <h3 className="fw-bold">+18%</h3>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Reports */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <h5 className="mb-0">Recent Reports</h5>
        </div>

        <div className="card-body">
          <table className="table table-hover">

            <thead>
              <tr>
                <th>#</th>
                <th>Report Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>Restaurant Summary</td>
                <td>20 Jun 2026</td>
                <td>
                  <span className="badge bg-success">
                    Completed
                  </span>
                </td>
              </tr>

              <tr>
                <td>2</td>
                <td>Owner Activity Report</td>
                <td>19 Jun 2026</td>
                <td>
                  <span className="badge bg-warning">
                    Pending
                  </span>
                </td>
              </tr>

              <tr>
                <td>3</td>
                <td>Revenue Report</td>
                <td>18 Jun 2026</td>
                <td>
                  <span className="badge bg-success">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}

export default Reports;