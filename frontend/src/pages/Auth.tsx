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
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url =
      mode === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/signup";

    const payload =
      mode === "login"
        ? { email, password }
        : { name, email, password };

    const res = await axios.post(url, payload);
    login(res.data);

    // ✅ GO TO HOME, NOT DASHBOARD
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="p-6 border rounded w-80" onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold mb-4">
          {mode === "login" ? "Login" : "Sign Up"}
        </h1>

        {mode === "signup" && (
          <input
            placeholder="Name"
            className="w-full p-2 mb-2 border"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          className="w-full p-2 mb-2 border"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          className="w-full p-2 mb-4 border"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full mb-2">
          {mode === "login" ? "Login" : "Create Account"}
        </Button>

        <Button
          variant="ghost"
          type="button"
          onClick={() =>
            setMode(mode === "login" ? "signup" : "login")
          }
        >
          Switch to {mode === "login" ? "Signup" : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Auth;
