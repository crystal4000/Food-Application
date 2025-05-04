import Hero1 from "../../assets/landing_page/hero1.svg";
import GooglePlay from "../../assets/landing_page/googleplay.svg";
import AppStore from "../../assets/landing_page/appstore.svg";

const Hero = () => {
  return (
    <section className="relative" style={{ zIndex: 1 }}>
      <div
        className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl shadow-lg mx-6 sm:mx-10 lg:mx-20 p-6 sm:p-10"
        style={{ zIndex: 1 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 py-6 sm:py-8 lg:py-12 w-full">
          <div className="col-span-1 lg:col-span-8 order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl text-white font-medium leading-snug">
              Order <span className="text-custom-orange">food</span> anytime,
              anywhere.
            </h1>

            <p className="text-white/80 font-normal text-base sm:text-lg mt-6 sm:mt-10 w-full sm:w-11/12 mx-auto lg:mx-0">
              Browse from our list of specials to place your order and have food
              delivered to you, in no time. Affordable, tasty and fast.
            </p>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-10">
              <a
                href="/"
                className="rounded-xl p-2 transition-all duration-300"
              >
                <img
                  src={GooglePlay}
                  alt="Google Play"
                  className="w-36 sm:w-auto"
                />
              </a>
              <a
                href="/"
                className="rounded-xl p-2 transition-all duration-300"
              >
                <img
                  src={AppStore}
                  alt="App Store"
                  className="w-36 sm:w-auto"
                />
              </a>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 flex justify-center items-center order-1 lg:order-2 mb-8 lg:mb-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/30 to-emerald-500/20 rounded-full blur-xl -z-10 scale-90"></div>
              <img
                src={Hero1}
                alt="food"
                className="w-3/4 sm:w-1/2 lg:w-full max-w-sm relative z-10 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
