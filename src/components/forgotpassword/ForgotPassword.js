import { TextField } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";
import { auth, db } from "../../firebase/firebase";
import "./forgotpassword.scss";
import { useHistory } from "react-router-dom";

const ForgotPassword = ({ isShopping }) => {
  const INITIAL_USERNAME_STATE = {
    value: "",
    error: false,
    errorMessage: "Please enter your user name",
  };

  const [userIsShopping, setUserIsShopping] = useState(isShopping);
  const [username, setUsername] = useState(INITIAL_USERNAME_STATE);

  const history = useHistory();

  const handleForgotPasswordOnChange = (e) => {
    const { value } = e.target;
    let error = true;
    value !== "" ? (error = false) : (error = true);
    setUsername({
      ...username,
      value,
      error,
    });
  };

  const handleForgotPasswordFormSubmit = (e) => {
    e.preventDefault();

    let newFormValues = { ...username }; // new State Values

    if (username.value === "") {
      newFormValues = {
        ...newFormValues,
        error: true,
      };
    }

    setUsername(newFormValues);
    if (!newFormValues.error) {
      submitForgotPasswordForm(newFormValues, userIsShopping);
    }
    console.log(newFormValues);
  };

  const submitForgotPasswordForm = async (state, isShopping) => {
    console.log("form Submit", isShopping);
    if (isShopping) {
      await db
        .collection("ShoppingUsers")
        .where("username", "==", state.value)
        .get()
        .then((data) => {
          if (data.empty) {
            // no username found in shopping Users db
            setUsername({
              ...username,
              error: true,
              errorMessage: "No Username found in our database",
            });
          } else {
            auth.sendPasswordResetEmail(state.value);
            alert("Link Sent to your Email Address!");
            history.push("/");
          }
        });
    } else {
      await db
        .collection("BusinessUsers")
        .where("username", "==", state.value)
        .get()
        .then((data) => {
          if (data.empty) {
            // no username found in shopping Users db
            setUsername({
              ...username,
              error: true,
              errorMessage: "No Username found in our database",
            });
          } else {
            auth.sendPasswordResetEmail(state.value);
            alert("Link Sent to your Email Address!");
            history.push("/");
          }
        });
    }
  };

  {
    /** the layout is pretty same as of login page hence using the same classes to inherit the login page styling */
  }
  return (
    <div className="login-page">
      <div className="triangle"></div>
      <div className="card">
        <div className="forgotpassword-card-head">
          <h4 className="card-header">Forgot Password?</h4>
        </div>
        <div className="forgotpassword card-body">
          <p className="forgot-password-text">
            Enter your e-mail address/username
          </p>
          <p className="forgot-password-text">
            we'll send you an email to reset your password
          </p>
          <form
            onChange={handleForgotPasswordOnChange}
            onSubmit={handleForgotPasswordFormSubmit}
            noValidate
            className="forgotpassword-form"
          >
            <TextField
              required
              id="username"
              label="username"
              name="username"
              variant="outlined"
              type="text"
              error={username.error}
              helperText={username.error && username.errorMessage}
            />
            <button className="btn solid">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  console.log(state);
  return {
    isShopping: state.users,
  };
};
export default connect(mapStateToProps, null)(ForgotPassword);
