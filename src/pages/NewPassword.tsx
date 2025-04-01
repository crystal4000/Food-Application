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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-color-bg mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-color-bg/70 mb-6">
            The password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate("/reset-password")}
            className="text-custom-orange hover:text-custom-orange-hover"
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white relative min-h-[100vh] md:min-h-0">
        <button
          onClick={handleBack}
          className="absolute top-4 md:top-8 left-4 md:left-8 flex items-center text-color-bg hover:text-custom-orange transition-colors duration-200"
        >
          <FaArrowLeft className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="w-full max-w-md px-4 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-color-bg">
            Set New Password
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-10"
          >
            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-color-bg transition-colors duration-200">
                <span className="text-color-bg mr-2">
                  <FaLock className="h-5 w-5" />
                </span>
                <input
                  {...register("password")}
                  type={passwordShown ? "text" : "password"}
                  placeholder="New Password"
                  className="appearance-none bg-transparent border-none w-full text-color-bg mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-color-bg/50"
                />
                <button
                  type="button"
                  onClick={() => setPasswordShown(!passwordShown)}
                  className="text-color-bg"
                >
                  {passwordShown ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center border-b-2 border-custom-orange py-2 focus-within:border-color-bg transition-colors duration-200">
                <span className="text-color-bg mr-2">
                  <FaLock className="h-5 w-5" />
                </span>
                <input
                  {...register("confirmPassword")}
                  type={confirmPasswordShown ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="appearance-none bg-transparent border-none w-full text-color-bg mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-color-bg/50"
                />
                <button
                  type="button"
                  onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}
                  className="text-color-bg"
                >
                  {confirmPasswordShown ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-color-bg hover:bg-custom-orange text-custom-orange-text hover:text-color-bg font-bold rounded-full transition duration-200"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-custom-orange/40 to-color-bg/40 z-10" />
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
