import React from "react";
import "../../css/main.css";
import userImg from "../../assets/Dashboard/user.svg";
import { MenuItems } from "./menuItems";
import Menu from "./Menu";

const Main = ({ setAddCart, setShowItem }) => {
  let user = JSON.parse(sessionStorage.getItem("user"));
  return (
    <main className="products">
      <header>
        <p>
          Good Morning, {user.name}! <br />
          <span>What delicious meal are you craving for today?</span>
        </p>
        <img src={userImg} alt="" className="user" />
      </header>
      <section className="menu-container">
        {MenuItems.map((item) => {
          return (
            <Menu
              key={item.id}
              item={item}
              setAddCart={setAddCart}
              setShowItem={setShowItem}
              // handleClick={handleClick}
            />
          );
        })}
      </section>
    </main>
  );
};

export default Main;
