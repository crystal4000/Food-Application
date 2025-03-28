import Footer from "../components/Home/Footer";
import Hero from "../components/Home/Hero";
import Meals from "../components/Home/Meals";
import Nav from "../components/Home/Nav";
import Notify from "../components/Home/Notify";

const Home = () => {
  return (
    <div className="bg-[#00302e] pt-8 h-full w-full">
      <Nav />
      <Hero />
      <Meals />
      <Notify />
      <Footer />
    </div>
  );
};

export default Home;
