import { HiX } from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  message_contd?: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonColor?: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  message_contd,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonColor = "bg-red-500 hover:bg-red-600",
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="backdrop-blur-md bg-white/95 border border-white/30 rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        <div className="p-4">
          {/* Close button */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-emerald-900 hover:text-emerald-700 transition-colors p-1 rounded-lg outline-border-emerald-900 border border-emerald-900 hover:bg-emerald-900/10"
              aria-label="Close"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Icon and Title */}
          <div className="flex flex-col items-center justify-center gap-3 mb-4">
            <div className="flex-shrink-0 rounded-md bg-red-500/10 p-2">
              <HiOutlineExclamationTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900">{title}</h3>
          </div>

          {/* Message */}
          <p className="text-center text-emerald-900/70">{message}</p>
          <p className="text-center text-emerald-900/70">{message_contd}</p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 w-full">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-emerald-900 text-emerald-900 font-semibold rounded-lg hover:bg-emerald-50 transition-colors duration-300"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2 ${confirmButtonColor} text-white font-semibold rounded-lg transition-colors duration-300`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
