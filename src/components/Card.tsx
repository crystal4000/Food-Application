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
    <div className="">
      <div className="relative mx-auto w-56 h-56">
        {" "}
        <img
          onLoad={handleImageLoad}
          src={`${props.image}`}
          alt={props.name}
          className={`mx-auto object-cover rounded-full w-full h-full ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } transition-opacity duration-500`}
        />
        <div
          className={`mx-auto bg-custom-orange absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center transition-opacity duration-500 rounded-full ${
            showLoader ? "opacity-100" : "opacity-0"
          } ${!showLoader && "hidden"}`}
        >
          <img src={Loader} alt="Loading..." className="w-16 h-16" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-custom-orange-text mt-4">
        {props.name}
      </h2>
      <p className="text-lg text-white-83 font-normal mt-4 px-10">
        Stir fry pasta yada yada yada because of Sasan.
      </p>
    </div>
  );
}

export default Card;
