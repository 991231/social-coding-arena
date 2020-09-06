import React, { Component } from "react";
import "../../assets/css/JoinRoomPage.css";
import Card from "react-bootstrap/Card";
import profile_image from "../../assets/img/profile.png";
import firebase from "../Firebase";

export default class LobbyRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleJoinRoom(roomid) {
    // handleJoinRoom( "roomid" )

    console.log("Join Room");

    const db = firebase.firestore();
    const curUser = firebase.auth().currentUser;

    if (!roomid && roomid !== "") {
      return;
    }

    roomid = roomid.trim();

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
            roomRef.update("user2", curUser.uid).then(() => {
              db.doc(`users/${curUser.uid}`).update("room", roomid);
            });
            console.log("JOin Room " + roomid);
            // redirect to waiting room page of roomid
            this.props.history.push(`/WaitingRoom/${roomid}/${curUser.uid}`);
          }
          console.log(this.state);
        })
        .catch((error) => console.error(error));
    }
  }

  render() {
    console.log(this.props.openRooms);
    const cards = this.props.openRooms.map((room, i) => {
      return (
        <Card className="lobbyCard" key={i}>
          <Card.Body>
            <div className="card_mainBody">
              <img
                src={profile_image}
                className="join_profile_image"
                alt="profile_image"
              ></img>
              <Card.Title className="ml-3">{room.user1name}</Card.Title>
            </div>
            <Card.Text>{room.tags}</Card.Text>
            <button
              className="lobby_join_button"
              onClick={() => this.handleJoinRoom(room.roomid)}
            >
              Join
            </button>
          </Card.Body>
        </Card>
      );
    });

    return (
      <div>
        <div className="lobbyRoom">
          <div>
            <div className="card-columns">{cards}</div>
          </div>
        </div>
      </div>
    );
  }
}
