import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { applyActionCode, AuthError } from "firebase/auth";
import { auth } from "../utils/firebase";
import { toast } from "sonner";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

const EmailActionHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!mode || !oobCode) {
      setStatus("error");
      setMessage("Invalid or expired link");
      return;
    }

    handleAction();
  }, [mode, oobCode]);

  const handleAction = async () => {
    try {
      switch (mode) {
        case "verifyEmail":
          await handleVerifyEmail();
          break;
        case "resetPassword":
          // Redirect to password reset page with code
          navigate(`/new-password?oobCode=${oobCode}`);
          break;
        case "recoverEmail":
          await handleRecoverEmail();
          break;
        default:
          setStatus("error");
          setMessage("Invalid action");
      }
    } catch (error: unknown) {
      const firebaseError = error as AuthError;
      console.error("Action error:", firebaseError);
      setStatus("error");

      if (firebaseError.code === "auth/invalid-action-code") {
        setMessage("This link has expired or has already been used");
      } else if (firebaseError.code === "auth/expired-action-code") {
        setMessage("This link has expired. Please request a new one");
      } else {
        setMessage(firebaseError.message || "An error occurred");
      }
    }
  };

  const handleVerifyEmail = async () => {
    if (!oobCode) return;

    await applyActionCode(auth, oobCode);
    setStatus("success");
    setMessage("Email verified successfully!");
    toast.success("Email verified! You can now login.");

    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const handleRecoverEmail = async () => {
    if (!oobCode) return;

    await applyActionCode(auth, oobCode);
    setStatus("success");
    setMessage("Email recovered successfully!");

    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-700 to-emerald-900 p-4">
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl"></div>
      <div className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl"></div>

      <div className="w-full max-w-md backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl shadow-xl p-8 text-center relative z-10">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-custom-orange mx-auto mb-4"></div>
            <p className="text-white text-lg">Processing...</p>
          </>
        )}

        {status === "success" && (
          <>
            <HiCheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Success!</h1>
            <p className="text-white/80 mb-6">{message}</p>
            <p className="text-white/60 text-sm">Redirecting to login...</p>
          </>
        )}

        {status === "error" && (
          <>
            <HiXCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
            <p className="text-white/80 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-semibold rounded-lg transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailActionHandler;
