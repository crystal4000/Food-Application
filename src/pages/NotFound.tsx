import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lottie from "lottie-web";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: document.getElementById("lottie-container")!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "https://lottie.host/ebff119c-921c-4611-b261-7e9f5ead20dc/HmbSvNCJRn.json",
    });

    return () => {
      animation.destroy();
    };
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-500/20 to-emerald-500/30 p-4">
      <div className="max-w-lg w-full backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl shadow-xl p-6 sm:p-8 text-center">
        <div
          id="lottie-container"
          className="w-64 h-64 sm:w-80 sm:h-80 mx-auto mb-6"
        ></div>

        <h1 className="text-4xl sm:text-5xl font-bold text-emerald-900 mb-4">
          Oops!
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-800 mb-4">
          Page Not Found
        </h2>
        <p className="my-8 text-emerald-800 max-w-md text-center">
          Even the best chefs can't cook up a page that doesn't exist! Let's
          find you something delicious instead.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGoHome}
            className="py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300"
          >
            Go Home
          </button>
          <button
            onClick={handleGoBack}
            className="py-3 px-6 bg-white/50 backdrop-blur-sm border border-white/40 text-emerald-900 font-medium rounded-full hover:bg-white/70 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
