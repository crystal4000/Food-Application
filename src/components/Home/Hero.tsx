import Hero1 from "../../assets/landing_page/hero1.svg";
import GooglePlay from "../../assets/landing_page/googleplay.svg";
import AppStore from "../../assets/landing_page/appstore.svg";

const Hero = () => {
  return (
    <section className="">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 px-6 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-24 w-full">
        <div className="col-span-1 lg:col-span-8 order-2 lg:order-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl text-white font-medium leading-snug">
            Order <span className="text-custom-orange">food</span> anytime,
            anywhere.
          </h1>

          <p className="text-white-74 font-normal text-base sm:text-lg mt-6 sm:mt-10 w-full sm:w-11/12 mx-auto lg:mx-0">
            Browse from our list of specials to place your order and have food
            delivered to you, in no time. Affordable, tasty and fast.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-10">
            <img
              src={GooglePlay}
              alt="Google Play"
              className="w-36 sm:w-auto"
            />
            <img src={AppStore} alt="App Store" className="w-36 sm:w-auto" />
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4 flex justify-center items-center order-1 lg:order-2 mb-8 lg:mb-0">
          <img
            src={Hero1}
            alt="food"
            className="w-3/4 sm:w-1/2 lg:w-full max-w-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
