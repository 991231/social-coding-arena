import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";

import firebase from "../Firebase";
import WorkSpaceHeader from "../Header/WorkSpaceHeader.js";
import WorkSpaceContainer from "./WorkSpaceContainer.js";
import "../../assets/css/WorkSpace.css";

export default class EntireWorkspace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomid: "",
      problem_ids: [],
      problems: {},
      curWorkSpaceContainer: {
        key: -9999,
        roomid: -1,
        problem_id: -9999,
        problem: {
          prompt:
            "<div> <p> A matrix is <em>Toeplitz</em> if every diagonal from top-left to bottom-right has the same element. </p> <p> Now given an <code>M x N</code> matrix, return&nbsp;<code>True</code>&nbsp;if and only if the matrix is <em>Toeplitz</em>. </p> <strong> Note: </strong> <ol> <li><code>matrix</code> will be a 2D array of integers.</li> <li> <code>matrix</code> will have a number of rows and columns in range <code>[1, 20]</code>. </li> <li> <code>matrix[i][j]</code> will be integers in range <code>[0, 99]</code>. </li> </ol> <p style={{font-size:12px}}>(Note: when submitting, you might encounter that <code>nothing returns</code>. If so, <code>please submit again</code>. We're currently optimizing the API ^_^</p></div>",
          title: "Toeplitz Matrix",
        },
      },
      loading: true,
    };
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.initWorkSpaceContainer = this.initWorkSpaceContainer.bind(this);
  }
  componentWillMount() {
    this.setState({
      roomid: this.props.match.params.roomid,
    });
    this.getAllQuestion();
  }

  componentDidMount() {
    this.initWorkSpaceContainer();
    this.setState({
      loading: true,
    });
    //console.log(this.state.problems);
  }

  getAllQuestion() {
    const roomid = this.props.match.params.roomid;
    const db = firebase.firestore();

    // retrieve all problems in the room
    db.doc(`rooms/${roomid}`)
      .get()
      .then((doc) => {
        doc.data().questions.forEach((problemID) => {
          db.collection("QuestionDatabase")
            .doc(problemID)
            .get()
            .then((question) => {
              // add every single problem here
              this.setState({
                ...this.state,
                problems: {
                  ...this.state.problems,
                  [problemID]: question.data(),
                },
              });
            })
            .catch(function (error) {
              console.log("Error getting problems:", error);
            });
        });
      })
      .catch((err) => {
        console.log("Retrieve problems failed: " + err);
      });
  }

  initWorkSpaceContainer() {
    this.setState({
      curWorkSpaceContainer: {
        key: this.state.problem_ids[0], //-9999,
        roomid: this.state.roomid,
        problem_id: this.state.problem_ids[0],
        problem: this.state.problems[this.state.problem_ids[0]], //{ prompt: "init prompt", title: "test" },
      },
    });
  }

  // handle question change when selecting values from NavDropDown
  handleQuestionChange(e) {
    const title = "Sort the Matrix Diagonally"; //e.target;
    console.log(title);
    for (const [key, detail] of Object.entries(this.state.problems)) {
      if (detail.title === title) {
        console.log(detail);
        this.setState({
          curWorkSpaceContainer: {
            key: key,
            roomid: this.state.roomid,
            problem_id: key,
            problem: detail,
          },
        });
      }
    }
  }

  render() {
    const problem_id = Object.keys(this.state.problems)[0];

    let workSpaceContainers = [];
    let problemTitles = [];

    for (const [key, value] of Object.entries(this.state.problems)) {
      problemTitles.push(value.title);
      workSpaceContainers.push(
        <WorkSpaceContainer
          key={key}
          roomid={this.state.roomid}
          problem_id={problem_id}
          problem={this.state.problems[problem_id]}
        />
      );
    }
    if (this.state.loading) {
      return (
        <div className="entire-workspace-wrapper">
          <Scrollbars>
            <div className="workspace-header">
              <WorkSpaceHeader
                key={this.state.curWorkSpaceContainer.problem_id}
                problemTitles={problemTitles}
                handleQuestionChange={this.handleQuestionChange}
              />
            </div>
            <WorkSpaceContainer
              roomid={this.state.roomid}
              problem_id={this.state.curWorkSpaceContainer.problem_id}
              problem={this.state.curWorkSpaceContainer.problem}
            />
          </Scrollbars>
        </div>
      );
    }
  }
}
