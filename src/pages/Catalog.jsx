import { Link } from "react-router-dom";
import "./Catalog.css";

export default function Catalog() {
  const products = [
    { id: 1, name: "Hamburguer Artesanal", price: 25, desc: "Pão brioche, carne 180g, queijo cheddar", img: "🍔" },
    { id: 2, name: "Pizza Margherita", price: 40, desc: "Molho de tomate, muçarela, manjericão fresco", img: "🍕" },
    { id: 3, name: "Salada Caesar", price: 18, desc: "Alface, frango grelhado, parmesão, croutons", img: "🥗" },
  ];

  return (
    <div className="catalog-container">
      <h1 className="catalog-title">Catálogo</h1>
      <div className="catalog-grid">
        {products.map((p) => (
          <div key={p.id} className="catalog-card">
            <div className="catalog-img">{p.img}</div>
            <div className="catalog-info">
              <h2>{p.name}</h2>
              <p className="catalog-desc">{p.desc}</p>
              <p className="catalog-price">R$ {p.price}</p>
              <button className="catalog-button">Adicionar</button>
            </div>
          </div>
        ))}
      </div>
      <div className="catalog-footer">
        <Link to="/cart" className="catalog-link">Ir para o Carrinho</Link>
      </div>
    </div>
  );
}
