import React, { Component } from "react";
import "../../assets/css/LandingPage.css";
import firebase from "../Firebase";
import { validateSignup, validateSignin } from "../Firebase/users/validators";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import logo from "../../assets/img/logo_name.png";
import profile_image from "../../assets/img/profile.png";

export default class SignInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignin: true,
      loading: false,
      signupError: false,
      signupErrorMsg: null,
    };

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        props.history.push("/");
      } else {
        // No user is signed in.
      }
    });
  }

  switchInput() {
    const isSignin = this.state.isSignin;
    this.setState({
      isSignin: !isSignin,
      signupError: false,
      signupErrorMsg: null,
      signinError: false,
      signinErrorMsg: null,
    });
  }

  handleSignup(event) {
    event.preventDefault();
    event.persist();

    const procInput = {
      username: event.target[1].value.trim().toLowerCase(),
      email: event.target[0].value.trim(),
      password: event.target[2].value.trim(),
    };
    const valResult = validateSignup(procInput);
    if (!valResult.valid) {
      this.setState({
        signupError: true,
        signupErrorMsg: valResult.errors.msg,
      });
    } else {
      const db = firebase.firestore();
      db.collection("users")
        .where("username", "==", procInput.username)
        .limit(1)
        .get()
        .then((data) => {
          if (!data.empty) {
            this.setState({
              signupError: true,
              signupErrorMsg: "This username is already taken.",
            });
          } else {
            // create user
            firebase
              .auth()
              .createUserWithEmailAndPassword(
                procInput.email,
                procInput.password
              )
              .then((data) => {
                // set username to firebase user profile
                data.user
                  .updateProfile({
                    displayName: procInput.username,
                  })
                  .then(() => {
                    // store user info
                    const newUserInfo = {
                      username: procInput.username,
                      email: procInput.email,
                      dateJoined: firebase.firestore.FieldValue.serverTimestamp(),
                      room: "",
                    };
                    return db.doc(`/users/${data.user.uid}`).set(newUserInfo);
                  });
              })
              .then(() => {
                this.setState({
                  signupError: false,
                  signupErrorMsg: null,
                });
                this.props.history.push("/");
              })
              .catch((error) => {
                console.log("Sign up Error: " + error);
                if (error.code === "auth/email-already-in-use") {
                  this.setState({
                    signupError: true,
                    signupErrorMsg: "This email is already in use.",
                  });
                } else {
                  this.setState({
                    signupError: true,
                    signupErrorMsg: error.message,
                  });
                }
              });
          }
        });
    }
  }

  renderSignup() {
    return (
      <div className="signin-page-input">
        <Form onSubmit={this.handleSignup.bind(this)}>
          <Form.Group controlId="formSignupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formSignupUsername">
            <Form.Label>Username</Form.Label>

            <Form.Control type="text" placeholder="Enter username" />
            <Form.Text className="text-muted">
              At least 3 numbers or lowercase letters.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formSignupPassword">
            <Form.Label>Password</Form.Label>

            <Form.Control type="password" placeholder="Enter password" />
            <Form.Text className="text-muted">
              At least 6 numbers, letters or special characters.
            </Form.Text>
          </Form.Group>
          <div className="signin-page-submit-container">
            <Button variant="success" type="submit">
              Submit
            </Button>
            <p className="signin-page-error-msg">
              {this.state.signupError ? this.state.signupErrorMsg : ""}
            </p>
          </div>
        </Form>
        <br />
        <div className="center-text-box">
          <p>
            Already have an account? &nbsp;
            <Button variant="info" onClick={() => this.switchInput()}>
              Sign in
            </Button>
          </p>
        </div>
      </div>
    );
  }

  handleSignin(event) {
    event.preventDefault();
    event.persist();

    const procInput = {
      email: event.target[0].value.trim(),
      password: event.target[1].value.trim(),
    };

    const valResult = validateSignin(procInput);
    if (!valResult.valid) {
      this.setState({
        signinError: true,
        signinErrorMsg: valResult.errors.msg,
      });
    }

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        return firebase
          .auth()
          .signInWithEmailAndPassword(procInput.email, procInput.password);
      })
      .then(() => {
        this.setState({
          signinError: false,
          signinErrorMsg: null,
        });
      })
      .catch((error) => {
        if (
          error.code === "auth/user-not-user" ||
          error.code === "auth/user-not-found"
        ) {
          this.setState({
            signinError: true,
            signinErrorMsg: "User cannot be identified.",
          });
        } else if (error.code === "auth/wrong-password") {
          this.setState({
            signinError: true,
            signinErrorMsg: "Password is incorrect.",
          });
        } else {
          this.setState({
            signinError: true,
            signinErrorMsg: error.message,
          });
        }
      });
  }

  renderSignin() {
    return (
      <div className="signin-page-input">
        <Form onSubmit={this.handleSignin.bind(this)}>
          <Form.Group controlId="formSigninEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formSigninPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <div className="signin-page-submit-container">
            <Button variant="success" type="submit">
              Submit
            </Button>
            <p className="signin-page-error-msg">
              {this.state.signinError ? this.state.signinErrorMsg : ""}
            </p>
          </div>
        </Form>
        <br />
        <div className="center-text-box">
          <p>
            Don't have an account? &nbsp;
            <Button variant="info" onClick={() => this.switchInput()}>
              Sign up
            </Button>
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="background">
        <div className="signin-page-input-container">
          <div className="signin-page-logo">
            <Link to="/">
              <img src={logo} className="logo" alt="Logo" />
            </Link>
          </div>
          {this.state.isSignin ? this.renderSignin() : this.renderSignup()}
        </div>
      </div>
    );
  }
}
