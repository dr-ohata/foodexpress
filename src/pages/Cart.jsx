import { Link } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const items = [
    { id: 1, name: "Hamburguer Artesanal", price: 25, qty: 2, img: "🍔" },
    { id: 2, name: "Pizza Margherita", price: 40, qty: 1, img: "🍕" },
  ];

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const delivery = 7.9;
  const total = subtotal + delivery;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Meu Carrinho</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Seu carrinho está vazio</p>
          <Link to="/catalog" className="cart-link">Ver Catálogo</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((it) => (
              <div key={it.id} className="cart-card">
                <div className="cart-img">{it.img}</div>
                <div className="cart-info">
                  <h2>{it.name}</h2>
                  <p className="cart-price">R$ {it.price}</p>
                  <p className="cart-qty">Qtd: {it.qty}</p>
                </div>
                <div className="cart-actions">
                  <button>-</button>
                  <button>+</button>
                  <button className="remove">Remover</button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-row">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-row">
              <span>Entrega</span>
              <span>R$ {delivery.toFixed(2)}</span>
            </div>
            <div className="cart-row total">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="checkout-button">
              Finalizar Pedido
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
