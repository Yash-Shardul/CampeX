import React from "react";

const VirtualTourPage = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
      }}
    >
      <iframe
        src="/virtual_tour/index.html"
        title="Virtual Campus Tour"
        allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
};

export default VirtualTourPage;