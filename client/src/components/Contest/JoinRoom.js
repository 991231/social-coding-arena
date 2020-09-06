import React, { Component } from "react";
import "../../assets/css/JoinRoomPage.css";
import Form from "react-bootstrap/Form";
import firebase from "../Firebase";
import { Redirect } from "react-router-dom";
import LobbyRoom from "./LobbyRoom.js";
import { ROOM_STATUS_PENDING } from "../Utils/constants";

export default class JoinRoom extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);

    this.state = {
      roomId: null,
      openRooms: [],
    };

    this.handleOpenRooms = this.handleOpenRooms.bind(this);
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
    this.populateLobby();
  }

  // Join a room by code
  handleRoomIdChange(event) {
    console.log(event.target.value);
    this.setState({ roomId: event.target.value });
  }

  // Join a room

  roomFound(curUser) {
    if (!curUser) return false;
    let result = "";

    firebase
      .firestore()
      .doc(`users/${curUser.uid}`)
      .get()
      .then((doc) => {
        let idFound = doc.data().room;
        console.log(idFound);
        if (idFound !== "") {
          result = idFound;
        }
      })
      .catch((error) => console.error(error));
    return result;
  }

  handleJoinRoom() {
    // handleJoinRoom( "roomid" )

    console.log("Join Room");

    const db = firebase.firestore();
    const curUser = firebase.auth().currentUser;

    var roomid = this.state.roomId;

    if (!roomid && roomid !== "") {
      return;
    }

    roomid = roomid.trim();

    console.log("Room " + roomid);

    if (!curUser) {
      this.setState({ error: true, msg: "Please login first" });
    } else {
      let roomRef = db.doc(`/rooms/${roomid}`);
      roomRef
        .get()
        .then((doc) => {
          const data = doc.data();
          console.log(data);
          if (!doc.exists || data.status === "finished") {
            // refuse join if room not exist
            this.setState({ error: true, msg: "Invalid Invitation Link" });
          } else if (data.user2 !== "" && data.user2 !== curUser.uid) {
            // refuse join if room is full
            this.setState({ error: true, msg: "Room is full" });
          } else {
            roomRef
              .update("user2", curUser.uid)
              .then(() => {
                db.doc(`users/${curUser.uid}`).update("room", roomid);
              })
              .then(() => {
                // redirect to waiting room page of roomid
                this.props.history.push(
                  `/WaitingRoom/${roomid}/${curUser.uid}`
                );
              });
            console.log("Join Room: " + roomid);
          }

          console.log(this.state);
        })
        .catch((error) => console.error(error));
    }
  }

  handleOpenRooms(rooms) {
    this.setState({ openRooms: rooms });
  }

  populateLobby() {
    const db = firebase.firestore();

    var openRooms = [];

    db.collection("rooms")
      .where("status", "==", ROOM_STATUS_PENDING)
      .limit(20)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          const info = {
            roomid: doc.id,
            user1id: doc.data().user1,
            user1name: doc.data().user1name,
          };
          openRooms.push(info);
        });
        this.handleOpenRooms(openRooms);
      })
      .catch((err) => {
        //console.log("Query Pending Room Err: " + err);
      });
  }

  goBack() {
    this.props.history.goBack();
  }

  renderJoinWithCode() {
    return (
      <div className="joinroom_wrapper">
        <Form className="form mr-4">
          <Form.Control
            placeholder="Enter Room Code"
            onChange={this.handleRoomIdChange.bind(this)}
          />
        </Form>
        <button
          className="join_button"
          onClick={this.handleJoinRoom.bind(this)}
        >
          Join
        </button>
      </div>
    );
  }

  displayLobby() {
    if (this.state.openRooms.length > 0) {
      return <LobbyRoom openRooms={this.state.openRooms} history={this.props.history} />;
    } else {
      return <h3>Not Open Rooms</h3>;
    }
  }

  render() {
    const curUser = firebase.auth().currentUser;
    if (!curUser) {
      return <Redirect to="/login" />;
    }
    return (
      <div className="joinroom_background">
        <button
          className="button btn-outline-dark back_button"
          onClick={this.goBack}
        >
          Back
        </button>
        {this.renderJoinWithCode()}
        {this.displayLobby()}
      </div>
    );
  }
}
