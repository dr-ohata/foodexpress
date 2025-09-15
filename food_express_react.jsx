import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { MemoryRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

/**
 * FoodExpress – Protótipo React (fluxo baseado no diagrama de atividades)
 * --------------------------------------------------------------
 * Páginas:
 * - Login / Cadastro
 * - Catálogo de Produtos
 * - Carrinho
 * - Checkout (Endereço + Pagamento)
 * - Status do Pedido (simulação de preparo → motorista → entregue)
 * - Avaliação
 * --------------------------------------------------------------
 * Tecnologias: React + react-router-dom + Tailwind (classes utilitárias)
 * Observação: este arquivo é auto-contido para fins didáticos.
 */

/***********************  MOCK DE DADOS  ************************/ 
const PRODUCTS = [
  { id: 1, name: "Burger Clássico", price: 24.9, desc: "Pão, carne 160g, queijo e molho da casa.", img: "🍔" },
  { id: 2, name: "Pizza Margherita", price: 39.9, desc: "Molho de tomate, muçarela, manjericão.", img: "🍕" },
  { id: 3, name: "Salada Caesar", price: 22.5, desc: "Alface, frango grelhado, croutons, parmesão.", img: "🥗" },
];

/***********************  CONTEXTOS  ****************************/
// Auth
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// Carrinho
const CartCtx = createContext(null);
const useCart = () => useContext(CartCtx);

// Pedido
const OrderCtx = createContext(null);
const useOrder = () => useContext(OrderCtx);

/***********************  PROVIDERS  ****************************/
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (email) => setUser({ email });
  const signup = (email) => setUser({ email });
  const logout = () => setUser(null);
  const value = useMemo(() => ({ user, login, signup, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{id, name, price, qty}]

  const add = (p) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === p.id);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx] = { ...cp[idx], qty: cp[idx].qty + 1 };
        return cp;
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const inc = (id) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id) =>
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty - 1) } : i))
        .filter((i) => i.qty > 0)
    );
  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const delivery = items.length ? 7.9 : 0;
  const total = subtotal + delivery;

  const value = useMemo(
    () => ({ items, add, inc, dec, removeItem, clear, subtotal, delivery, total }),
    [items, subtotal, delivery, total]
  );
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

function OrderProvider({ children }) {
  const [order, setOrder] = useState(null); // { id, status, address, payment, ts }

  const startOrder = (payload) => {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    setOrder({ id, status: "preparing", ...payload, ts: Date.now() });
  };
  const advance = () =>
    setOrder((prev) => {
      if (!prev) return prev;
      const map = { preparing: "assigning", assigning: "enroute", enroute: "delivered", delivered: "delivered" };
      return { ...prev, status: map[prev.status] };
    });
  const reset = () => setOrder(null);

  const value = useMemo(() => ({ order, startOrder, advance, reset }), [order]);
  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>;
}

/***********************  ROTEAMENTO  ***************************/
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

/***********************  COMPONENTES UI  ***********************/
const Shell = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/catalog" className="font-extrabold tracking-tight">FoodExpress</Link>
          <nav className="hidden sm:flex gap-4 text-sm">
            <Link className="hover:underline" to="/catalog">Catálogo</Link>
            <Link className="hover:underline" to="/cart">Carrinho</Link>
            <Link className="hover:underline" to="/profile">Perfil</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
      <footer className="border-t bg-white/70 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-4 text-xs text-slate-500">© {new Date().getFullYear()} FoodExpress (protótipo de aula)</div>
      </footer>
    </div>
  );
};

const Card = ({ children }) => (
  <div className="rounded-2xl shadow-sm border bg-white p-4">{children}</div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={
      "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed " +
      className
    }
    {...props}
  >
    {children}
  </button>
);

/***********************  PÁGINAS  ******************************/
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email);
    navigate("/catalog");
  };

  return (
    <Shell>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">Entrar</h1>
          <p className="text-slate-600">Use seu e-mail e senha para continuar</p>
        </div>
        <Card>
          <form className="space-y-3" onSubmit={handleLogin}>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="voce@exemplo.com"
              required
            />
            <label className="block text-sm font-medium mt-3">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="••••••••"
              required
            />
            <div className="flex items-center justify-between mt-4">
              <Button type="submit">Entrar</Button>
              <Link to="/signup" className="text-sm text-amber-700 hover:underline">
                Criar conta
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Shell>
  );
}

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    signup(email);
    navigate("/catalog");
  };

  return (
    <Shell>
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold">Criar conta</h1>
          <p className="text-slate-600">Leva menos de 1 minuto</p>
        </div>
        <Card>
          <form className="space-y-3" onSubmit={handleSignup}>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="voce@exemplo.com"
              required
            />
            <label className="block text-sm font-medium mt-3">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Crie uma senha"
              required
            />
            <div className="flex items-center justify-between mt-4">
              <Button type="submit">Cadastrar</Button>
              <Link to="/login" className="text-sm text-amber-700 hover:underline">
                Já tenho conta
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Shell>
  );
}

function CatalogPage() {
  const { add } = useCart();
  return (
    <Shell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">Catálogo</h1>
        <Link to="/cart" className="text-sm text-amber-700 hover:underline">Ir para o carrinho →</Link>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {PRODUCTS.map((p) => (
          <Card key={p.id}>
            <div className="flex gap-4">
              <div className="text-5xl" aria-hidden>{p.img}</div>
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-slate-600">{p.desc}</div>
                <div className="mt-2 font-bold">R$ {p.price.toFixed(2)}</div>
                <div className="mt-3">
                  <Button onClick={() => add(p)}>Adicionar</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}

function CartPage() {
  const { items, inc, dec, removeItem, subtotal, delivery, total } = useCart();
  const hasItems = items.length > 0;
  return (
    <Shell>
      <h1 className="text-2xl font-extrabold mb-4">Carrinho</h1>
      {!hasItems && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Seu carrinho está vazio</div>
              <div className="text-sm text-slate-600">Adicione itens no catálogo para continuar</div>
            </div>
            <Link to="/catalog" className="text-amber-700 text-sm hover:underline">Ver catálogo</Link>
          </div>
        </Card>
      )}
      <div className="space-y-3">
        {items.map((it) => (
          <Card key={it.id}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-sm text-slate-600">R$ {it.price.toFixed(2)} • qtd: {it.qty}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => dec(it.id)}>-</Button>
                <Button onClick={() => inc(it.id)}>+</Button>
                <button onClick={() => removeItem(it.id)} className="text-sm text-red-600 hover:underline">Remover</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {hasItems && (
        <Card>
          <div className="flex items-center justify-between"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
          <div className="flex items-center justify-between"><span>Entrega</span><span>R$ {delivery.toFixed(2)}</span></div>
          <div className="flex items-center justify-between font-bold mt-2"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
          <div className="mt-4 flex justify-end"><Link to="/checkout"><Button>Finalizar Pedido</Button></Link></div>
        </Card>
      )}
    </Shell>
  );
}

function CheckoutPage() {
  const { total, clear } = useCart();
  const { startOrder } = useOrder();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ street: "", number: "", city: "" });
  const [payment, setPayment] = useState("pix");

  const confirm = (e) => {
    e.preventDefault();
    startOrder({ address, payment });
    clear();
    navigate("/order");
  };

  return (
    <Shell>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold mb-4">Checkout</h1>
        <Card>
          <form className="space-y-3" onSubmit={confirm}>
            <div className="font-semibold">Endereço</div>
            <input className="w-full rounded-xl border px-3 py-2" placeholder="Rua" value={address.street} onChange={(e)=>setAddress({...address, street: e.target.value})} required/>
            <div className="flex gap-3">
              <input className="w-1/3 rounded-xl border px-3 py-2" placeholder="Nº" value={address.number} onChange={(e)=>setAddress({...address, number: e.target.value})} required/>
              <input className="flex-1 rounded-xl border px-3 py-2" placeholder="Cidade" value={address.city} onChange={(e)=>setAddress({...address, city: e.target.value})} required/>
            </div>
            <div className="font-semibold mt-2">Pagamento</div>
            <div className="flex gap-3 text-sm">
              <label className="flex items-center gap-2"><input type="radio" name="pay" checked={payment==="pix"} onChange={()=>setPayment("pix")} /> Pix</label>
              <label className="flex items-center gap-2"><input type="radio" name="pay" checked={payment==="card"} onChange={()=>setPayment("card")} /> Cartão</label>
              <label className="flex items-center gap-2"><input type="radio" name="pay" checked={payment==="cash"} onChange={()=>setPayment("cash")} /> Dinheiro</label>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="font-bold">Total: R$ {total.toFixed(2)}</div>
              <Button type="submit">Confirmar Pedido</Button>
            </div>
          </form>
        </Card>
      </div>
    </Shell>
  );
}

function StepBadge({ active, children }) {
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${active ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}>
      {children}
    </div>
  );
}

function OrderStatusPage() {
  const { order, advance, reset } = useOrder();
  const navigate = useNavigate();

  useEffect(() => {
    if (!order) return;
    // Simula progresso: preparando → atribuindo → a caminho → entregue
    const t1 = setTimeout(advance, 2000);
    const t2 = setTimeout(advance, 4000);
    const t3 = setTimeout(advance, 7000);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [order]);

  if (!order) return <Navigate to="/catalog" replace />;

  const steps = [
    { key: "preparing", label: "Em preparo" },
    { key: "assigning", label: "Aguardando entregador" },
    { key: "enroute", label: "A caminho" },
    { key: "delivered", label: "Entregue" },
  ];

  const isDelivered = order.status === "delivered";

  return (
    <Shell>
      <div className="max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-extrabold">Status do Pedido #{order.id}</h1>
        <Card>
          <div className="flex flex-wrap gap-2">
            {steps.map((s) => (
              <StepBadge key={s.key} active={steps.findIndex(st => st.key === s.key) <= steps.findIndex(st => st.key === order.status)}>
                {s.label}
              </StepBadge>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-600">
            Entrega para {order.address.street}, {order.address.number} – {order.address.city} • Pagamento: {order.payment.toUpperCase()}
          </div>
        </Card>
        {isDelivered ? (
          <div className="flex justify-end">
            <Link to="/rate"><Button>Avaliar experiência</Button></Link>
          </div>
        ) : (
          <div className="text-sm text-slate-600">Acompanhe o progresso…</div>
        )}
        <div className="flex justify-between text-sm">
          <button onClick={() => navigate("/catalog")} className="text-amber-700 hover:underline">Voltar ao catálogo</button>
          <button onClick={() => { reset(); navigate("/catalog"); }} className="text-slate-600 hover:underline">Cancelar rastreamento</button>
        </div>
      </div>
    </Shell>
  );
}

function RatePage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = (e) => {
    e.preventDefault();
    // Em um app real, enviar para a API
    navigate("/catalog");
  };

  return (
    <Shell>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-extrabold">Avalie sua experiência</h1>
        <Card>
          <form className="space-y-3" onSubmit={submit}>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} className={`text-2xl ${n <= rating ? "" : "opacity-30"}`} aria-label={`Nota ${n}`}>
                  ⭐
                </button>
              ))}
            </div>
            <textarea
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Conte como foi o pedido, entrega e sabor…"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex justify-end"><Button type="submit">Enviar avaliação</Button></div>
          </form>
        </Card>
      </div>
    </Shell>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Shell>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-extrabold">Perfil</h1>
        <Card>
          <div className="text-sm">Logado como <span className="font-semibold">{user?.email}</span></div>
          <div className="mt-3"><Button onClick={() => { logout(); navigate("/login"); }}>Sair</Button></div>
        </Card>
      </div>
    </Shell>
  );
}

/***********************  APLICATIVO  **************************/
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route path="/" element={<Navigate to="/catalog" replace />} />
              <Route
                path="/catalog"
                element={
                  <PrivateRoute>
                    <CatalogPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <CartPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/order"
                element={
                  <PrivateRoute>
                    <OrderStatusPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/rate"
                element={
                  <PrivateRoute>
                    <RatePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to="/catalog" replace />} />
            </Routes>
          </Router>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}
