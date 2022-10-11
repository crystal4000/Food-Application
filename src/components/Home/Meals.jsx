import React from "react";
import Card from "../../props/Card";
import Card1 from "../../assets/Landing Page/card-1.svg";
import Card2 from "../../assets/Landing Page/card-2.svg";
import Card3 from "../../assets/Landing Page/card-3.svg";

function Meals(props) {
  return (
    <main className="meals">
      <h1>Special Meals of the day!</h1>
      <p>
        Check our specials of the day and get discount on all our meals and
        swift delivery to whatever location in ilorin
      </p>
      <div className="meal-container">
        <Card
          handleLoad={props.handleLoad}
          image={Card1}
          name="Stir fry Pasta"
        />
        <Card handleLoad={props.handleLoad} image={Card2} name="Fried Meat" />
        <Card handleLoad={props.handleLoad} image={Card3} name="Burger Meal" />
      </div>
    </main>
  );
}

export default Meals;
