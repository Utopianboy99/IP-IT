import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";
import Navbar from "../../components/Navbar/Navbar";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("paypal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const BaseAPI = import.meta.env.VITE_BASE_API;

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      return null;
    }
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  // Handle authentication errors
  const handleAuthError = () => {
    setError("Your session has expired. Please log in again.");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setTimeout(() => navigate("/login"), 2000);
  };

  // Load cart from API with better error handling
  const loadCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        setError("Please log in to view your cart");
        setCart([]);
        return;
      }

      const response = await fetch(`http://${BaseAPI}:3000/cart`, {
        headers
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.status === 404) {
        // Empty cart is OK
        setCart([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to load cart: ${response.status} ${response.statusText}`);
      }

      const cartItems = await response.json();
      setCart(Array.isArray(cartItems) ? cartItems : []);
      
    } catch (error) {
      console.error("Failed to load cart:", error);
      setError(`Failed to load cart: ${error.message}`);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1),
    0
  );

  const discount = appliedCoupon?.percent && subtotal > 0
    ? (subtotal * appliedCoupon.percent) / 100
    : 0;

  const delivery = subtotal > 0
    ? (appliedCoupon?.freeShipping ? 0 : 29.99)
    : 0;

  const tax = subtotal > 0 ? 39.99 : 0;
  const total = Math.max(0, subtotal - discount + delivery + tax);

  const handleQuantity = async (id, delta) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        setError("Please log in to update cart items");
        return;
      }

      const item = cart.find(item => item._id === id);
      if (!item) {
        console.error("Item not found in cart:", id);
        return;
      }

      const currentQty = parseInt(item.quantity) || 1;
      const newQuantity = Math.max(1, currentQty + delta);

      const response = await fetch(`http://${BaseAPI}:3000/cart/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.status === 400) {
        const errorData = await response.json();
        setError(errorData.error || "Invalid request");
        return;
      }

      if (response.status === 404) {
        setError("Cart item not found. Refreshing cart...");
        loadCart(); // Refresh the cart
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to update quantity: ${response.status} ${response.statusText}`);
      }

      const updatedItem = await response.json();
      const updatedCart = cart.map((i) =>
        i._id === id ? { ...i, quantity: parseInt(updatedItem.quantity) || 1 } : i
      );
      setCart(updatedCart);
      setError(null); // Clear any previous errors

    } catch (error) {
      console.error("Error updating quantity:", error);
      setError(`Error updating quantity: ${error.message}`);
    }
  };

  const handleRemove = async (id) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        setError("Please log in to remove cart items");
        return;
      }

      const response = await fetch(`http://${BaseAPI}:3000/cart/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 401) {
        handleAuthError();
        return;
      }

      if (response.status === 400) {
        const errorData = await response.json();
        setError(errorData.error || "Invalid request");
        return;
      }

      if (response.status === 404) {
        // Item already deleted, remove from local state
        console.log("Item already deleted from server");
      } else if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status} ${response.statusText}`);
      }

      // Update local state regardless of 404 (item might be already gone)
      const updatedCart = cart.filter((item) => item._id !== id);
      setCart(updatedCart);
      setError(null); // Clear any previous errors

    } catch (error) {
      console.error("Error removing item:", error);
      setError(`Error removing item: ${error.message}`);
    }
  };

  const clearCart = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        setError("Please log in to clear cart");
        return;
      }
      const response = await fetch(`http://${BaseAPI}:3000/cart`, {
        method: "DELETE",
        headers,
      });
      if (response.status === 401) {
        handleAuthError();
        return;
      }
      if (!response.ok) {
        throw new Error(`Failed to clear cart: ${response.status} ${response.statusText}`);
      }
      setCart([]);
      setError(null);
    } catch (error) {
      setError(`Error clearing cart: ${error.message}`);
    }
  };

  // Coupon logic (mocked)
  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === "berry10") {
      setAppliedCoupon({ code: "BERRY10", percent: 10 });
      setError(null);
    } else if (coupon.trim().toLowerCase() === "freeship") {
      setAppliedCoupon({ code: "FREESHIP", percent: 0, freeShipping: true });
      setError(null);
    } else {
      setAppliedCoupon(null);
      setError("Invalid coupon code");
    }
  };

  const handleCheckout = () => {
    if (!cart.length) {
      setError("Your cart is empty");
      return;
    }
    // For demo, just navigate to checkout page
    navigate("/checkout");
  };

  // UI
  return (
    <div className="cart-root">
      <Navbar />
      <div className="cart-container">
        <h1 className="cart-title">Your Cart</h1>
        {loading ? (
          <div className="cart-loading">Loading...</div>
        ) : error ? (
          <div className="cart-error">{error}</div>
        ) : cart.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <button className="cart-btn" onClick={() => navigate("/courses")}>Browse Courses</button>
          </div>
        ) : (
          <div className="cart-main">
            {/* Cart Items Table */}
            <div className="cart-items-box">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item._id}>
                      <td className="cart-item-title">{item.title || item.name}</td>
                      <td>${parseFloat(item.price).toFixed(2)}</td>
                      <td>
                        <button className="cart-qty-btn" onClick={() => handleQuantity(item._id, -1)}>-</button>
                        <span className="cart-qty">{item.quantity}</span>
                        <button className="cart-qty-btn" onClick={() => handleQuantity(item._id, 1)}>+</button>
                      </td>
                      <td>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                      <td>
                        <button className="cart-remove-btn" onClick={() => handleRemove(item._id)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary-box">
              <h2 className="cart-summary-title">Order Summary</h2>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Discount</span>
                <span className={discount ? "cart-discount" : ""}>-{discount ? `$${discount.toFixed(2)}` : "$0.00"}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}</span>
              </div>
              <div className="cart-summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Coupon */}
              <div className="cart-coupon-box">
                <input
                  className="cart-coupon-input"
                  type="text"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  disabled={!!appliedCoupon}
                />
                <button
                  className="cart-btn"
                  onClick={handleApplyCoupon}
                  disabled={!!appliedCoupon}
                >
                  {appliedCoupon ? "Applied" : "Apply"}
                </button>
                {appliedCoupon && (
                  <div className="cart-coupon-applied">Coupon <b>{appliedCoupon.code}</b> applied!</div>
                )}
              </div>

              {/* Payment Method */}
              <div className="cart-payment-box">
                <div className="cart-payment-title">Payment Method</div>
                <div className="cart-payment-options">
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={selectedPayment === "paypal"}
                      onChange={() => setSelectedPayment("paypal")}
                    />
                    PayPal
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                    />
                    Credit/Debit Card
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      value="paystack"
                      checked={selectedPayment === "paystack"}
                      onChange={() => setSelectedPayment("paystack")}
                    />
                    Paystack
                  </label>
                </div>
              </div>

              <button className="cart-btn cart-checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}