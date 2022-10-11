import React from "react";
import "../../css/orders.css";
import { FaTimes } from "react-icons/fa";

const Orders = ({ show, falseOrders, orders }) => {
  if (!show) {
    return null;
  }
  console.log({ show });

  // const handleRemove = (id) => {
  //   const arr = cart.filter((item) => item.id !== id);
  //   setCart(arr);
  // };
  return (
    <div className="orders-modal" onClick={falseOrders}>
      <div
        className="orders-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="close-btn">
          {
            <FaTimes
              className="close"
              onClick={() => {
                falseOrders();
              }}
            />
          }
        </div>
        <h1>Your Orders</h1>
        <div className="orders">
          <p>Item</p>
          <p>Qty</p>
          <p>Price</p>
          <p>Status</p>
        </div>

        {orders.map((cart) =>
          cart.map((item) => (
            <div className="orders-items">
              <div className="orders-item-image">
                <img src={item.img} alt="" />
                <div>
                  <h2 className="orders-item-name">{item.name}</h2>
                  <button
                    // onClick={() => handleRemove(item.id)}
                    className="orders-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="orders-item-quantity">{item.amount}</p>
              <p className="orders-item-price">{`N${
                item.amount * item.price
              }.00`}</p>
              <p className="orders-item-status">Delivered</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
