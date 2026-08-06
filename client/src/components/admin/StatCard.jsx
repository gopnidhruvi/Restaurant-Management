import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
  subtitle = "",
}) => {
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <p className="text-muted mb-1 fw-semibold">
            {title}
          </p>

          <h3 className="fw-bold mb-1">
            {value}
          </h3>

          {subtitle && (
            <small className="text-muted">
              {subtitle}
            </small>
          )}
        </div>

        <div
          className={`bg-${color} text-white rounded-circle d-flex align-items-center justify-content-center`}
          style={{
            width: "60px",
            height: "60px",
            fontSize: "24px",
          }}
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

export default StatCard;