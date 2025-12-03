import React, { useState } from "react";

const Login = () => {
  // declare state variables for email and password
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  //Declare state variable for response message
  const [responseMessage, setResponseMessage] = useState("");

  //write a function to handle form submission
  const handleSubmit = async (event) => {
    //prevent the default form submission behavior
    event.preventDefault();
    //prepare the data to be sent to the backend
    const loginData = {
      email: emailAddress,
      password: password,
    };
    try {
      const res = await fetch(
        "http://http://13.60.25.59/:5000/employees/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );
      const data = await res.json();
      console.log("Response from backend:", data);
      setResponseMessage(data.message);
    } catch (error) {
      console.error("Error during login:", error);
      setResponseMessage("Login failed!");
    }
  };

  return (
    <div>
      <div className="notice">
        <h2>{responseMessage}</h2>
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
