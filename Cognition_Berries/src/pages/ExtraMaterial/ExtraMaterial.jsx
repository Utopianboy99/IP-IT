import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./ExtraMaterial.css";

function ExtraMaterial() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const BaseAPI = process.env.BASE_API

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          console.error("No user found in localStorage");
          setBooks([]);
          return;
        }

        const authHeader = "Basic " + btoa(`${user.email}:${user.password}`);

        const res = await fetch(`http://${BaseAPI}:3000/material-books`, {
          headers: {
            Authorization: authHeader,
          },
        });

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
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to add items to cart");
      return;
    }

    const authHeader = "Basic " + btoa(`${user.email}:${user.password}`);

    // 1. Get current cart for this user
    const response = await fetch(`http://${BaseAPI}:3000/cart/${user.email}`, {
      headers: { Authorization: authHeader }
    });
    const currentCart = response.ok ? await response.json() : [];

    const existingItem = currentCart.find(item => item.title === book.title);

    if (existingItem) {
      // Update quantity
      const res = await fetch(`http://${BaseAPI}:3000/cart/${existingItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          quantity: (existingItem.quantity || 1) + 1
        }),
      });

      if (!res.ok) throw new Error("Failed to update cart item");
      alert(`${book.title} quantity updated in cart!`);

    } else {
      // Add new item (with quantity: 1)
      const res = await fetch(`http://${BaseAPI}:3000/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          userEmail: user.email,
          title: book.title,
          price: book.price,
          author: book.author,
          description: book.description,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add item to cart");
      alert(`${book.title} added to cart!`);
    }
  } catch (err) {
    console.error("Error adding to cart:", err);
    alert("Error adding item to cart. Please try again.");
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
              <div key={book._id} className="book-card">
                <img src='./Books.png' alt={book.title} />
                <h3>{book.title}</h3>
                <p>{book.description}</p>
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