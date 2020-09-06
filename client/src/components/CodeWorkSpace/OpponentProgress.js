import React, { Component } from "react";

import profile_blue from "../../assets/img/profile_blue.png";
import profile_orange from "../../assets/img/profile_orange.png";
import left_empty from "../../assets/img/left_empty.png";
import left_blue from "../../assets/img/left_blue.png";
import right_empty from "../../assets/img/right_empty.png";
import right_orange from "../../assets/img/right_orange.png";
import firebase from "../Firebase";
import { QUESTION_ACCEPTED } from "../Utils/constants";

export default class OpponentProgress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opponentName: "Opponent",
      selfName: "Me",
      question_numbers: ["Q1", "Q2", "Q3", "Q4"],
      opponentQuestionSets: [],
      selfQuestionSets: [0, 0, 0, 0, 0], //TODO: LOCAL API,
    };

    this.addListenerToProgress = this.addListenerToProgress.bind(this);
    this.addListenerToProgressFrom = this.addListenerToProgressFrom.bind(this);
    this.handleChangeProgress = this.handleChangeProgress.bind(this);
  }

  componentDidMount() {
    this.addListenerToProgress();
  }

  handleChangeProgress(isOpponent, numberOfCorrected, numberOfQuestions) {
    if (isOpponent) {
      var opponentQuestionSets = new Array(numberOfQuestions).fill(0);
      for (var i = 0; i < numberOfCorrected; i++) {
        opponentQuestionSets[i] = 1;
      }
      this.setState({ opponentQuestionSets: opponentQuestionSets });
    } else {
      var selfQuestionSets = new Array(numberOfQuestions).fill(0);
      for (
        var i = numberOfQuestions - 1;
        i >= numberOfQuestions - numberOfCorrected;
        i--
      ) {
        selfQuestionSets[i] = 1;
      }
      this.setState({ selfQuestionSets: selfQuestionSets });
    }
  }

  addListenerToProgress() {
    const roomid = this.props.roomid;
    const db = firebase.firestore();
    const curUser = firebase.auth().currentUser.uid;
    var opponent = "";

    db.collection("rooms")
      .doc(roomid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const isCreator = curUser === doc.data().user1;
          opponent = isCreator ? doc.data().user2 : doc.data().user1;
          const numberOfQuestions = doc.data().questions.length;
          //this.addListenerToProgressFrom(curUser, false, numberOfQuestions);
          this.addListenerToProgressFrom(opponent, true, numberOfQuestions);
        }
      })
      .catch((err) => {
        console.log("Get Progress Error: " + err);
      });
  }

  addListenerToProgressFrom(user, isOpponent, numberOfQuestions) {
    const roomid = this.props.roomid;
    const db = firebase.firestore();

    db.collection("rooms")
      .doc(roomid)
      .collection(user)
      .onSnapshot((docs) => {
        var numberOfCorrected = 0;
        docs.forEach((doc) => {
          if (doc.data().status === QUESTION_ACCEPTED) {
            numberOfCorrected += 1;
          }
        });
        // Update the Status
        this.handleChangeProgress(
          isOpponent,
          numberOfCorrected,
          numberOfQuestions
        );
      })
      .catch((err) => {
        console.log("Add Progress Listener Failed: " + err);
      });
  }

  render() {
    /* TODO: make an update function outside of render */
    const opponent_Cards = this.state.opponentQuestionSets.map((number, i) => {
      if (number === 1) {
        return <img key={i} src={right_orange} alt="right_orange" />;
      } else {
        return <img key={i} src={right_empty} alt="right_empty" />;
      }
    });

    const me_Cards = this.state.selfQuestionSets.map((number, i) => {
      if (number === 1) {
        return <img key={i} src={left_blue} alt="left_blue" />;
      } else {
        return <img key={i} src={left_empty} alt="left_empty" />;
      }
    });

    return (
      <div className="progress LeftSection_CodeWorkspace">
        <h4 className="progress_h4">Progress</h4>
        <div className="opponentProgress">
          <div className="progress_nameheader">
            <img
              src={profile_orange}
              className="progress_profile"
              alt="opponent_progress"
            />
            <h6>{this.state.opponentName}</h6>
          </div>
          <div className="problemSet_progress">{opponent_Cards}</div>
        </div>
        <div className="selfProgress">
          <div className="progress_nameheader">
            <img
              src={profile_blue}
              className="self_progress_profile"
              alt="self_progress"
            />
            <h6 className="self_progress_name">{this.state.selfName}</h6>
          </div>
          <div className="self_problemSet_progress">{me_Cards}</div>
        </div>
      </div>
    );
  }
}
