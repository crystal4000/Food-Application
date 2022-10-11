import React, { useState } from "react";
import SIdeBar from "../components/Dashboard/SIdeBar";
import "../css/dashboard.css";
import Main from "../components/Dashboard/Main";
import Profile from "../components/Dashboard/Profile";
import Orders from "../components/Dashboard/Orders";
import CartModal from "../components/Dashboard/CartModal";
import AddtoCartModal from "../components/Dashboard/AddtoCartModal";
import Checkout from "../components/Dashboard/Checkout";

const Dashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAddCart, setShowAddCart] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [item, setItem] = useState({});
  const [cart, setCart] = useState([]);
  const [orders, setCheckOrders] = useState([]);

  const setProfile = () => {
    setShowProfile(true);
  };
  const falseProfile = () => {
    setShowProfile(false);
  };

  const setOrders = () => {
    setShowOrders(true);
  };
  const falseOrders = () => {
    setShowOrders(false);
  };

  const setAddCart = () => {
    setShowAddCart(true);
  };

  const falseAddCart = () => {
    setShowAddCart(false);
  };

  const cartShow = () => {
    setShowCart(true);
  };

  const falseCart = () => {
    setShowCart(false);
  };

  const setCheckout = () => {
    setShowCheckout(true);
  };

  const falseCheckout = () => {
    setShowCheckout(false);
  };

  const setShowItem = (item) => {
    setItem(item);
  };

  const handleClick = (item) => {
    if (cart.indexOf(item) !== -1) return;
    setCart([...cart, item]);
    console.log(cart);
  };

  const handleChange = (newItem, d) => {
    // console.log("HIIIIIIIIIIiiiiiiiiiiiiiiiiiiii");
    var newAmount = newItem.amount + d;
    if (newAmount < 0) {
      alert("Item cannot be less than 0");
      return;
    }
    setItem((item) => ({
      ...item,
      amount: newAmount,
    }));

    console.log(item);
  };

  const updateCart = (cart) => {
    setCart([...cart]);
  };

  const updateOrders = (cart) => {
    setCheckOrders([...orders, cart]);
    console.log(orders);
    setCart([]);
  };

  // const checkEmptyCart = () => {
  //   if (cart.length <= 0) {
  //     return;
  //   }
  // };
  return (
    <div className="dashboard">
      <SIdeBar
        setProfile={setProfile}
        setOrders={setOrders}
        cartShow={cartShow}
        cartLength={cart.length}
        ordersLength={orders.length}
      />
      <div className="content">
        <Main setAddCart={setAddCart} setShowItem={setShowItem} item={item} />

        <AddtoCartModal
          item={item}
          handleChange={handleChange}
          show={showAddCart}
          falseAddCart={falseAddCart}
          handleClick={handleClick}
        />

        <Profile falseProfile={falseProfile} show={showProfile} />
        <Orders falseOrders={falseOrders} show={showOrders} orders={orders} />
        <CartModal
          show={showCart}
          falseCart={falseCart}
          cart={cart}
          updateCart={updateCart}
          setCheckout={setCheckout}
        />

        <Checkout
          show={showCheckout}
          falseCheckout={falseCheckout}
          updateOrders={updateOrders}
          cart={cart}
        />
      </div>
    </div>
  );
};

export default Dashboard;
