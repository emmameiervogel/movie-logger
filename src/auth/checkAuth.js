import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app"; // use firebase dependency
import "firebase/compat/auth"; // use firebase auth package
import SignIn from "./signIn.js";
import Authenticated from "./authenticated.js";
import { api } from "../api/dataAccess.js";

function CheckAuth() {
  const [user, setUser] = useState();

  const checkIfUserExists = (userAuth) => {
    const user = {
      fullName: userAuth.displayName,
      email: userAuth.email,
      uid: userAuth.uid,
      dateVisited: new Date(),
    };
    api.getSingleRequest("users", "uid", user.uid).then((data) => {
      if (data === "Nope" || data === null) {
        api.postRequest("users", user).then((user) => {
          setUser(user);
        });
      } else {
        setUser(user);
      }
    });
  };

  useEffect(() => {
    console.log("use effect triggered");
    // You can use this function to watch to see if a user is authenticated
    firebase.auth().onAuthStateChanged((authed) => {
      if (authed) {
        checkIfUserExists(authed);
      }
      setUser(null);
    });
  }, []);

  return <>{user ? <Authenticated /> : <SignIn />}</>;
}

export default CheckAuth;