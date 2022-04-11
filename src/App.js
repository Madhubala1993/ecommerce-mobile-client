import {
  Alert,
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Snackbar,
  Toolbar,
} from "@mui/material";
import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import { API } from "./global";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Route, Routes, useNavigate } from "react-router-dom";

const cartCtx = createContext();

const currencyFormatter = (number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    number
  );

export default function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch(`${API}/cart`)
      .then((data) => data.json())
      .then((cartItems) => setCart(cartItems));
  }, []);

  const updateCart = ({ mobile, action }) => {
    fetch(`${API}/cart?type=${action}`, {
      method: "PUT",
      body: JSON.stringify(mobile),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((latestCart) => setCart(latestCart));
  };

  const totalCartQty = cart
    .map((item) => item.qty)
    .reduce((sum, item) => sum + item, 0);

  const navigate = useNavigate();
  return (
    <div className="App">
      <cartCtx.Provider value={[cart, updateCart]}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Button
                onClick={() => navigate("/")}
                color="inherit"
                sx={{ marginLeft: "auto" }}
              >
                Home
              </Button>
              <IconButton color="inherit" onClick={() => navigate("/cart")}>
                <Badge badgeContent={totalCartQty} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>

        <Routes>
          <Route path="/" element={<PhoneList />} />
          <Route path="/cart" element={<Cart setCart={setCart} />} />
        </Routes>
        {/* <PhoneList />
        <Cart /> */}
      </cartCtx.Provider>
    </div>
  );
}

function Cart({ setCart }) {
  const [cart, updateCart] = useContext(cartCtx);
  const navigate = useNavigate();

  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "left",
  });

  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    fetch(`${API}/cart`)
      .then((data) => data.json())
      .then((cartItems) => setCart(cartItems));
  }, []);

  const CheckOut = () => {
    fetch(`${API}/checkout`, {
      method: "POST",
      body: JSON.stringify(cart),
      headers: { "Content-Type": "application/json" },
    })
      .then((data) => data.json())
      .then((latestCart) => setCart(latestCart))
      .then(() =>
        handleClick({
          vertical: "top",
          horizontal: "right",
        })
      )
      .then(() => setTimeout(() => navigate("/"), 3000));
  };

  const total = cart
    .map((item) => item.qty * item.price)
    .reduce((sum, item) => sum + item, 0);

  return (
    <section className="cart-list">
      <h2>Purchase Items</h2>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          Order Placed Successfully !
        </Alert>
      </Snackbar>
      <div className="phone-list-container">
        {cart.map((mobile) => (
          <CartItem mobile={mobile} key={mobile._id} />
        ))}
      </div>
      <div className="cart-checkout">
        <h1>{currencyFormatter(total)}</h1>
        <Button
          variant="outlined"
          onClick={() => {
            CheckOut();
          }}
        >
          ✔ Checkout
        </Button>
      </div>
    </section>
  );
}

function CartItem({ mobile }) {
  const [cart, updateCart] = useContext(cartCtx);
  return (
    <div className="cartItem-container">
      <img src={mobile.img} alt={mobile.model} className="cartItem-picture" />
      <div>
        <h2 className="cartItem-name">{mobile.model}</h2>
        <p className="cartItem-company">{mobile.company}</p>
        <p className="cartItem-price">{currencyFormatter(mobile.price)}</p>
        <p className="cartItem-quantity">
          <Button
            variant="outlined"
            onClick={() => updateCart({ mobile, action: "decrement" })}
          >
            -
          </Button>
          {"       "} {mobile.qty} {"      "}
          <Button
            variant="outlined"
            onClick={() => updateCart({ mobile, action: "increment" })}
          >
            +
          </Button>
        </p>
      </div>
      <p className="subtotal-price">
        SubTotal : {currencyFormatter(mobile.qty * mobile.price)}
      </p>
    </div>
  );
}

function PhoneList() {
  const [mobiles, setMobiles] = useState([]);

  useEffect(() => {
    fetch(`${API}/mobiles`)
      .then((data) => data.json())
      .then((mbs) => setMobiles(mbs));
  }, []);
  return (
    <div className="phone-list-container">
      {mobiles.map((mobile) => (
        <Phone key={mobile._id} mobile={mobile} />
      ))}
    </div>
  );
}

function Phone({ mobile }) {
  const [cart, updateCart] = useContext(cartCtx);
  return (
    <div className="phone-container">
      <img src={mobile.img} alt={mobile.model} className="phone-picture" />
      <h2 className="phone-name">{mobile.model}</h2>
      <p className="phone-company">{mobile.company}</p>
      <p className="phone-price">{currencyFormatter(mobile.price)}</p>
      <Button
        variant="contained"
        onClick={() => updateCart({ mobile, action: "increment" })}
      >
        Add to cart
      </Button>
    </div>
  );
}
