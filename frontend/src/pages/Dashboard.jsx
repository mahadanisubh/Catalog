import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const fetchProducts = async (q = "") => {
    try {
      const url = `http://localhost:3000/getproducts${q ? "?name=" + encodeURIComponent(q) : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch products");
        return;
      }
      setProducts(data.products || []);
      console.log("Fetched products:", data.products);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(query);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };


  return (
    <div>
      <nav className="navbar">
        <Link to="/dashboard" className="brand">
          <img src="https://logowik.com/content/uploads/images/catalog3426.logowik.com.webp" alt="Catalog" className="brand-logo" />
          <span className="brand-text">Catalog</span>
        </Link>

        <form onSubmit={handleSearch} className="search-form">
          <input
            className="text-input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-search">
            Search
          </button>
        </form>

        <div className="nav-actions">
          {!token ? (
            <>
              <Link className="btn" to="/register">
                Register
              </Link>
              <Link className="btn" to="/login">
                Login
              </Link>
            </>
          ) : (
            <>
              {localStorage.getItem("role") === "admin" && (
                <Link className="btn" to="/admindashboard">Admin</Link>
              )}
              <button onClick={handleLogout} className="btn">
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="dashboard">
        <h2>Products</h2>
        <div className="products-grid">
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            products.map((p) => (
              <div key={p._id} className="product-card">
                {p.image && <img src={p.image} alt={p.name} />}
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
