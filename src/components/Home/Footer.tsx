import GooglePlay from "../../assets/landing_page/googleplay.svg";
import AppStore from "../../assets/landing_page/appstore.svg";
import { BsInstagram } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { BiCopyright } from "react-icons/bi";

const Footer = () => {
  const company = [
    {
      id: 1,
      href: "/",
      text: "About Us",
    },
    {
      id: 2,
      href: "/",
      text: "Careers",
    },
    {
      id: 3,
      href: "/",
      text: "Contact Us",
    },
  ];
  const support = [
    {
      id: 1,
      href: "/",
      text: "Help Center",
    },
    {
      id: 2,
      href: "/",
      text: "Safety Center",
    },
  ];
  const legal = [
    {
      id: 1,
      href: "/",
      text: "Cookies Policy",
    },
    {
      id: 2,
      href: "/",
      text: "Privacy Policy",
    },
    {
      id: 3,
      href: "/",
      text: "Terms Of Service",
    },
  ];

  return (
    <footer className="mt-24 backdrop-blur-md bg-emerald-950/70 border-t border-white/10 rounded-t-3xl overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-10 lg:px-20 py-10">
        <div className="">
          <h3 className="text-white/90 text-lg font-medium mb-6 relative">
            <span className="relative z-10">Company</span>
            {/* <span className="absolute bottom-0 left-0 h-1 w-12 bg-custom-orange/70 rounded-full"></span> */}
          </h3>
          {company.map((link) => (
            <p key={link.id} className="mb-3">
              <a
                href={link.href}
                className="text-white/70 hover:text-white/90 text-sm font-normal transition-colors duration-300"
              >
                {link.text}
              </a>
            </p>
          ))}
        </div>

        <div className="links">
          <h3 className="text-white/90 text-lg font-medium mb-6 relative">
            <span className="relative z-10">Support</span>
            {/* <span className="absolute bottom-0 left-0 h-1 w-12 bg-custom-orange/70 rounded-full"></span> */}
          </h3>
          {support.map((link) => (
            <p key={link.id} className="mb-3">
              <a
                href={link.href}
                className="text-white/70 hover:text-white/90 text-sm font-normal transition-colors duration-300"
              >
                {link.text}
              </a>
            </p>
          ))}
        </div>

        <div className="">
          <h3 className="text-white/90 text-lg font-medium mb-6 relative">
            <span className="relative z-10">Legal</span>
            {/* <span className="absolute bottom-0 left-0 h-1 w-12 bg-custom-orange/70 rounded-full"></span> */}
          </h3>
          {legal.map((link) => (
            <p key={link.id} className="mb-3">
              <a
                href={link.href}
                className="text-white/70 hover:text-white/90 text-sm font-normal transition-colors duration-300"
              >
                {link.text}
              </a>
            </p>
          ))}
        </div>

        <div className="">
          <h3 className="text-white/90 text-lg font-medium mb-6 relative">
            <span className="relative z-10">Install App</span>
            {/* <span className="absolute bottom-0 left-0 h-1 w-12 bg-custom-orange/70 rounded-full"></span> */}
          </h3>
          <div className="flex flex-col space-y-5">
            <a href="/" className=" transition-all duration-300">
              <img
                src={GooglePlay}
                alt="Google Play Store"
                className="w-36 sm:w-40"
              />
            </a>

            <a href="/" className=" transition-all duration-300">
              <img src={AppStore} alt="App Store" className="w-36 sm:w-40" />
            </a>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-full"></div>

      <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 lg:px-20 py-6 sm:py-10 text-white/60">
        <p className="flex items-center mb-4 sm:mb-0">
          <BiCopyright className="mr-1" />
          {`${new Date().getFullYear()} Lilies. All rights reserved`}
        </p>
        <div className="flex items-center space-x-6 sm:space-x-10">
          <a
            href="/"
            className="p-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300"
          >
            <BsInstagram className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
          </a>
          <a
            href="/"
            className="p-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300"
          >
            <BsTwitter className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
          </a>
          <a
            href="/"
            className="p-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300"
          >
            <BsYoutube className="h-4 w-4 sm:h-5 sm:w-5 text-white/80" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
