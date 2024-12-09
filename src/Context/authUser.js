import { useEffect, useState } from "react";
import { auth } from "./firebaseConfig";

export const useAuth = () => {
  const [isAuthed, setIsAuthed] = useState(null); // null indica carregamento
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
        setIsAuthed(true);
      } else {
        setAuthUser(null);
        setIsAuthed(false);
      }
      setLoading(false); // Finaliza o carregamento
    });
    return unsubscribe;
  }, []);

  return {
    isAuthed,
    authUser,
    loading,
  };
};
