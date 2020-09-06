import React, { Component } from "react";
import "../../assets/css/ContestPage.css";
import Lottie from "react-lottie";
import LoadingAnimation from "../../assets/css/loading.json";
import firebase from "../Firebase";
import { Redirect } from "react-router-dom";
import {
  ROOM_STATUS_IN_PROGRESS,
  ROOM_STATUS_FINISHED,
  QUESTION_NOT_ATTEMPTED,
} from "../Utils/constants";

export default class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUser1: false,
      opponent: "",
      opponentUsername: "",
    };
    this.goBack = this.goBack.bind(this);
    this.roomRef = firebase
      .firestore()
      .collection("rooms")
      .doc(props.match.params.roomid);

    this.roomRef.get().then((doc) => {
      if (!doc.exists) {
        this.props.history.push("/");
      } else {
        const data = doc.data();
        const curUser = firebase.auth().currentUser;
        const isUser1 = data.user1 === curUser.uid;
        this.state = {
          isUser1: isUser1,
          opponent: isUser1 ? data.user2 : data.user1,
        };
      }
    });
  }

  componentDidMount() {
    const db = firebase.firestore();
    const curUser = firebase.auth().currentUser;
    if (!curUser) {
      this.props.history.push("/login");
    } else {
      // check unauthorized room
      db.doc(`users/${curUser.uid}`)
        .get()
        .then((doc) => {
          if (!doc.exists || doc.data().room !== this.props.match.params.roomid)
            this.props.history.push("/");
          return doc.data();
        })
        .then((udata) => {
          console.log(udata);
          // check different room status
          db.collection("rooms")
            .doc(this.props.match.params.roomid)
            .get()
            .then((doc) => {
              if (!doc.exists) {
                this.props.history.push("/");
              } else if (doc.data().status === ROOM_STATUS_IN_PROGRESS) {
                this.props.history.push(
                  `/contest/${this.props.match.params.roomid}/${this.props.match.params.userid}`
                );
              } else if (doc.data().status === ROOM_STATUS_FINISHED) {
                this.props.history.push("/");
              }
            });
        });
    }

    this.roomListener = this.roomRef.onSnapshot((snapshot) => {
      const data = snapshot.data();

      console.log(data);

      if (!data) {
        this.props.history.push("/");
      } else {
        const isUser1 = data.user1 === curUser.uid;
        const opponent = isUser1 ? data.user2 : data.user1;

        let opponentUsername = "";
        (opponent !== this.state.opponent && opponent !== ""
          ? db
              .doc(`users/${opponent}`)
              .get()
              .then((doc) => (opponentUsername = doc.data().username))
          : Promise.resolve()
        ).then(() => {
          this.setState({
            isUser1: isUser1,
            opponent: opponent,
            opponentUsername: opponentUsername,
          });

          if (data.user1 === "") {
            this.handleQuitRoom();
          }

          if (data.status === ROOM_STATUS_IN_PROGRESS) {
            this.props.history.push(
              `/contest/${this.props.match.params.roomid}/${this.props.match.params.userid}`
            );
          }
        });
      }
    });
  }

  handleQuitRoom() {
    this.roomRef.get().then((doc) => {
      const db = firebase.firestore();
      const data = doc.data();
      const curUser = firebase.auth().currentUser;

      let batch = db.batch();
      if (curUser.uid === data.user1) {
        // if user1 quit, abort the room
        batch.update(this.roomRef, {
          status: ROOM_STATUS_FINISHED,
          user1: "",
          user1name: "",
        });

        batch.update(db.doc(`users/${data.user1}`), {
          room: "",
        });
      }

      if (data.user2 !== "") {
        batch.update(this.roomRef, {
          user2: "",
        });
        batch.update(db.doc(`users/${data.user2}`), {
          room: "",
        });
      }

      batch.commit().then(() => {
        this.props.history.push("/");
      });
    });
  }

  handleMatchStart() {
    // redirect to code workspace
    if (this.state.isUser1) {
      this.roomRef
        .get()
        .then((doc) => {
          const data = doc.data();
          console.log(data);
          var batch = firebase.firestore().batch();

          data.questions.map((qid, i) => {
            batch.set(this.roomRef.collection(data.user1).doc(qid), {
              lastSubmittedAt: firebase.firestore.FieldValue.serverTimestamp(),
              status: QUESTION_NOT_ATTEMPTED,
              qtitle: data.qtitles[i],
            });
            batch.set(this.roomRef.collection(data.user2).doc(qid), {
              lastSubmittedAt: firebase.firestore.FieldValue.serverTimestamp(),
              status: QUESTION_NOT_ATTEMPTED,
              qtitle: data.qtitles[i],
            });
          });
          batch.update(this.roomRef, {
            status: ROOM_STATUS_IN_PROGRESS,
            roomStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
            user2name: this.state.opponentUsername,
          });
          batch.commit();
        })
        .catch((error) => console.error(error));
    }
  }

  componentWillUnmount() {
    this.roomListener();
  }

  goBack() {
    this.handleQuitRoom();
    this.props.history.push(`/`);
  }

  waitingForOpponent() {
    return (
      <React.Fragment>
        <h4 className="h4_waiting">Looking for coders...</h4>
        <h4 className="h4_waiting mt-5">
          Share this room ID with your opponent:
        </h4>
        <h3 className="mt-3">{this.props.match.params.roomid}</h3>
      </React.Fragment>
    );
  }

  opponentFound() {
    const joinButton = (
      <div className="waitingRoom_joinButton_wrapper">
        <button
          className="waitingRoom_joinButton"
          onClick={() => this.handleMatchStart()}
        >
          Begin
        </button>
      </div>
    );

    const waitStart = (
      <div className="waitingRoom_joinButton_wrapper">
        <p>
          <strong>Waiting for the host to start the contest.</strong>
        </p>
      </div>
    );

    return (
      <React.Fragment>
        <h4 className="h4_waiting">
          Opponent Found: @{this.state.opponentUsername}
        </h4>
        {this.state.isUser1 ? joinButton : waitStart}
      </React.Fragment>
    );
  }

  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: JSON.parse(JSON.stringify(LoadingAnimation)),
      rendererSettings: {
        preserveAspectRatio: "xMinYMin slice", // Supports the same options as the svg element's preserveAspectRatio property
      },
    };
    const curUser = firebase.auth().currentUser;
    if (!curUser || curUser.uid !== this.props.match.params.userid) {
      return <Redirect to="/" />;
    }

    return (
      <div className="background">
        <button
          className="button btn-outline-dark back_button"
          onClick={this.goBack}
        >
          Cancel
        </button>
        <Lottie
          isClickToPauseDisabled={true}
          options={defaultOptions}
          height={300}
          width={300}
          style={{ position: "relative", top: "110px" }}
        />
        {this.state.opponent !== ""
          ? this.opponentFound()
          : this.waitingForOpponent()}
      </div>
    );
  }
}
