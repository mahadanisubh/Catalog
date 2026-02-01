import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
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
  if(!form.name || !form.email || !form.password) {
    alert("All fields are required");
    return;
  }
  try{
  const response = await fetch(`http://localhost:3000/createuser`,{
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(form)
  })
  const data = await response.json();
  if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful");
    navigate("/login");
}
catch(err){
  console.error(err);
}
}
  return (
    <div className="form-container auth-container">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
      <input 
      className="text-input"
      type="text"
      name="name"
      placeholder="Name"
      value={form.name}
      onChange={handleChange}
      required
      />
      <br />
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

export default Register