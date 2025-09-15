import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Novo usuário:", { email, password });
    navigate("/catalog");
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Criar Conta</h1>
      <p className="signup-subtitle">Leva menos de 1 minuto</p>

      <form className="signup-form" onSubmit={handleSignup}>
        <label>Email</label>
        <input
          type="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha</label>
        <input
          type="password"
          placeholder="Crie uma senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="signup-btn">Cadastrar</button>
      </form>

      <p className="signup-footer">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
