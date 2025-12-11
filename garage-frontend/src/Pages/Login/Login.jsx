import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const BASE_URL = "http://13.60.25.59:5000";

const Login = () => {
  // declare state variables for email and password
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  //Declare state variable for response message
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  //write a function to handle form submission
  const handleSubmit = async (event) => {
    //prevent the default form submission behavior
    event.preventDefault();
    setResponseMessage(null);
    //prepare the data to be sent to the backend
    const loginData = {
      email: emailAddress,
      password: password,
    };
    try {
      const res = await fetch(`${BASE_URL}/employees/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      console.log("Response from backend:", data);
      if (res.ok) {
        // SUCCESS: Store token and user data using AuthContext
        login(data.token, data.employee);

        setResponseMessage({ status: "success", message: data.message });

        // Redirect to the home page (which is protected)
        navigate("/", { replace: true });
      } else {
        // ERROR: Handle 401, 400, etc.
        setResponseMessage({
          status: "error",
          message: data.message || "Login failed!",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setResponseMessage({
        status: "error",
        message: "Network error: Could not connect to server.",
      });
    }
  };

  return (
    <div>
      <div className="notice">
        {responseMessage && (
          <h2
            className={
              responseMessage.status === "success" ? "success-box" : "error-box"
            }
          >
            {responseMessage.message}
          </h2>
        )}
      </div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          id="email"
          name="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /> <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
