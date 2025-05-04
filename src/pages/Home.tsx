import Footer from "../components/Home/Footer";
import Hero from "../components/Home/Hero";
import Meals from "../components/Home/Meals";
import Nav from "../components/Home/Nav";
import Notify from "../components/Home/Notify";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-700 to-emerald-900 pt-8 relative overflow-hidden">
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl"></div>
      <div className="absolute top-1/3 left-10 w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl"></div>
      <div className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl"></div>

      <div className="relative z-10">
        <Nav />
        <Hero />
        <Meals />
        <Notify />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
