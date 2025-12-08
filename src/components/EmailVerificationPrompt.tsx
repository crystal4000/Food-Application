import { useState } from "react";
import { AuthError, sendEmailVerification } from "firebase/auth";
import { auth } from "../utils/firebase";
import { toast } from "sonner";
import { HiMail, HiX } from "react-icons/hi";

interface EmailVerificationPromptProps {
  onClose?: () => void;
}

const EmailVerificationPrompt: React.FC<EmailVerificationPromptProps> = ({
  onClose,
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleResendVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: unknown) {
      const firebaseError = error as AuthError;
      if (firebaseError.code === "auth/too-many-requests") {
        toast.error(
          firebaseError.message || "Too many requests. Please try again later."
        );
      } else {
        toast.error(
          firebaseError.message ||
            "Failed to send verification email. Please try again."
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  //   const handleSignOut = async () => {
  //     await auth.signOut();
  //     onClose?.();
  //   };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="backdrop-blur-md bg-white/95 border border-white/30 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-custom-orange/20 rounded-full flex items-center justify-center">
              <HiMail className="w-6 h-6 text-custom-orange" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-900">
                Verify Your Email
              </h2>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-emerald-100 rounded-full transition-colors"
            >
              <HiX className="w-5 h-5 text-emerald-700" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-emerald-700">
            We've sent a verification email to{" "}
            <span className="font-semibold text-emerald-900">
              {auth.currentUser?.email}
            </span>
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              You must verify your email before you can place orders or access
              certain features.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              disabled={isSending}
              className="w-full py-3 bg-custom-orange hover:bg-amber-500 text-emerald-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? "Sending..." : "Resend Verification Email"}
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold rounded-lg transition-colors"
            >
              I've Verified My Email
            </button>

            {/* <button
              onClick={handleSignOut}
              className="w-full py-3 bg-white/50 hover:bg-white/80 text-emerald-700 font-semibold rounded-lg transition-colors"
            >
              Sign Out
            </button> */}
          </div>

          <div className="text-center text-sm text-emerald-600">
            <p>Didn't receive the email?</p>
            <p className="text-xs mt-1">Check your spam folder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPrompt;
