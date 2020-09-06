import React, { Component } from "react";
import firebase from "../Firebase";
import "../../assets/css/ContestPage.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);

    this.state = {
      duration: 60,
      nEasy: 0,
      nMedium: 0,
      total: 0,
      nHard: 0,
      toggleCreate: false,
    };

    this._onSelectEasy = this._onSelectEasy.bind(this);
    this._onSelectMedium = this._onSelectMedium.bind(this);
    this._onSelectHard = this._onSelectHard.bind(this);
    this._onSelectTime = this._onSelectTime.bind(this);
    this.handleCreateRoom = this.handleCreateRoom.bind(this);
  }

  // Update number of questions and duration
  _onSelectEasy(option) {
    this.setState({ nEasy: option.value });
    this.toggleCreate();
  }
  _onSelectMedium(option) {
    this.setState({ nMedium: option.value });
    this.toggleCreate();
  }
  _onSelectHard(option) {
    this.setState({ nHard: option.value });
    this.toggleCreate();
  }
  _onSelectTime(option) {
    this.setState({ duration: option.value });
    this.toggleCreate();
  }

  toggleCreate() {
    const { nEasy, nMedium, nHard } = this.state;
    const total = nEasy + nMedium + nHard;
    this.setState({
      total: total,
      toggleCreate: total >= 2 && total <= 5,
    });
  }

  componentDidMount() {
    const db = firebase.firestore();
    const curUser = firebase.auth().currentUser;
    if (!curUser) {
      this.props.history.push("/login");
    } else {
      db.doc(`users/${curUser.uid}`)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            this.props.history.push("/");
          } else if (doc.data().room !== "")
            this.props.history.push(
              `/WaitingRoom/${doc.data().room}/${curUser.uid}`
            );
        });
    }
  }

  handleCreateRoom() {
    //this.handleCreateRoom({ nEasy: 2, nMedium: 2, nHard: 1, duration: 60 });

    const db = firebase.firestore();

    var input = this.state;

    if (input.total < 1) {
      return;
    }

    console.log("asdas");
    var totalAmounts = {};
    var qids = {};
    var qdocs = [];
    var qtitles = [];
    //var roomid = null;
    db.collection("questions")
      .get()
      .then((data) => {
        // read size of question banks for each category
        data.forEach((doc) => {
          totalAmounts[doc.id] = doc.data().amount;
          qids[doc.id] = [];
        });
      })
      .then(() => {
        // randomly pick question ids
        ["Easy", "Medium", "Hard"].forEach((cat) => {
          const qcat = "questions" + cat;
          const ncat = "n" + cat;
          const totalamt = totalAmounts[qcat];
          while (qids[qcat].length < input[ncat]) {
            var i = Math.floor(Math.random() * totalamt) + 1;
            if (qids[qcat].indexOf(i) === -1) {
              qids[qcat].push(i);
            }
          }
        });
      })
      .then(() => {
        // query corresponding question ids
        ["questionsEasy", "questionsMedium", "questionsHard"].forEach(
          (qcat) => {
            if (qids[qcat].length > 0) {
              db.collection(qcat)
                .where("id", "in", qids[qcat])
                .get()
                .then((data) =>
                  data.forEach((doc) => {
                    qdocs.push(doc.id);
                    qtitles.push(doc.data().title);
                  })
                );
            }
          }
        );
      })
      .then(() => {
        // create room document entry
        const roomDetails = {
          roomCreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          status: "pending",
          questions: qdocs,
          qtitles: qtitles,
          matchDuration: input.duration,
          user1: firebase.auth().currentUser.uid,
          user1name: firebase.auth().currentUser.displayName,
          user2: "",
        };
        return roomDetails;
      })
      // store new room
      .then((roomDetails) => {
        db.collection("rooms")
          .add(roomDetails)
          .then((doc) => {
            doc.update({
              questions: qdocs,
              qtitles: qtitles,
            });
            return doc.id;
          })
          .then((roomid) => {
            const curUser = firebase.auth().currentUser.uid;
            // update room in user record
            db.doc(`users/${curUser}`)
              .update("room", roomid)
              .then(() => {
                // redirect to waiting room
                this.props.history.push(
                  `/WaitingRoom/${roomid}/${firebase.auth().currentUser.uid}`
                );
              });
          });
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  }

  // UI

  goBack() {
    this.props.history.goBack();
  }

  changeColor(id) {
    //var button = document.getElementsByClassName(id);
    console.log(id);
  }

  // TODO: render if not signed in
  renderNotSignedin() {
    return <React.Fragment>Please Sign in First.</React.Fragment>;
  }

  // render if signed in
  renderSettingsForm() {
    const numberOfEasy = [0, 1, 2, 3, 4, 5];
    const numberOfMedium = [0, 1, 2, 3];
    const numberOfHard = [0, 1, 2];
    const times = [30, 45, 60, 75, 90];
    const { nEasy, nMedium, nHard } = this.state;
    const total = nEasy + nMedium + nHard;
    const B = (props) => <strong>{props.children}</strong>;
    return (
      <React.Fragment>
        <button
          className="button btn-outline-dark back_button"
          onClick={this.goBack}
        >
          Back
        </button>

        <div>
          <div className="create_contest_container">
            <h1>Create your Contest</h1>
            <h3>
              Number of Questions: <B>{total}</B>
            </h3>
            <div className="center_text">
              <p>
                You should select <B>2</B> to <B>5</B> questions in total.
              </p>
            </div>

            <div className="label_group">
              <h5>Easy</h5>
              <h5>Medium</h5>
              <h5>Hard</h5>
            </div>
            <div className="button_group">
              <Dropdown
                className="create_Dropdown"
                options={numberOfEasy}
                onChange={this._onSelectEasy}
                value={numberOfEasy[0]}
                placeholder="0"
              />
              <Dropdown
                className="create_Dropdown"
                options={numberOfMedium}
                onChange={this._onSelectMedium}
                value={numberOfMedium[0]}
                placeholder="0"
              />
              <Dropdown
                className="create_Dropdown"
                options={numberOfHard}
                value={numberOfHard[0]}
                onChange={this._onSelectHard}
                placeholder="0"
              />
            </div>
            <h3>Contest Duration (minutes)</h3>
            <div className="time_dropdown">
              <Dropdown
                className="create_Dropdown"
                options={times}
                onChange={this._onSelectTime}
                value={0}
                placeholder="30"
              />
            </div>
            <button
              className="button create_button createBtn_selected createBtn_active"
              disabled={total < 2 || total > 5}
              onClick={this.handleCreateRoom}
            >
              Create
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="background">
        {firebase.auth().currentUser
          ? this.renderSettingsForm()
          : this.renderNotSignedin()}
      </div>
    );
  }
}
