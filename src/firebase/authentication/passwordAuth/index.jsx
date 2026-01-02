import {
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { RoutesEnum } from "../../../utils";
import { FirebaseError } from "firebase/app";
import { generateFirebaseAuthErrorMessage } from "../errorHandler/index";

export const forgotPassword = async (
  email,
  navigate
) => {
  try {
    // check email exist or not
    if (email === "") {
      alert("Please enter your email address!");
      return;
    }
    // send password reset email
    await sendPasswordResetEmail(auth, email);
    navigate(RoutesEnum.Home);
  } catch (error) {
    if (error instanceof FirebaseError) {
      generateFirebaseAuthErrorMessage(error);
    }
    console.error(error);
  }
};

export const updateUserPassword = async (
  currentPassword,
  newPassword,
  navigate,
  setIsLoading
) => {
  try {
    //  check if valid user
    const user = auth.currentUser;
    if (!user) return;
    // check if current password is valid
    if (
      !currentPassword ||
      currentPassword === "" ||
      currentPassword.length < 6
    ) {
      alert("Please enter your current password");
      return;
    }
    // check if new password is valid
    if (!newPassword || newPassword === "") {
      alert("Please enter your new password");
      return;
    }
    setIsLoading(true);
    // validate old password
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    // reauthenticate user
    await reauthenticateWithCredential(user, credential);
    // update password
    await updatePassword(user, newPassword);
    navigate(RoutesEnum.Login);
    alert("Password updated successfully");
  } catch (error) {
    if (error instanceof FirebaseError) {
      generateFirebaseAuthErrorMessage(error);
    }
    console.error(error);
  }
};