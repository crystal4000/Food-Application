import pizzaIcon from "../assets/dasboard/pizza.svg";
import sushiIcon from "../assets/dasboard/sushi.svg";
import meatIcon from "../assets/dasboard/beef.svg";
import saladIcon from "../assets/dasboard/salad.svg";
import dangoIcon from "../assets/dasboard/dango.svg";
import burgerIcon from "../assets/dasboard/burger.svg";
import ramenIcon from "../assets/dasboard/ramen.svg";
import dessertIcon from "../assets/dasboard/dessert.svg";

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const iconUrls = () => {
  return {
    pizza: pizzaIcon,
    sushi: sushiIcon,
    meat: meatIcon,
    salad: saladIcon,
    dango: dangoIcon,
    burger: burgerIcon,
    ramen: ramenIcon,
    dessert: dessertIcon,
    pasta: dessertIcon,
    rice: dessertIcon,
    soup: dessertIcon,
    seafood: dessertIcon,
    chicken: dessertIcon,
    vegetables: dessertIcon,
    fruit: dessertIcon,
    iceCream: dessertIcon,
  };
};

export const foodCategories = [
  { id: 1, name: "Pizza", iconUrl: iconUrls().pizza },
  { id: 2, name: "Sushi", iconUrl: iconUrls().sushi },
  { id: 3, name: "Meat", iconUrl: iconUrls().meat },
  { id: 4, name: "Salad", iconUrl: iconUrls().salad },
  { id: 5, name: "Dango", iconUrl: iconUrls().dango },
  { id: 6, name: "Burger", iconUrl: iconUrls().burger },
  { id: 7, name: "Ramen", iconUrl: iconUrls().ramen },
  { id: 8, name: "Dessert", iconUrl: iconUrls().dessert },
  { id: 9, name: "Pasta", iconUrl: iconUrls().pasta },
  { id: 10, name: "Rice", iconUrl: iconUrls().rice },
  { id: 11, name: "Soup", iconUrl: iconUrls().soup },
  { id: 12, name: "Seafood", iconUrl: iconUrls().seafood },
  { id: 13, name: "Chicken", iconUrl: iconUrls().chicken },
  { id: 14, name: "Vegetables", iconUrl: iconUrls().vegetables },
];
