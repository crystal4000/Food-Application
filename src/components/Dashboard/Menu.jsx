import React from "react";
import "../../css/menu.css";

const Menu = ({ item, setAddCart, setShowItem }) => {
  //const { id, name, img, price } = item;
  return (
    <div className="menu">
      <div className="menu-img-container">
        <img src={item.img} alt={item.name} className="menu-img" />
      </div>
      <h2>{item.name}</h2>
      <p className="menu-description">
        The in-house pasta and chicken by chef moose
      </p>
      <div className="menu-price-container">
        <p className="menu-price">{`N${item.price}.00`}</p>
        <p
          onClick={() => {
            setAddCart();
            setShowItem(item);
          }}
          className="menu-add"
        >
          Add to cart
        </p>
      </div>
    </div>
  );
};

export default Menu;
