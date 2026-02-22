import react from "react";

const Loader = ({ content }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div className="spinner"></div>
      <p style={{ marginTop: "10px", fontSize: "18px", color: "#141313" }}>
        {content}
      </p>
    </div>
  );
};

export default Loader;
