import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/ContestPage.css";
import firebase from "../Firebase";
import ListGroup from "react-bootstrap/ListGroup";
import {
  ROOM_STATUS_FINISHED,
  QUESTION_ACCEPTED,
  QUESTION_WRONG_ANSWER,
} from "../Utils/constants";

export default class FinishRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: {
        AC: "#2C82C9",
        WA: "#FC6042",
        NA: "#C0C0C0",
      },
      fetched: false,
      user1Msg: "DRAW",
      user2Msg: "DRAW",
    };
  }

  componentDidMount() {
    const db = firebase.firestore();
    const curUser = firebase.auth().currentUser;

    if (!curUser || !this.props.match) {
      this.props.history.push("/");
      return;
    }
    const { roomid } = this.props.match.params;

    let fetched = {};
    let contestRef = db.doc(`rooms/${roomid}`);
    contestRef
      .get()
      .then((doc) => {
        fetched = doc.data();
        if (
          fetched.status !== ROOM_STATUS_FINISHED ||
          fetched.user1 !== curUser.uid ||
          fetched.user2 !== curUser.uid
        ) {
          this.props.history.push("/");
          return;
        }
        fetched.user1Details = {};
        fetched.user2Details = {};
      })
      .then(() => {
        contestRef
          .collection(fetched.user1)
          .get()
          .then((data) => {
            data.docs.forEach((doc) => {
              fetched.user1Details[doc.id] = doc.data();
            });
          });
      })
      .then(() => {
        contestRef
          .collection(fetched.user2)
          .get()
          .then((data) => {
            data.docs.forEach((doc) => {
              fetched.user2Details[doc.id] = doc.data();
            });
          })
          .then(() => {
            let user1Result = [];
            let user2Result = [];

            fetched.questions.forEach((qid) => {
              user1Result.push(fetched.user1Details[qid]);
              user2Result.push(fetched.user2Details[qid]);
            });

            this.setState({
              fetched: true,
              user1Result: user1Result,
              user2Result: user2Result,
              user1name: fetched.user1name,
              user2name: fetched.user2name,
              roomStartedAt: fetched.roomStartedAt,
            });
          })
          .then(() => {
            this.evaluateWin();
          });
      })
      .catch((error) => console.error(error));
  }

  evaluateWin() {
    const { user1Result, user2Result, roomStartedAt } = this.state;
    if (!roomStartedAt) {
      return;
    }
    let u1AC = 0,
      u1WA = 0,
      u1Latest = 0,
      u2AC = 0,
      u2WA = 0,
      u2Latest = 0;

    user1Result.map((entry) => {
      console.log(entry);
      if (entry.status === QUESTION_ACCEPTED) {
        u1AC++;
      } else if (entry.status === QUESTION_WRONG_ANSWER) {
        u1WA++;
      }
      let diff = entry.lastSubmittedAt - roomStartedAt;
      u1Latest = u1Latest > diff ? u1Latest : diff;
    });

    user2Result.map((entry) => {
      if (entry.status === QUESTION_ACCEPTED) {
        u2AC++;
      } else if (entry.status === QUESTION_WRONG_ANSWER) {
        u2WA++;
      }
      let diff = entry.lastSubmittedAt - roomStartedAt;
      u2Latest = u2Latest > diff ? u2Latest : diff;
    });

    let draw = false,
      u1win = false;
    if (u1AC > u2AC) u1win = true;
    else if (u1AC < u2AC) u1win = false;
    else if (u1WA < u2WA) u1win = true;
    else if (u1WA > u2WA) u1win = false;
    else if (u1Latest < u2Latest) u1win = true;
    else if (u1Latest > u2Latest) u1win = false;
    else draw = true;

    if (draw) {
      this.setState({ user1Msg: "DRAW", user2Msg: "DRAW" });
    } else if (u1win) {
      this.setState({ user1Msg: "WIN", user2Msg: "LOSE" });
    } else {
      this.setState({ user1Msg: "LOSE", user2Msg: "WIN" });
    }
  }

  renderUser1Result() {
    const {
      roomStartedAt,
      user1name,
      user1Result,
      user1Msg,
      color,
    } = this.state;

    if (!user1Result) {
      return;
    }

    return (
      <div className="result-sub-container">
        <h3>@{user1name}</h3>
        <ListGroup>
          {user1Result.map((entry, idx) => {
            return (
              <ListGroup.Item key={idx}>
                <div className="result-item">
                  <span className="result-item-qtitle">{entry.qtitle}</span>
                  <span className="result-item-lastsubmit">
                    {new Date((entry.lastSubmittedAt - roomStartedAt) * 1000)
                      .toISOString()
                      .substr(11, 8)}
                  </span>
                  <span style={{ color: color[entry.status] }}>
                    {entry.status}
                  </span>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
        <h5 className="result-win-lose">{user1Msg}</h5>
      </div>
    );
  }

  renderUser2Result() {
    const {
      roomStartedAt,
      user2name,
      user2Result,
      user2Msg,
      color,
    } = this.state;

    if (!user2Result) {
      return;
    }
    return (
      <div className="result-sub-container">
        <h3>@{user2name}</h3>
        <ListGroup>
          {user2Result.map((entry, idx) => {
            return (
              <ListGroup.Item key={idx}>
                <div className="result-item">
                  <span className="result-item-qtitle">{entry.qtitle}</span>
                  <span className="result-item-lastsubmit">
                    {new Date((entry.lastSubmittedAt - roomStartedAt) * 1000)
                      .toISOString()
                      .substr(11, 8)}
                  </span>
                  <span
                    style={{ color: color[entry.status] }}
                    className="result-item-status"
                  >
                    {entry.status}
                  </span>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
        <h5 className="result-win-lose">{user2Msg}</h5>
      </div>
    );
  }

  render() {
    if (!this.state.fetched) {
      return (
        <div className="background">
          <h1>Loading...</h1>
        </div>
      );
    }

    return (
      <div className="background">
        <h1>Match finished!</h1>

        <div className="result-container">
          {this.renderUser1Result()}
          {this.renderUser2Result()}
        </div>

        <Link to="/">
          <div className="result-return-button-container">
            <button className="button result-return-button">
              Return to Main Page
            </button>
          </div>
        </Link>
      </div>
    );
  }
}
