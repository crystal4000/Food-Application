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
    <footer className="mt-24 bg-footer-bg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 sm:px-10 lg:px-20 py-10">
        <div className="">
          <h3 className="text-footer-header text-lg font-medium mb-6">
            Company
          </h3>
          {company.map((link) => (
            <p key={link.id} className="mb-3">
              <a
                href={link.href}
                className="text-footer-link text-sm font-normal"
              >
                {link.text}
              </a>
            </p>
          ))}
        </div>
        <div className="links">
          <h3 className="text-footer-header text-lg font-medium mb-6">
            Support
          </h3>
          {support.map((link) => (
            <p key={link.id} className="mb-3">
              <a
                href={link.href}
                className="text-footer-link text-sm font-normal"
              >
                {link.text}
              </a>
            </p>
          ))}
        </div>
        <div className="">
          <h3 className="text-footer-header text-lg font-medium mb-6">Legal</h3>
          {legal.map((link) => (
            <p key={link.id} className="mb-3">
              <a
                href={link.href}
                className="text-footer-link text-sm font-normal"
              >
                {link.text}
              </a>
            </p>
          ))}
        </div>
        <div className="">
          <h3 className="text-footer-header text-lg font-medium mb-6">
            Install App
          </h3>
          <div className="flex flex-col space-y-5">
            <a href="/">
              <img
                src={GooglePlay}
                alt="Google Play Store"
                className="w-36 sm:w-40"
              />
            </a>

            <a href="/">
              <img src={AppStore} alt="App Store" className="w-36 sm:w-40" />
            </a>
          </div>
        </div>
      </div>
      <div className="h-1 bg-border-color w-full"></div>
      <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 lg:px-20 py-6 sm:py-10 text-copyright-color">
        <p className="flex items-center mb-4 sm:mb-0">
          <BiCopyright />
          {`${new Date().getFullYear()} Lilies. All rights reserved`}
        </p>
        <div className="flex items-center space-x-6 sm:space-x-10">
          <BsInstagram className="h-5 w-5 sm:h-6 sm:w-6" />
          <BsTwitter className="h-5 w-5 sm:h-6 sm:w-6" />
          <BsYoutube className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
