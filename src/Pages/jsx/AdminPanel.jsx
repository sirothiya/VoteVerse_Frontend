
import React, { useEffect, useState } from "react";
import Navbar from "../../components/AdminComponents/Navbar";
import Dashboard from "../../components/AdminComponents/Dashboard";
import ElectionResults from "./Result";
import "../CssPages/AdminPanel.css";

const Admin = () => {
  const [page, setPage] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(t);
  }, []);
   
  return (
    <div className="admin">
      <Navbar setPage={setPage} />
      <div className="content">
        {page === "dashboard" && (
          <Dashboard
            setPage={setPage}
          />
        )}
        {page === "result" && <ElectionResults setPage={setPage} />}
      </div>
    </div>
  );
};

export default Admin;
