import React, { Component } from "react";
import "../../assets/css/LandingPage.css";
import logo from "../../assets/img/logo_name.png";
import { Link } from "react-router-dom";
import SignInForm from "./SignInForm.js";
import Lottie from "react-lottie";
import LandingPageAnimation from "../../assets/css/LandingPageAnimation.json";
import firebase from "../Firebase";

//import handleSignup from "../Firebase/users/signup";

export default class LandingPage extends Component {
  render() {
    const defaultLottieOptions = {
      loop: true,
      autoplay: true,
      animationData: JSON.parse(JSON.stringify(LandingPageAnimation)),
      rendererSettings: {
        preserveAspectRatio: "xMinYMin slice", // Supports the same options as the svg element's preserveAspectRatio property
      },
    };

    return (
      <div className="background">
        <div className="logo_section">
          <Link to="/">
            <img src={logo} className="logo" alt="Logo" />
          </Link>
        </div>
        <div className="signin_section">
          <SignInForm history={this.props.history}/>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            margin: 0,
          }}
        >
          <div>
            <Lottie
              isClickToPauseDisabled={true}
              options={defaultLottieOptions}
              height={250}
              width={250}
              style={{ position: "relative", top: "-60px" }}
            />
            <div className="contest_wrapper">
              <Link to="/CreateRoom">
                <button
                  type="button"
                  className="btn hover btn-lg border-bottom contestButton"
                >
                  Start a Contest
                </button>
              </Link>
              <Link to="/JoinRoom">
                <button
                  type="button"
                  className="btn hover btn-lg border-bottom mt-4 contestButton"
                >
                  Join a Contest
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
