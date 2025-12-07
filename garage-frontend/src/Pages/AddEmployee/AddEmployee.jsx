import React from "react";
import { useState } from "react";

const AddEmployee = () => {
  // declare the state variable for each of the form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

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
    try {
      const res = await fetch("http://13.60.25.59:5000/employees/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      const data = await res.json();
      console.log("Response from backend:", data);
      setResponseMessage({
        status: "success",
        first_name: data.first_name,
        last_name: data.last_name,
      });
    } catch (error) {
      console.error("Error submitting employee data:", error);
      setResponseMessage({
        status: "error",
        message: "Employee registration failed!",
      });
    }
  };

  return (
    <div className="add-employee-form">
      {responseMessage && responseMessage.status === "success" && (
        <div className="success-box">
          Employee{" "}
          <span className="success-name">
            {responseMessage.first_name} {responseMessage.last_name}
          </span>{" "}
          added successfully!
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
          onChange={(event) => setFirstName(event.target.value)}
        />{" "}
        <br />
        <label htmlFor="lname">Last name:</label>
        <br />
        <input
          type="text"
          id="lname"
          name="lname"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <br />
        <label htmlFor="email">Email:</label> <br />
        <input
          type="email"
          id="email"
          name="email"
          value={emailAddress}
          onChange={(event) => setEmailAddress(event.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label> <br />
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        <br />
        <input
          type="submit"
          value="Submit"
          disabled={!firstName || !lastName || !emailAddress || !password}
        />
      </form>
    </div>
  );
};

export default AddEmployee;
