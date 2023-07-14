import { router, useSegments } from "expo-router";
import React, { PropsWithChildren } from "react";

const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  isAuthed: false,
});

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(isAuthed: boolean) {
  const segments = useSegments();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !isAuthed &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (isAuthed && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [isAuthed, segments]);
}

export function Provider(props: PropsWithChildren) {
  const [isAuthed, setAuth] = React.useState(false);

  useProtectedRoute(isAuthed);

  return (
    <AuthContext.Provider
      value={{
        signIn: () => setAuth(true),
        signOut: () => setAuth(false),
        isAuthed,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
