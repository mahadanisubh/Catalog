import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
    const {name,value} = e.target;
    setForm({
      ...form,
      [name]: value 
    });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if(!form.email || !form.password) {
    alert("All fields are required");
    return;
  }
  try{
  const response = await fetch(`https://catalog-backend-xuvr.onrender.com/login`,{
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(form)
  })
  const data = await response.json();
  if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }

    alert("Login successful");
    localStorage.setItem("token", data.token);
    if (data.role) localStorage.setItem("role", data.role);
    if (data.id) localStorage.setItem("userId", data.id);
    navigate(data.role === "admin" ? "/admindashboard" : "/dashboard");
}
catch(err){
  console.error(err);
}
}

  return (
    <div className="form-container auth-container">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
      <input 
      className="text-input"
      type="email"
      name="email"
      placeholder="Email"
      value={form.email}
      onChange={handleChange}
      required
      />
      <br />
      <input 
      className="text-input"
      type="password"
      name="password"
      placeholder="Password"
      value={form.password}
      onChange={handleChange}
      required
      />
      <br />

      <button className="submit-btn btn primary" type="submit">Submit</button>

      </form>
      </div>
  )
}

export default Login
