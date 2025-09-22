import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./ExtraMaterial.css";

function ExtraMaterial() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Note: material-books endpoint is public in the updated server, no auth needed
        const res = await fetch(`http://${BaseAPI}:3000/material-books`);

        if (!res.ok) {
          console.error("Failed to fetch books:", res.status);
          setBooks([]);
          return;
        }

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const addToCart = async (book) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        alert("Please log in to add items to cart");
        return;
      }

      // First, get current cart items to check for duplicates
      const cartResponse = await fetch(`http://${BaseAPI}:3000/cart`, {
        headers
      });

      if (cartResponse.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      let currentCart = [];
      if (cartResponse.ok) {
        currentCart = await cartResponse.json();
      }

      // Check if item already exists in cart
      const existingItem = currentCart.find(item => item.title === book.title);

      if (existingItem) {
        // Update quantity of existing item
        const updateResponse = await fetch(`http://${BaseAPI}:3000/cart/${existingItem._id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({
            quantity: (existingItem.quantity || 1) + 1
          }),
        });

        if (updateResponse.status === 401) {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        if (!updateResponse.ok) {
          throw new Error("Failed to update cart item");
        }

        alert(`${book.title} quantity updated in cart!`);
      } else {
        // Add new item to cart
        const addResponse = await fetch(`http://${BaseAPI}:3000/cart`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            title: book.title,
            price: book.price,
            author: book.author,
            description: book.description,
            quantity: 1,
            productId: book._id || book.book_id
          }),
        });

        if (addResponse.status === 401) {
          alert("Your session has expired. Please log in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }

        if (!addResponse.ok) {
          const errorData = await addResponse.json();
          throw new Error(errorData.error || "Failed to add item to cart");
        }

        alert(`${book.title} added to cart!`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(`Error adding item to cart: ${err.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="extra-material">
        <h2 className="page-title">📚 Extra Material</h2>

        {loading ? (
          <p>Loading books...</p>
        ) : books.length === 0 ? (
          <p>No books available at the moment.</p>
        ) : (
          <div className="books-grid">
            {books.map((book) => (
              <div key={book._id || book.book_id} className="book-card">
                <img src='./Books.png' alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.description}</p>
                <p className="author">By: {book.author}</p>
                <p className="price">R{book.price}</p>
                <button onClick={() => addToCart(book)}>Add to Cart</button>
              </div>
            ))}
          </div>
        )}

        <div className="cart-link">
          <Link to="/cart">🛒 Go to Cart</Link>
        </div>
      </div>
    </>
  );
}

export default ExtraMaterial;