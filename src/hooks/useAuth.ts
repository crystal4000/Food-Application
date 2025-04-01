import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth } from "../utils/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return user;
};