import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import firebase from "firebase";
import { auth, db } from "../../firebase/firebase";
import { Button, FormGroup } from "@mui/material";
import "./login2.scss";
import { TextField } from "@material-ui/core";
import { userIsShopping } from "../../store/actions";

const Login = ({ userIsShopping }) => {
  const INITIAL_SIGN_IN_STATE = {
    username: {
      value: "",
      error: false,
      errorMessage: "Please enter your user name",
    },
    password: {
      value: "",
      error: false,
      errorMessage: "Please enter your password",
    },
  };

  const INITIAL_SIGN_UP_STATE = {
    firstname: {
      value: "",
      error: false,
      errorMessage: "Please enter your first name",
    },
    lastname: {
      value: "",
      error: false,
      errorMessage: "Please enter your last name",
    },
    username: {
      value: "",
      error: false,
      errorMessage: "Please enter your user name",
    },
    password: {
      value: "",
      error: false,
      errorMessage: "Please enter your password",
    },
  };

  const [signUpFormValues, setSignUpFormValues] = useState(
    INITIAL_SIGN_UP_STATE
  );

  const [signInFormValues, setSignInFormValues] = useState(
    INITIAL_SIGN_IN_STATE
  );

  const [isShopping, setIsShopping] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(true);

  const history = useHistory();

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    let error = true;
    value !== "" ? (error = false) : (error = true);
    setSignUpFormValues({
      ...signUpFormValues,
      [name]: {
        ...signUpFormValues[name],
        value,
        error,
      },
    });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    const formFields = Object.keys(signUpFormValues);
    let newFormValues = { ...signUpFormValues }; // new State Values

    formFields.map((formField) => {
      const currentField = formField;
      const currentValue = signUpFormValues[currentField].value;

      if (currentValue === "") {
        newFormValues = {
          ...newFormValues,
          [currentField]: {
            ...newFormValues[currentField],
            error: true,
          },
        };
      }
    });

    setSignUpFormValues(newFormValues);
    let formValidate = Object.values(newFormValues).every(
      (element) => element.error === false
    );

    if (formValidate) {
      submitSignUpForm(isShopping);
    }
  };

  const submitSignUpForm = async (isShopping) => {
    // recieved updates sign up form values
    if (isShopping) {
      await auth
        .createUserWithEmailAndPassword(
          signUpFormValues.username.value,
          signUpFormValues.password.value
        )
        .then((userCredential) => {
          if (userCredential.user.uid) {
            db.collection("ShoppingUsers").doc(userCredential.user.uid).set({
              username: signUpFormValues.username.value,
              firstname: signUpFormValues.firstname.value,
              lastname: signUpFormValues.lastname.value,
              cart: [],
              cartTotalAmount: 0,
              orders: [],
              address: "",
              city: "",
              state: "",
              postcode: "",
              country: "",
              contact: "",
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
          }
          /* Reset Sign up Form Values */
          setSignUpFormValues(INITIAL_SIGN_UP_STATE);

          history.push("/home");
        })
        .catch((error) => alert(error.message));
    } else {
      await auth
        .createUserWithEmailAndPassword(
          signUpFormValues.username.value,
          signUpFormValues.password.value
        )
        .then((userCredential) => {
          if (userCredential.user.uid) {
            db.collection("BusinessUsers").doc(userCredential.user.uid).set({
              username: signUpFormValues.username.value,
              firstname: signUpFormValues.firstname.value,
              lastname: signUpFormValues.lastname.value,
              myproducts: [],
              totalproductssold: 0,
              address: "",
              city: "",
              state: "",
              postcode: "",
              country: "",
              contact: "",
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
          }
          /* Reset Sign up Form Values */
          setSignUpFormValues(INITIAL_SIGN_UP_STATE);
          history.push("/dashboard");
        })
        .catch((error) => alert(error.message));
    }
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    let error = true;
    value !== "" ? (error = false) : (error = true);
    setSignInFormValues({
      ...signInFormValues,
      [name]: {
        ...signInFormValues[name],
        value,
        error,
      },
    });
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();

    const formFields = Object.keys(signInFormValues);
    let newFormValues = { ...signInFormValues }; // new State Values

    formFields.map((formField) => {
      const currentField = formField;
      const currentValue = signInFormValues[currentField].value;

      if (currentValue === "") {
        newFormValues = {
          ...newFormValues,
          [currentField]: {
            ...newFormValues[currentField],
            error: true,
          },
        };
      }
    });

    setSignInFormValues(newFormValues);
    let formValidate = Object.values(newFormValues).every(
      (element) => element.error === false
    );

    if (formValidate) {
      submitSignInForm(isShopping);
    }
  };

  const submitSignInForm = async (isShopping) => {
    if (isShopping) {
      auth
        .signInWithEmailAndPassword(
          signInFormValues.username.value,
          signInFormValues.password.value
        )
        .then((userCredential) => {
          db.collection("ShoppingUsers")
            .doc(userCredential.user?.uid)
            .get()
            .then((response) => {
              if (response.data() === undefined) {
                alert(
                  "Account does not exist for shopping! Please Sign Up with different email address"
                );
                history.push("/");
              } else {
                /* reset sign In Form Values */
                setSignInFormValues(INITIAL_SIGN_IN_STATE);
                history.push("/home");
              }
            });
        })
        .catch((error) => alert(error.message));
    } else {
      auth
        .signInWithEmailAndPassword(
          signInFormValues.username.value,
          signInFormValues.password.value
        )
        .then((userCredential) => {
          /*let user = userCredential.user;
                    let name = user.email.substr(0,user.email.indexOf('@'));
                    localStorage.setItem('username',name);*/
          db.collection("BusinessUsers")
            .doc(userCredential.user?.uid)
            .get()
            .then((response) => {
              if (response.data() === undefined) {
                alert(
                  "Account does not exist for bussiness! Please Sign Up with different email address"
                );
                history.push("/");
              } else {
                /* reset sign In Form Values */
                setSignInFormValues(INITIAL_SIGN_IN_STATE);
                history.push("/dashboard");
              }
            });
        })
        .catch((error) => alert(error.message));
    }
  };

  /*const handleSocialMediaLogin = (auth1) => {
            auth.signInWithPopup(auth1).then((result) => {
                /*let name = result.user.email.substr(0,result.user.email.indexOf('@'));
                localStorage.setItem('username',name);
                fetchUsername(name);*/
  /*history.push('/home');
            }).catch((error) => {
                console.log(error.message);
              });
        }*/
  return (
    <div className="login-page">
      <div className="triangle"></div>

      <div className="card">
        <div className="card-head">
          <h3 className="card-header">Productly</h3>
          <div className="card-head-tab">
            <button
              className={`tab-business ${!isShopping ? "active" : ""}`}
              onClick={() => setIsShopping(false)}
            >
              For busines
            </button>
            <button
              className={`tab-shopping ${isShopping ? "active" : ""}`}
              onClick={() => setIsShopping(true)}
            >
              For Shopping
            </button>
          </div>
        </div>
        {isSigningIn && (
          <div className="card-body">
            <form
              onSubmit={handleSignInSubmit}
              onChange={handleSignInChange}
              noValidate
              className="sign-in-form"
              autoComplete="on"
            >
              <TextField
                required
                id="signInUsername"
                label="username"
                name="username"
                variant="outlined"
                placeholder="user123@example.com"
                error={signInFormValues.username.error}
                helperText={
                  signInFormValues.username.error &&
                  signInFormValues.username.errorMessage
                }
              />

              <TextField
                required
                id="signInPassword"
                label="Password"
                name="password"
                variant="outlined"
                type="password"
                error={signInFormValues.password.error}
                helperText={
                  signInFormValues.password.error &&
                  signInFormValues.password.errorMessage
                }
              />

              <a
                href="/forgotpassword"
                onClick={() => userIsShopping(isShopping)}
                className="forgot-password"
              >
                Forgot Password?
              </a>

              <Button type="submit" className="btn solid">
                login
              </Button>
            </form>
            <p className="signup-text">
              Don't have an account?{" "}
              <button
                className="register-btn"
                onClick={() => setIsSigningIn(false)}
              >
                Register
              </button>
            </p>
          </div>
        )}
        {!isSigningIn && (
          <div className="card-body">
            <form
              onChange={handleSignUpChange}
              onSubmit={handleSignUpSubmit}
              noValidate
              className="sign-up-form"
              autoComplete="on"
            >
              <FormGroup>
                <TextField
                  required
                  id="firstname"
                  label="First name"
                  name="firstname"
                  variant="outlined"
                  error={signUpFormValues.firstname.error}
                  helperText={
                    signUpFormValues.firstname.error &&
                    signUpFormValues.firstname.errorMessage
                  }
                  placeholder="First name"
                />
                <TextField
                  required
                  id="lastname"
                  label="Last name"
                  name="lastname"
                  variant="outlined"
                  error={signUpFormValues.lastname.error}
                  helperText={
                    signUpFormValues.lastname.error &&
                    signUpFormValues.lastname.errorMessage
                  }
                  placeholder="Last name"
                />
              </FormGroup>
              <TextField
                required
                id="signInUsername"
                label="username"
                name="username"
                variant="outlined"
                placeholder="user123@example.com"
                error={signUpFormValues.username.error}
                helperText={
                  signUpFormValues.username.error &&
                  signUpFormValues.username.errorMessage
                }
              />

              <TextField
                required
                id="signInPassword"
                label="Password"
                name="password"
                variant="outlined"
                type="password"
                error={signUpFormValues.password.error}
                helperText={
                  signUpFormValues.password.error &&
                  signUpFormValues.password.errorMessage
                }
              />

              <Button variant="outlined" type="submit" className="btn solid">
                Sign up
              </Button>
            </form>
            <p className="signup-text">
              Already have an account?{" "}
              <button
                className="register-btn"
                onClick={() => setIsSigningIn(true)}
              >
                Sign In
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect(null, { userIsShopping })(Login);
/*import React, { useState} from 'react'
import EmailIcon from '@material-ui/icons/Email';
import FacebookIcon from '@material-ui/icons/Facebook';
import AppleIcon from '@material-ui/icons/Apple';
import './login.css';
import SignUp from '../../assets/undraw_shopping_eii3.png'
import LoginPicture from '../../assets/undraw_web_shopping_re_owap.png';
import { appleAuth, facebookAuth, googleAuth, auth } from '../../firebase/firebase';
import {fetchUsername} from '../../store/actions'
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Login({fetchUsername}) {
    const[username, setUsername] = useState('');
    const[userPassword, setUserPassword]  = useState('');

    const [containerClass, setContainerClass] = useState(false); //css 

    
    
    const history = useHistory();

    const handleSignup = (e) => {
        e.preventDefault();
        auth.createUserWithEmailAndPassword(username,userPassword).then((userCredential) => {
            /*if(userCredential){
                let user = userCredential.user;
                let name = user.email.substr(0,user.email.indexOf('@'));
                localStorage.setItem('username',name);
                fetchUsername(name);
        }*/
/*setUsername("");
            setUserPassword('');
            history.push('/home');
        }).catch(error => alert(error.message));
    }

    const handleLogin = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(username, userPassword).then(userCredential => {
            /*let user = userCredential.user;
            let name = user.email.substr(0,user.email.indexOf('@'));
            localStorage.setItem('username',name);*/
/*setUsername("");
            setUserPassword('');
            //fetchUsername(name);
            history.push('/home');
        }).catch(error => alert(error.message));
    }

    const handleSocialMediaLogin = (auth1) => {
        auth.signInWithPopup(auth1).then((result) => {
            /*let name = result.user.email.substr(0,result.user.email.indexOf('@'));
            localStorage.setItem('username',name);
            fetchUsername(name);*/
/*history.push('/home');
        }).catch((error) => {
            console.log(error.message);
          });
    }
    return (
        <div className={`container ${containerClass ? 'sign-up-mode' : ''}`}>
            <div className="forms-container">
                <div className="signin-signup">
                    <form className="sign-in-form">
                        <h2 className="title">Sign in</h2>
                        <div className="input-field">
                            <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" placeholder="Username123@example.com"/>
                        </div>
                        <div className="input-field">
                            <input value={userPassword} onChange={e  => setUserPassword(e.target.value)}  type="password" placeholder="password"/> {/**start from here.. 
                        </div>
                        <input onClick={e => handleLogin(e)} type="submit" value="login" className="btn solid"/>
                        <p className="social-text">Or Sign in with social platform</p>
                        <div className="social-media">
                                <a className="social-icon" href="#" >
                                <FacebookIcon onClick={() => handleSocialMediaLogin(facebookAuth)} /></a>
                            <a className="social-icon" href="#"><EmailIcon onClick={() => handleSocialMediaLogin(googleAuth)} /></a>
                            <a className="social-icon" href="#" ><AppleIcon onClick={() => handleSocialMediaLogin(appleAuth)} /></a>
                        </div>
                    </form>


                    <form className="sign-up-form">
                        <h2 className="title">Sign up</h2>
                        <div className="input-field">
                            <input value={username} onChange={e  => setUsername(e.target.value)} type="text" placeholder="Username123@example.com"/>
                        </div>
                        <div className="input-field">
                            <input value={userPassword} onChange={e  => setUserPassword(e.target.value)} type="password" placeholder="password"/>
                        </div>
                        <input onClick={e => handleSignup(e)} type="submit" value="Sign up" className="btn solid"/>
                        <p className="social-text">Or Sign Up with social platform</p>
                        <div className="social-media">
                            <a href="#" className="social-icon">
                                <FacebookIcon onClick={() => handleSocialMediaLogin(facebookAuth)}/>
                            </a>
                            <a href="#" className="social-icon">
                                <EmailIcon onClick={() => handleSocialMediaLogin(googleAuth)}/>
                            </a>
                            <a href="#" className="social-icon">
                                <AppleIcon onClick={() => handleSocialMediaLogin(appleAuth)}/>
                            </a>
                        </div>
                    </form>
                </div>
            </div>


            <div className="panels-container">
                <div className="pannel left-panel">
                    <div className="content">
                        <h3>New here?</h3>
                        <p>Make an account to shop the finest product you will ever found on the interent</p>
                        <button onClick={() => setContainerClass(true)} className="btn transparent" id="sign-up-btn">Sign up</button>
                    </div>

                    <img src={SignUp} className="image" alt=""/>
                </div>

                <div className="pannel right-panel">
                    <div className="content">
                        <h3>One of us?</h3>
                        <p>Sign In to shop the latest product based in the best price on the online market.</p>
                        <button onClick={() => setContainerClass(false)} className="btn transparent" id="sign-up-btn">Sign in</button>
                    </div>

                    <img src={LoginPicture} className="image" alt=""/>
                </div>                
            </div>
        </div>}
    )
}

export default connect(null, {fetchUsername})(Login)*/
