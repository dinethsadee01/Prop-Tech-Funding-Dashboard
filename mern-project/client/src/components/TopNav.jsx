import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import logo from "../assets/logo.svg";
import "../styles/TopNav.css";

const TopNav = ({ title = "Funding Dashboard", adminButtonText = "Admin Login", onAdminClick }) => {
  const navigate = useNavigate();
  
  const handleAdminClick = () => {
    if (onAdminClick) {
      onAdminClick();
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="top-nav">
      <img 
        src={logo} 
        alt="logo" 
        className="nav-logo" 
        onClick={() => window.open("https://www.proptechangelgroup.com/", "_blank")} 
      />
      <h1 className="dashboard-title">{title}</h1>
      <Button 
        className="admin-button" 
        onClick={handleAdminClick} 
        startIcon={<UserOutlined />}
        color="warning"
        variant="contained" 
        size="medium"
        >
        {adminButtonText}
      </Button>
    </div>
  );
};

export default TopNav;
