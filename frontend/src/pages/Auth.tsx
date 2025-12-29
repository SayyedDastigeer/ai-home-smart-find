import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // 🔹 SIGNUP FLOW (NO AUTO LOGIN)
        await axios.post("http://localhost:5000/api/auth/signup", {
          name,
          email,
          password,
        });

        setMessage("Signup successful! Please login.");
        setMode("login");
        setPassword("");
        setLoading(false);
        return;
      }

      // 🔹 LOGIN FLOW
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      login(res.data); // save token + user
      navigate("/dashboard"); // profile page
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <form
        className="p-6 border rounded-lg w-80 bg-card shadow"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        {/* Success / Error Message */}
        {message && (
          <p className="mb-3 text-sm text-center text-primary">
            {message}
          </p>
        )}

        {mode === "signup" && (
          <input
            required
            placeholder="Full Name"
            className="w-full p-2 mb-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          required
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          required
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full mb-2" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </Button>

        <Button
          variant="ghost"
          type="button"
          className="w-full"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
        >
          {mode === "login"
            ? "New user? Create an account"
            : "Already have an account? Login"}
        </Button>
      </form>
    </div>
  );
};

export default Auth;
