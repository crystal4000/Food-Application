import React from "react";
import "../../css/cartmodal.css";
import { CgClose } from "react-icons/cg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartModal = ({ show, falseCart, cart, updateCart, setCheckout }) => {
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   setCheckout();
  //   console.log(setCheckout);
  // });

  if (!show) {
    return null;
  }
  console.log({ show });

  const handleRemove = (id) => {
    // const arr = cart.filter((item) => item.id !== id);
    const index = cart.findIndex((item) => {
      return item.id === id;
    });
    cart.splice(index, 1);
    console.log(cart);
    updateCart(cart);
    console.log(index);
  };

  const totalPrice = cart.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.amount,
    0
  );
  console.log(totalPrice);

  const checkEmptyCart = () => {
    if (cart.length <= 0) {
      notify();
      return;
    }
    falseCart();
    setCheckout();
  };

  const notify = () =>
    toast.warn("Cart is Empty", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <div className="cart-modal" onClick={falseCart}>
      <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="close-btn">
          {
            <CgClose
              className="close"
              onClick={() => {
                falseCart();
              }}
            />
          }
        </div>
        <h1>Your Cart</h1>
        <div className="cart">
          <p>Item</p>
          <p>Qty</p>
          <p>Unit-Price</p>
          <p>Sub-total</p>
        </div>
        {cart.map((item) => (
          <div className="cart-items">
            <div className="cart-item-image">
              <img src={item.img} alt="" />
              <div>
                <h2 className="cart-item-name">{item.name}</h2>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="cart-remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="cart-item-quantity">{item.amount}</p>
            <p className="cart-item-price"> {`N${item.price}.00`}</p>
            <p className="cart-item-subtotal">{`N${
              item.amount * item.price
            }.00`}</p>
          </div>
        ))}
        <div className="total">
          <p>
            Total: <span> {`N${totalPrice}.00`}</span>
          </p>
        </div>
        <button
          className="checkout"
          onClick={() => {
            checkEmptyCart();
          }}
        >
          Checkout
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CartModal;
