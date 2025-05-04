import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };
  return (
    <button
      onClick={handleBackClick}
      className="mr-4 p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors duration-200"
    >
      <BiArrowBack className="w-5 h-5 text-emerald-900" />
    </button>
  );
};

export default BackButton;
