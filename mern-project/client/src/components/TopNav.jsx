import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import logo from "../assets/logo.svg";
import "../styles/TopNav.css";

const TopNav = ({ 
  title = "Funding Dashboard", 
  adminButtonText = "Admin Login", 
  onAdminClick,
  isAdmin = false 
}) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/");
  };
  
  const handleAdminClick = () => {
    if (isAdmin) {
      // If user already in admin mode, this is a logout button
      handleLogout();
    } else if (onAdminClick) {
      // If custom handler is provided
      onAdminClick();
    } else {
      // Default behavior for non-admin - navigate to admin login
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
        startIcon={isAdmin ? <LogoutOutlined /> : <UserOutlined />}
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
