import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: "", number: "", city: "" });
  const [payment, setPayment] = useState("pix");

  const subtotal = 65; // simulação
  const delivery = 7.9;
  const total = subtotal + delivery;

  const handleConfirm = (e) => {
    e.preventDefault();
    console.log("Pedido confirmado:", { address, payment, total });
    navigate("/order"); // vai para tela de status do pedido
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Finalizar Pedido</h1>

      <form onSubmit={handleConfirm} className="checkout-form">
        <h2 className="checkout-section">📍 Endereço de entrega</h2>
        <input
          type="text"
          placeholder="Rua"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          required
        />
        <div className="checkout-row">
          <input
            type="text"
            placeholder="Número"
            value={address.number}
            onChange={(e) => setAddress({ ...address, number: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cidade"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </div>

        <h2 className="checkout-section">💳 Forma de pagamento</h2>
        <div className="checkout-payments">
          <label>
            <input
              type="radio"
              name="pay"
              value="pix"
              checked={payment === "pix"}
              onChange={() => setPayment("pix")}
            />
            Pix
          </label>
          <label>
            <input
              type="radio"
              name="pay"
              value="card"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
            />
            Cartão
          </label>
          <label>
            <input
              type="radio"
              name="pay"
              value="cash"
              checked={payment === "cash"}
              onChange={() => setPayment("cash")}
            />
            Dinheiro
          </label>
        </div>

        <div className="checkout-summary">
          <div className="checkout-row">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="checkout-row">
            <span>Entrega</span>
            <span>R$ {delivery.toFixed(2)}</span>
          </div>
          <div className="checkout-row total">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        <button type="submit" className="checkout-button">
          Confirmar Pedido
        </button>
      </form>
    </div>
  );
}
