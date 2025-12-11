import { useState } from "react";
//import the routes here later
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import Login from "./Pages/Login/Login.jsx";
import AddEmployee from "./Pages/AddEmployee/AddEmployee.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import "./App.css";

// Helper component for protecting routes
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Garage APP</h1>

      <Routes>
        {/* Protected route for Home */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />

        {/* Public routes */}
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/login" element={<Login />} />

        {/* Fallback route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
