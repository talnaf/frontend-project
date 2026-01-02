import { FirebaseError } from "firebase/app";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../../firebase";
import { RoutesEnum } from "../../../utils";
import { generateFirebaseAuthErrorMessage } from "../ErrorHandler";
import { createUser, getUserByUid } from "../../../api/api";

export const signInUserWithGoogle = async (navigate) => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    if (!result || !result.user) {
      throw new Error("No user found");
    }
    const user = result.user;
    console.log(user);

    // Check if user exists in MongoDB, if not create them
    try {
      await getUserByUid(user.uid);
      console.log("User already exists in MongoDB");
    } catch (error) {
      // User doesn't exist, create them with default role "user"
      // Google users have verified emails by default
      try {
        await createUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email,
          role: "user",
          isEmailVerified: true
        });
        console.log("User data saved to MongoDB");
      } catch (dbError) {
        console.error("Failed to save user to MongoDB:", dbError);
      }
    }

    navigate(RoutesEnum.Account);
    alert(`Welcome ${user.displayName}!`);
  } catch (error) {
    if (error instanceof FirebaseError) {
      generateFirebaseAuthErrorMessage(error);
    }
    console.log(error);
  }
};