import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/api";
import "../styles/Login.css";
import logo from "../assets/logo.svg";

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        confirmPassword: "",
        role: "user" 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        
        try {
            if (isRegistering) {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match!");
                    setLoading(false);
                    return;
                }
                
                // Prepare registration data
                const registrationData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role || "user"
                };
                
                await registerUser(registrationData);
                alert("Registration successful! Please login.");
                setIsRegistering(false);
                setFormData({ ...formData, password: "", confirmPassword: "" });
            } else {
                // Login
                const { user, token } = await loginUser({
                    email: formData.email,
                    password: formData.password
                });
                
                console.log("Login successful", user);
                navigate("/");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
            console.error("Authentication error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <img src={logo} alt="logo" />
            <div className="auth-box">
                <h2>{isRegistering ? "Register" : "Login"}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    {isRegistering && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {isRegistering && (
                        <>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                {/* <option value="user">User</option> */}
                                <option value="admin">Admin</option>
                            </select>
                        </>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? "Processing..." : isRegistering ? "Register" : "Login"}
                    </button>
                </form>
                <p onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
                </p>
                <a className="forgot-password" href="./NotFound">Forgot password?</a>
            </div>
        </div>
    );
};

export default Login;
