import Card1 from "../../assets/landing_page/card-1.svg";
import Card2 from "../../assets/landing_page/card-2.svg";
import Card3 from "../../assets/landing_page/card-3.svg";
import Card from "../Card";

function Meals() {
  const meals = [
    {
      id: 1,
      image: Card1,
      name: "Stir fry Pasta",
    },
    {
      id: 2,
      image: Card2,
      name: "Fried Meat",
    },
    {
      id: 3,
      image: Card3,
      name: "Burger Meal",
    },
  ];
  return (
    <main className="text-center mt-10 px-6 sm:px-10">
      <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-white-87 mb-4 sm:mb-6">
        Special Meals of the day!
      </h1>
      <p className="text-sm sm:text-base text-white-83 font-normal max-w-3xl mx-auto">
        Check our specials of the day and get discount on all our meals and
        swift delivery to whatever location in ilorin
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-8 sm:gap-10 mt-12 sm:mt-16 lg:mt-24">
        {meals.map((meal) => (
          <Card key={meal.id} image={meal.image} name={meal.name} />
        ))}
      </div>
    </main>
  );
}

export default Meals;
