import React from 'react';

export default function SimpleCard({ foodName, imgSrc, options }) {
  return (
    <div className="card mt-3" style={{ width: "18rem" }}>
      <img src={imgSrc} className="card-img-top" alt={foodName} style={{ height: "200px", objectFit: "cover" }} />
      <div className="card-body">
        <h5 className="card-title">{foodName}</h5>
        <p className="card-text">
          {Object.entries(options).map(([size, price]) => (
            <span key={size} style={{ display: 'block' }}>
              {size}: ₹{price}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}