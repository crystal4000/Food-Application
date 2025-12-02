import { useEffect, useRef, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number; // Session timeout in minutes (default: 30)
  warningMinutes?: number; // Warning before timeout (default: 5)
  enabled?: boolean; // Enable/disable timeout
}

export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 5,
  enabled = true,
}: UseSessionTimeoutOptions = {}) => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      toast.error("Session expired. Please login again.");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [navigate]);

  const resetTimers = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    lastActivityRef.current = Date.now();

    if (!enabled) return;

    // Set warning timer
    const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
    warningRef.current = setTimeout(() => {
      toast.warning(
        `Your session will expire in ${warningMinutes} minute${warningMinutes > 1 ? "s" : ""} due to inactivity.`,
        { duration: 10000 }
      );
    }, warningTime);

    // Set logout timer
    const timeoutTime = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutTime);
  }, [enabled, timeoutMinutes, warningMinutes, logout]);

  useEffect(() => {
    if (!enabled) return;

    // Events that count as user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // Reset timers on any activity
    const handleActivity = () => {
      resetTimers();
    };

    // Initialize timers
    resetTimers();

    // Add event listeners
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [enabled, resetTimers]);

  return {
    resetTimers,
    lastActivity: lastActivityRef.current,
  };
};