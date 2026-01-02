import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
} from "firebase/auth";
import { auth } from "../../firebase";
import { RoutesEnum } from "../../../utils";
import { FirebaseError } from "firebase/app";
import { generateFirebaseAuthErrorMessage } from "../errorHandler/index";
import { createUser, updateUserEmailVerification } from "../../../api/api";

export const registerUser = async (
  name,
  email,
  password,
  role,
  setLoading,
  navigate
) => {
  try {
    setLoading(true);
    // create a new user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const results = userCredential.user;
    console.log(results);

    // Save user data to MongoDB
    try {
      await createUser({
        uid: results.uid,
        email: email,
        name: name,
        role: role,
        isEmailVerified: false
      });
      console.log("User data saved to MongoDB");
    } catch (dbError) {
      console.error("Failed to save user to MongoDB:", dbError);
      // Continue with email verification even if MongoDB save fails
    }

    // Send an email verification to the users email
    await sendEmailVerification(results);
    alert(
      `A verification email has been sent to your email address ${name}!. Please verify your email to login.`
    );
  } catch (error) {
    if (error instanceof FirebaseError) {
      generateFirebaseAuthErrorMessage(error);
    }
    console.error(error);
  } finally {
    setLoading(false);
    navigate(RoutesEnum.Home);
  }
};

export const loginUserWithEmailAndPassword = async (
  email,
  password,
  navigate
) => {
  try {
    console.log(email, password);
    // Login user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const results = userCredential.user;
    if (results.emailVerified === false) {
      alert("Please verify your email to login.");
      return;
    }

    // Sync email verification status with MongoDB
    try {
      await updateUserEmailVerification(results.uid, results.emailVerified);
      console.log("Email verification status synced with MongoDB");
    } catch (dbError) {
      console.error("Failed to sync email verification with MongoDB:", dbError);
      // Continue with login even if sync fails
    }

    navigate(RoutesEnum.Home);
  } catch (error) {
    if (error instanceof FirebaseError) {
      generateFirebaseAuthErrorMessage(error);
    }
    console.error(error);
  }
};

export const updateUserEmail = async (
  email,
  newEmail,
  password,
  setIsLoading
) => {
  try {
    if (auth.currentUser === null) return;
    setIsLoading(true);

    // Reauthenticate the user before updating the email
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(auth.currentUser, credential);

    // Update the email after successful reauthentication
    await updateEmail(auth.currentUser, newEmail);

    // Send email verification to the new email
    await sendEmailVerification(auth.currentUser);
    alert(
      `A verification email has been sent to your new email address ${newEmail}!. Please verify your email to login.`
    );
  } catch (error) {
    if (error instanceof FirebaseError) {
      generateFirebaseAuthErrorMessage(error);
    }
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};