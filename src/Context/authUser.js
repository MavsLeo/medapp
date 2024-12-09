import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";

export const useAuth = () => {
  const [isAuthed, setIsAuthed] = useState();
  const [authUser, setAuthUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
        setIsAuthed(true);
      } else {
        setAuthUser(null);
        setIsAuthed(false);
      }
    });
    return unsubscribe;
  }, [authUser]);

  return {
    isAuthed,
    authUser,
  };
};
