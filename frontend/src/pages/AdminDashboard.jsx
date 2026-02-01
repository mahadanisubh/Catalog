import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", desc: "", keywords: "", category: "fashion" });
  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }
    fetchUploaded();
  }, []);

  const fetchUploaded = async () => {
    try {
      const res = await fetch("https://catalog-backend-xuvr.onrender.com/getuploadedproducts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch");
        return;
      }
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => 
    setForm({ ...form,
    [e.target.name]: e.target.value });
  const handleFile = (e) => 
    setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !image) {
      alert("Name and image required");
      return;
    }

    //form
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("desc", form.desc);
    fd.append("keywords", form.keywords);
    fd.append("category", form.category);
    fd.append("image", image);


    try {
      const res = await fetch("https://catalog-backend-xuvr.onrender.com/createproduct", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        // Show full response for debugging
        alert(JSON.stringify(data));
        return;
      }
      alert("Product uploaded");
      setForm({ name: "", desc: "", keywords: "", category: "fashion" });
      setImage(null);
      fetchUploaded();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <img src="https://logowik.com/content/uploads/images/catalog3426.logowik.com.webp" className="brand-logo" />
          <span className="brand-text">Catalog</span>
        </Link>
        <div className="nav-actions">
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      </nav>

      <main className="admin-dashboard">
        <h2>Admin Dashboard</h2>

        <section className="upload-form">
          <h3>Upload Product</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <input
              className="text-input"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="text-input"
              name="desc"
              placeholder="Description"
              value={form.desc}
              onChange={handleChange}
            />
            <input
              className="text-input"
              name="keywords"
              placeholder="Keywords (comma separated)"
              value={form.keywords}
              onChange={handleChange}
            />
            <select className="text-input" name="category" value={form.category} onChange={handleChange}>
              <option value="fashion">Fashion</option>
              <option value="grocery">Grocery</option>
              <option value="electronics">Electronics</option>
              <option value="beauty">Beauty</option>
            </select>
            <input type="file" name="image" onChange={handleFile} />
            <button type="submit" className="btn primary">
              Upload
            </button>
          </form>
        </section>

        <section className="uploaded-products">
          <h3>Your Products</h3>
          <div className="products-grid">
            {products.length === 0 ? (
              <p>No uploaded products</p>
            ) : (
              products.map((p) => (
                <div key={p._id} className="product-card">
                  {p.image && <img className="p-image" src={p.image} alt={p.name} />}
                  <h4>{p.name}</h4>
                  <p>{p.desc}</p>
                  <p>
                    <small>Category: {p.category}</small>
                  </p>
                  <p>
                    <small>Keywords: {(p.keywords || []).join(", ")}</small>
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
