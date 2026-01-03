import { FirebaseError } from "firebase/app";
import { signInWithPopup, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth, googleAuthProvider } from "../../firebase";
import { RoutesEnum } from "../../../utils";
import { generateFirebaseAuthErrorMessage } from "../errorHandler/index";
import { getUserByUid, createUser } from "../../../api/api";

export const signInUserWithGoogle = async (navigate, onUserNotFound) => {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    if (!result || !result.user) {
      throw new Error("No user found");
    }
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log(user);

    // Check if user exists in MongoDB
    try {
      await getUserByUid(user.uid);
      console.log("User already exists in MongoDB");

      // User exists, proceed to account page
      navigate(RoutesEnum.Account);
      alert(`Welcome ${user.displayName}!`);
    } catch (error) {
      // User doesn't exist - sign them out first
      await auth.signOut();

      // Then let the caller handle role selection
      if (onUserNotFound) {
        // Pass user data and credential to the callback
        onUserNotFound({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          credential: credential,
        });
      } else {
        throw new Error("USER_NOT_FOUND");
      }
    }
  } catch (error) {
    if (error instanceof FirebaseError) {
      generateFirebaseAuthErrorMessage(error);
    }
    console.log(error);
    throw error;
  }
};

export const completeGoogleSignUp = async (userData, role, navigate) => {
  try {
    console.log("Starting completeGoogleSignUp with userData:", userData);

    // First, create the user in MongoDB BEFORE re-authenticating
    console.log("Creating user in MongoDB...");
    await createUser({
      uid: userData.uid,
      email: userData.email,
      name: userData.displayName || userData.email,
      role: role,
      isEmailVerified: true
    });
    console.log("✓ User data saved to MongoDB");

    // Now re-authenticate with Firebase after MongoDB user exists
    if (userData.credential) {
      console.log("Re-authenticating with Firebase...");
      await signInWithCredential(auth, userData.credential);
      console.log("✓ Re-authenticated with Firebase");
    } else {
      console.warn("No credential found, cannot re-authenticate");
    }

    navigate(RoutesEnum.Account);
    alert(`Welcome ${userData.displayName}!`);
  } catch (error) {
    console.error("Failed to complete Google sign-up:", error);
    // Sign out the user since we couldn't create their account
    await auth.signOut();
    throw error;
  }
};