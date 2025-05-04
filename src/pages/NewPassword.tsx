import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { confirmPasswordReset, AuthError } from "firebase/auth";
import { auth } from "../utils/firebase";
import { NewPasswordFormValues, newPasswordSchema } from "../utils/schema";
import { toast } from "sonner";
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

import foodImage from "../assets/auth/login-img.svg";

const NewPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [passwordShown, setPasswordShown] = React.useState<boolean>(false);
  const [confirmPasswordShown, setConfirmPasswordShown] =
    React.useState<boolean>(false);

  const oobCode = searchParams.get("oobCode");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordFormValues): Promise<void> => {
    if (!oobCode) {
      toast.error("Invalid password reset link");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      toast.success("Password reset successful!");
      window.setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: unknown) {
      const firebaseError = error as AuthError;
      toast.error(firebaseError.message || "Failed to reset password");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!oobCode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-700 to-emerald-900">
        <div className="p-4 sm:p-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl max-w-sm sm:max-w-md mx-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">
            Invalid Reset Link
          </h1>
          <p className="text-sm sm:text-base text-white/80 mb-4 sm:mb-6 text-center">
            The password reset link is invalid or has expired.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/reset-password")}
              className="py-2 px-4 sm:px-6 bg-gradient-to-r from-custom-orange to-amber-500 hover:from-custom-orange-hover hover:to-amber-600 text-emerald-900 font-medium rounded-full transition duration-300 shadow-lg text-sm sm:text-base"
            >
              Request a new reset link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gradient-to-br from-teal-700 to-emerald-900 overflow-hidden">
      <div className="absolute top-20 sm:top-40 right-8 sm:right-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 rounded-full bg-teal-400/20 blur-3xl"></div>
      <div className="absolute bottom-20 sm:bottom-40 left-8 sm:left-1/4 w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 rounded-full bg-teal-500/10 blur-3xl"></div>

      <div className="w-full md:w-1/2 flex items-center justify-center min-h-screen p-4 md:p-8 relative z-10">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 flex items-center text-white/90 hover:text-custom-orange transition-colors duration-200"
        >
          <FaArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
          <span className="text-xs sm:text-sm font-medium">Back</span>
        </button>

        <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-6 py-6 sm:py-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-white">
            Set New Password
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-white/80 transition-colors duration-200">
                <span className="text-white/90 mr-2">
                  <FaLock className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <input
                  {...register("password")}
                  type={passwordShown ? "text" : "password"}
                  placeholder="New Password"
                  className="appearance-none bg-transparent border-none w-full text-white text-sm sm:text-base mr-3 py-1 px-1 sm:px-2 leading-tight focus:outline-none placeholder-white/50"
                />
                <button
                  type="button"
                  onClick={() => setPasswordShown(!passwordShown)}
                  className="text-white/90"
                >
                  {passwordShown ? (
                    <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-white/80 transition-colors duration-200">
                <span className="text-white/90 mr-2">
                  <FaLock className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <input
                  {...register("confirmPassword")}
                  type={confirmPasswordShown ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="appearance-none bg-transparent border-none w-full text-white text-sm sm:text-base mr-3 py-1 px-1 sm:px-2 leading-tight focus:outline-none placeholder-white/50"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
                  className="text-white/90"
                >
                  {confirmPasswordShown ? (
                    <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-300 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-custom-orange to-amber-500 hover:from-custom-orange-hover hover:to-amber-600 text-emerald-900 font-bold rounded-full transition duration-300 shadow-lg text-sm sm:text-base"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-custom-orange/30 to-emerald-900/70 backdrop-blur-sm z-10" />
        <div
          className="h-full w-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${foodImage})`,
            backgroundPosition: "center center",
          }}
        />
      </div>
    </div>
  );
};

export default NewPassword;
