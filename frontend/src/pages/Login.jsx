import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      console.log(response.data);

      if (response.data.success) {
        await login(response.data.user, response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("employee/dashboard");
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.log("Erro backend:", error.response.data.message);
        setError(error.response.data.message);
      } else {
        console.log("Erro sem resposta:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-alta from-50% to-gray-100 to-50% space-y-6">
      <h2 className="text-3xl text-black font-ubuntu">Estoque Alta Saúde</h2>
      <div className="border shadow-lg rounded-2xl p-6 w-80 bg-white">
        <h2 className="text-2xl font-ubuntu font-bold mb-4">Login</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handeSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-xl"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Senha</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-xl"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-alta text-white py-2 rounded-xl"
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
