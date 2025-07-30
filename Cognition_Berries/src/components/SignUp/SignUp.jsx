import "./SignUp.css";
import { useState } from "react";

function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        interests: [],
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                interests: checked? [...prev.interests, value]: prev.interests.filter((i) => i !== value),
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) alert("✅ Signed up!");
            else alert("❌ " + (data.error || "Signup failed"));
        } catch (err) {
            console.error(err);
            alert("❌ Could not connect to server.");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <h1>Welcome to Cognition Berries</h1>
                <p>Financial literacy made easy.</p>
                <ul>
                    <li> Learn at your own pace</li>
                    <li> Real-world examples</li>
                    <li> Zero jargon, just results</li>
                </ul>
            </div>

            <div className="signup-right">
                <form onSubmit={handleSubmit} className="signup-form">
                    <h2>Create Your Account</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={handleChange}
                    />
                    {/* <input type="radio" required /> I accept the terms and conditions */}
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
