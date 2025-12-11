import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- New

const BASE_URL = "http://13.60.25.59:5000"; // Define base URL

const AddEmployee = () => {
  // declare the state variable for each of the form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  // write a function to handle the form submission
  const handleSubmit = async (event) => {
    //prevent the default form submission behavior
    event.preventDefault();
    //prepare the data to be sent to the backend
    const employeeData = {
      first_name: firstName,
      last_name: lastName,
      email: emailAddress,
      password: password,
    };
    setResponseMessage(null); // Clear previous messages
    try {
      const res = await fetch(`${BASE_URL}/employees/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      const data = await res.json();
      console.log("Response from backend:", data);
      if (res.ok) {
        setResponseMessage({
          status: "success",
          message: data.message,
          first_name: employeeData.first_name,
          last_name: employeeData.last_name,
        });
        // Reset form fields
        setFirstName("");
        setLastName("");
        setEmailAddress("");
        setPassword("");
        // OPTIONAL: Redirect after a few seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        // Handle 400 or 409 errors from the backend
        setResponseMessage({
          status: "error",
          message:
            data.message || "Registration failed. Please check your data.",
        });
      }
    } catch (error) {
      console.error("Error submitting employee data:", error);
      setResponseMessage({
        status: "error",
        message: "Employee registration failed!",
      });
    }
  };
  const isFormValid = firstName && lastName && emailAddress && password;

  return (
    <div className="add-employee-form">
      {responseMessage && responseMessage.status === "success" && (
        <div className="success-box">
          Employee{" "}
          <span className="success-name">
            {responseMessage.first_name} {responseMessage.last_name}
          </span>{" "}
          added successfully! Redirecting to login...
        </div>
      )}

      {responseMessage && responseMessage.status === "error" && (
        <div className="error-box">{responseMessage.message}</div>
      )}

      <h1>Add employee</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fname">First name:</label> <br />
        <input
          type="text"
          id="fname"
          name="fname"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="lname">Last name:</label>
        <br />
        <input
          type="text"
          id="lname"
          name="lname"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br />
        <label htmlFor="email">Email:</label> <br />
        <input
          type="email"
          id="email"
          name="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label> <br />
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <input type="submit" value="Submit" disabled={!isFormValid} />
      </form>
    </div>
  );
};

export default AddEmployee;
