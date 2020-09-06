import React, { Component } from "react";
import firebase from "../Firebase";
import profile_image from "../../assets/img/profile.png";

export default class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: firebase.auth().currentUser ? true : false,
    };
  }

  handleSignin() {
    this.props.history.push("/login");
  }

  handleSignOut() {
    firebase
      .auth()
      .signOut()
      .then(
        () => {
          this.setState({
            loggedIn: false,
          });
        },
        (error) => {
          console.error("Sign Out Error", error);
        }
      );
  }

  render() {
    const user = firebase.auth().currentUser;
    const loggedIn = this.state.loggedIn ? (
      <div className="user-container">
        <div className="username-container">
          <span>@{user.displayName}</span>
        </div>

        <img
          src={profile_image}
          className="signIn_profile"
          alt="profile_image"
        />
        <button
          className="button outline-primary signin_button mr-2"
          onClick={this.handleSignOut.bind(this)}
        >
          Sign out
        </button>
      </div>
    ) : (
      <button
        className="button outline-primary signin_button"
        onClick={() => this.handleSignin()}
      >
        Sign In/Up
      </button>
    );

    return loggedIn;
  }
}
