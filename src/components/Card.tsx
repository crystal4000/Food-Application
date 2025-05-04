import { useState } from "react";
import Loader from "../assets/landing_page/loader.svg";

interface CardProps {
  image: string;
  name: string;
}

function Card(props: CardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 300);
  };

  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-xl shadow-lg p-6 transition-all duration-300 hover:bg-white/15 group">
      <div className="relative mx-auto w-56 h-56">
        <div className="absolute inset-0 -m-2 bg-gradient-to-br from-custom-orange/30 to-teal-400/20 rounded-full blur-xl scale-90 opacity-70 group-hover:opacity-100 transition-all duration-300"></div>

        <img
          onLoad={handleImageLoad}
          src={`${props.image}`}
          alt={props.name}
          className={`mx-auto object-cover rounded-full w-full h-full relative z-10 drop-shadow-xl ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
        />

        <div
          className={`mx-auto bg-gradient-to-br from-custom-orange to-amber-500 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-opacity duration-500 rounded-full ${
            showLoader ? "opacity-100" : "opacity-0"
          } ${!showLoader && "hidden"}`}
        >
          <img src={Loader} alt="Loading..." className="w-16 h-16" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-custom-orange mt-6">
        {props.name}
      </h2>

      <p className="text-lg text-white/80 font-normal mt-4">
        Stir fry pasta yada yada yada because of Sasan.
      </p>

      <button className="mt-6 py-2 px-6 backdrop-blur-sm bg-white/20 hover:bg-white/30 border border-white/30 rounded-md text-white text-sm transition-all duration-300 w-full">
        Order Now
      </button>
    </div>
  );
}

export default Card;
