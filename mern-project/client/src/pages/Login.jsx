import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegistering) {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            console.log("Registering:", formData);
        } else {
            console.log("Logging in:", formData);
        }
        navigate("/");
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>{isRegistering ? "Register" : "Login"}</h2>
                <form onSubmit={handleSubmit}>
                    {isRegistering && (<input
                        type="username"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />)}
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
                            <input
                                type="role"
                                name="role"
                                placeholder="Role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}
                    <button type="submit">{isRegistering ? "Register" : "Login"}</button>
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
