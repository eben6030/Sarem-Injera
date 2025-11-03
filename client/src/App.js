// client/src/App.js
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

/* ========= Replace with your Stripe publishable test key ========= */
const stripePromise = loadStripe("pk_test_51SORnD7HA5wTfVHFOzM8MkIjj1L8YR0BDgQSgUjK1MNcLYR0wIlUEhllOkbXxuTIhcewgQv0cHhsBL06AckILlEc00mtfnnS7L");
/* ================================================================= */

const MENU_ITEMS = [
  { id: 1, name: "Injera Pack (10pcs)", price: 1500, desc: "Soft sourdough injera - best for sharing." },
  { id: 2, name: "Doro Wat (Family)", price: 2200, desc: "Spicy stewed chicken in berbere sauce." },
  { id: 3, name: "Tibs (Beef)", price: 1800, desc: "Sautéed beef with onions and peppers." },
  { id: 4, name: "Sambusa (6pcs)", price: 800, desc: "Crispy spiced pastries (vegetarian option)." },
];

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 30px",
  background: "linear-gradient(90deg,#222 0%, #2e2a2f 100%)",
  color: "#fff",
  boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
};

const brandStyle = { display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "white" };
const accent = "#b24f2c"; // warm red-brown
const accent2 = "#2a7a3e"; // green accent

function Nav({ cartCount }) {
  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>
          SI
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>Sarem Injera</div>
          <small style={{ color: "#ddd" }}>Ethiopian Kitchen</small>
        </div>
      </Link>

      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home / Menu</Link>
        <Link to="/checkout" style={{ color: "#fff", textDecoration: "none" }}>
          Checkout ({cartCount})
        </Link>
      </div>
    </nav>
  );
}

/* ---------------- Home / Menu Page ---------------- */
function Home({ onAdd }) {
  return (
    <div style={{ padding: 28, maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0 }}>Welcome to <span style={{ color: accent }}>Sarem Injera</span></h1>
          <p style={{ color: "#ccc", marginTop: 6 }}>Authentic Ethiopian food made with love.</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, color: "#ddd" }}>Open: Tues-Sun</p>
          <p style={{ marginTop: 6, fontWeight: 700 }}><span style={{ color: accent2 }}>Call</span> to order pickup</p>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
        {MENU_ITEMS.map((item) => (
          <div key={item.id} style={{ background: "#111", color: "#fff", padding: 16, borderRadius: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ height: 140, borderRadius: 8, background: "linear-gradient(135deg,#222,#111)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              {/* placeholder image area */}
              <div style={{ width: "90%", color: "#fff", textAlign: "center", opacity: 0.9 }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{item.name}</div>
                <div style={{ color: "#ddd", marginTop: 6 }}>{item.desc}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>${(item.price / 100).toFixed(2)}</div>
                <small style={{ color: "#aaa" }}>Fresh & made to order</small>
              </div>

              <button
                onClick={() => onAdd(item)}
                style={{
                  background: accent,
                  border: "none",
                  color: "white",
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: 28, padding: 18, borderRadius: 10, background: "#0f0f10", border: "1px solid rgba(255,255,255,0.02)" }}>
        <h3 style={{ marginTop: 0, color: "#fff" }}>About Sarem Injera</h3>
        <p style={{ color: "#ccc" }}>
          We serve traditional Ethiopian dishes with care — injera, wats, tibs and more. Local ingredients, family recipes.
        </p>
      </section>
    </div>
  );
}

/* ---------------- Checkout Page ---------------- */
function CheckoutPage({ cart, clearCart }) {
  const stripe = null; // stripe is loaded inside Elements in route wrapper
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((sum, it) => sum + it.price, 0);

  return (
    <div style={{ padding: 28, maxWidth: 760, margin: "0 auto" }}>
      <h2>Checkout</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, marginTop: 12 }}>
        <div style={{ background: "#0e0e10", padding: 18, borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Contact & Delivery</h3>

          <label style={{ color: "#ddd", fontSize: 14 }}>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" style={inputStyle} />

          <label style={{ color: "#ddd", fontSize: 14, marginTop: 8 }}>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />

          <label style={{ color: "#ddd", fontSize: 14, marginTop: 8 }}>Phone number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 555 5555" style={inputStyle} />

          <div style={{ marginTop: 12 }}>
            <small style={{ color: "#999" }}>We will send order updates to this email & phone (if SMS configured).</small>
          </div>
        </div>

        <div style={{ background: "#0f0f11", padding: 18, borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Your Order</h3>
          {cart.length === 0 ? (
            <p style={{ color: "#aaa" }}>Your cart is empty.</p>
          ) : (
            <>
              <div style={{ marginBottom: 12 }}>
                {cart.map((it, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ color: "#eee" }}>{it.name}</div>
                    <div style={{ color: "#ddd" }}>${(it.price / 100).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(255,255,255,0.06)", paddingTop: 12 }}>
                <strong style={{ color: "#fff" }}>Total</strong>
                <strong style={{ color: accent }}>${(totalAmount / 100).toFixed(2)}</strong>
              </div>

              <Elements stripe={stripePromise}>
                <StripeCheckoutForm
                  name={name}
                  email={email}
                  phone={phone}
                  cart={cart}
                  totalAmount={totalAmount}
                  setMessage={setMessage}
                  setLoading={setLoading}
                  clearCart={clearCart}
                />
              </Elements>
            </>
          )}
        </div>
      </div>

      {message && <div style={{ marginTop: 18, color: message.includes("success") ? "lightgreen" : "tomato" }}>{message}</div>}
    </div>
  );
}

/* -------------- Stripe Checkout Form (uses Elements) -------------- */
function StripeCheckoutForm({ name, email, phone, cart, totalAmount, setMessage, setLoading, clearCart }) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!stripe || !elements) {
      setMessage("Stripe not loaded yet.");
      return;
    }
    if (!name || !email || !phone) {
      setMessage("Please fill name, email and phone.");
      return;
    }
    setLoading(true);

    try {
      // create payment intent on backend (amount is in cents)
      const res = await axios.post("http://localhost:5000/create-payment-intent", {
        amount: totalAmount,
        email,
        cart,
      });

      const clientSecret = res.data.clientSecret;

      // confirm card payment with CardElement
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name, email, phone },
        },
      });

      if (result.error) {
        setMessage("Payment failed: " + result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setMessage("✅ Payment success! Sending confirmation emails...");

        // notify backend to send customer + owner emails
        await axios.post("http://localhost:5000/order-success", {
          email,
          name,
          phone,
          cart,
          totalAmount,
        });

        clearCart();
      } else {
        setMessage("Payment processing. Check the dashboard.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong during checkout.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handlePay} style={{ marginTop: 12 }}>
      <label style={{ color: "#ddd", display: "block", marginBottom: 6 }}>Card details</label>
      <div style={{ padding: 12, borderRadius: 8, background: "#0b0b0c", border: "1px solid rgba(255,255,255,0.04)" }}>
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button
        type="submit"
        disabled={!stripe}
        style={{
          marginTop: 12,
          width: "100%",
          padding: 12,
          background: accent,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 700,
        }}
      >
        Pay ${(totalAmount / 100).toFixed(2)}
      </button>
    </form>
  );
}

/* ---------------- Success page ---------------- */
function SuccessPage() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1 style={{ color: accent }}>🎉 Order placed!</h1>
      <p>Thanks for your order — a confirmation email has been sent.</p>
      <Link to="/" style={{ color: accent2 }}>Back to Home</Link>
    </div>
  );
}

/* ---------------- App wrapper ---------------- */
const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 6,
  marginBottom: 8,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.06)",
  background: "#0b0b0b",
  color: "#fff",
};

export default function App() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigateUsed();

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const clearCart = () => setCart([]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#070707,#0b0b0d)", color: "#fff" }}>
      <Nav cartCount={cart.length} />
      <main>
        <Routes>
          <Route path="/" element={<Home onAdd={addToCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} clearCart={clearCart} />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </main>
    </div>
  );
}

/* ---------------- small helper to use navigate from top-level App component ---------------- */
function useNavigateUsed() {
  // this component is inside BrowserRouter below; to expose navigate we mount BrowserRouter at the top-level render
  // but here since App is default exported and expected to be wrapped by BrowserRouter in index.js, we'll just return a no-op that uses the real hook inside the render entry.
  return () => {};
}

/* ---------------- Render wrapper if root file doesn't wrap in BrowserRouter ---------------- */
/* If your client/src/index.js doesn't already wrap <App /> in <BrowserRouter>, replace index.js to:
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
*/
