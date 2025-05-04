import Card1 from "../../assets/landing_page/card-1.svg";
import Card2 from "../../assets/landing_page/card-2.svg";
import Card3 from "../../assets/landing_page/card-3.svg";

// Create a new GlassmorphicCard component
interface GlassmorphicCardProps {
  image: string;
  name: string;
}

const GlassmorphicCard = ({ image, name }: GlassmorphicCardProps) => {
  return (
    <div className="backdrop-blur-md bg-white/10 hover:bg-white/15 border border-white/30 rounded-xl shadow-lg overflow-hidden transition-all duration-300 group">
      <div className="p-6 flex flex-col items-center">
        {/* Image container with glow effect */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-custom-orange/30 to-teal-400/20 rounded-full blur-xl scale-75 opacity-70 group-hover:opacity-100 transition-all duration-300"></div>
          <img
            src={image}
            alt={name}
            className="relative z-10 w-32 h-32 object-contain drop-shadow-xl"
          />
        </div>

        {/* Meal name with glass effect */}
        <h3 className="text-white text-xl font-medium">{name}</h3>

        {/* Glass button */}
        <button className="mt-4 py-2 px-6 rounded-md text-emerald-900 bg-gradient-to-r from-custom-orange to-amber-500 hover:from-custom-orange-hover hover:to-amber-600 cursor-pointer font-semibold shadow-lg border border-white/20 transition-all duration-300 whitespace-nowrap text-sm transition-all duration-300">
          Order Now
        </button>
      </div>
    </div>
  );
};

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
    <main className="text-center mt-16 px-6 sm:px-10 lg:px-20">
      {/* Glassmorphism container for the section */}
      <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-lg p-8 sm:p-12">
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-4 sm:mb-6">
          Special Meals of the day!
        </h1>
        <p className="text-sm sm:text-base text-white/80 font-normal max-w-3xl mx-auto">
          Check our specials of the day and get discount on all our meals and
          swift delivery to whatever location in ilorin
        </p>

        {/* Meals grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-8 sm:gap-10 mt-12 sm:mt-16">
          {meals.map((meal) => (
            <GlassmorphicCard
              key={meal.id}
              image={meal.image}
              name={meal.name}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Meals;
