import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Rating.css";

export default function Rating() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    console.log("Avaliação enviada:", { rating, comment });
    navigate("/catalog");
  };

  return (
    <div className="rating-container">
      <h1 className="rating-title">Avalie sua experiência</h1>

      <form className="rating-form" onSubmit={submit}>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`star ${n <= rating ? "active" : ""}`}
              onClick={() => setRating(n)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Conte como foi o pedido, entrega e sabor..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit" className="rating-btn">
          Enviar Avaliação
        </button>
      </form>
    </div>
  );
}
