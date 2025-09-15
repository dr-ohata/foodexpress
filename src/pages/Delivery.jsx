import { Link } from "react-router-dom";

export default function Delivery() {
  return (
    <div>
      <h1>Entrega em andamento...</h1>
      <p>O entregador está a caminho!</p>
      <Link to="/rating">Confirmar recebimento</Link>
    </div>
  );
}
