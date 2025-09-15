import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./OrderStatus.css";

export default function OrderStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("preparing");

  // Simula avanço automático do pedido
  useEffect(() => {
    const steps = ["preparing", "assigning", "enroute", "delivered"];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length - 1) {
        i++;
        setStatus(steps[i]);
      } else {
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { key: "preparing", label: "Em preparo", icon: "👨‍🍳" },
    { key: "assigning", label: "Aguardando entregador", icon: "📲" },
    { key: "enroute", label: "A caminho", icon: "🛵" },
    { key: "delivered", label: "Entregue", icon: "✅" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="order-container">
      <h1 className="order-title">Status do Pedido</h1>

      <div className="order-tracker">
        {steps.map((s, index) => (
          <div
            key={s.key}
            className={`order-step ${
              index <= currentIndex ? "active" : ""
            }`}
          >
            <div className="order-icon">{s.icon}</div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {status !== "delivered" ? (
        <p className="order-msg">Acompanhe o progresso do seu pedido 🚀</p>
      ) : (
        <div className="order-actions">
          <p className="order-success">Seu pedido foi entregue! 🎉</p>
          <Link to="/rating" className="order-btn">
            Avaliar experiência
          </Link>
          <button
            onClick={() => navigate("/catalog")}
            className="order-btn secondary"
          >
            Voltar ao Catálogo
          </button>
        </div>
      )}
    </div>
  );
}
