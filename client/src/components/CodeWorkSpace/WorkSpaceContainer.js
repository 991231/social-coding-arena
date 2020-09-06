import React, { Component } from "react";
import SplitPane, { Pane } from "react-split-pane";

import Prompt from "./Prompt.js";
import CodeSection from "./CodeSection.js";
import TestSection from "./TestSection.js";
import OpponentProgress from "./OpponentProgress.js";
import { submitCode, getSubmissionResults } from "../../utils/apiCalls.js";
import "../../assets/css/WorkSpace.css";

export default class WorkSpaceContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeLanguage: "python",
      defaultEditorCode:
        "def isToeplitzMatrix(matrix):\n    #solutions:\n    #return all(r == 0 or c == 0 or matrix[r-1][c-1] == val\n         #for r, row in enumerate(matrix)\n         #for c, val in enumerate(row))",
      editorCode: "",
      title: "",
      prompt:
        "<div> <p> A matrix is <em>Toeplitz</em> if every diagonal from top-left to bottom-right has the same element. </p> <p> Now given an <code>M x N</code> matrix, return&nbsp;<code>True</code>&nbsp;if and only if the matrix is <em>Toeplitz</em>. </p> <strong> Note: </strong> <ol> <li><code>matrix</code> will be a 2D array of integers.</li> <li> <code>matrix</code> will have a number of rows and columns in range <code>[1, 20]</code>. </li> <li> <code>matrix[i][j]</code> will be integers in range <code>[0, 99]</code>. </li> </ol><br /></div>",
      submission_token: "",
      testResults: { placeholder: "12" },
      testCases: [],
      loading: false,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.displayResults = this.displayResults.bind(this);
  }

  componentDidMount() {
    // init editorCode
    this.setState({
      editorCode: this.state.defaultEditorCode,
      prompt: this.props.problem.prompt,
      title: this.props.problem.title,
    });
  }

  // update values in the editor
  onChange(newEditorCode) {
    console.log(newEditorCode.toString());
    this.setState({
      editorCode: newEditorCode,
    });
  }

  // handleClick on the submit button
  handleSubmitClick(e) {
    e.preventDefault();
    console.log("Code is submitted");

    const codeInfo = {
      language_id: this.state.codeLanguage,
      source_code: this.state.editorCode,
    };

    // submit code for testcases
    this.setState({ loading: true }, () => {
      submitCode(
        codeInfo,
        (res) => {
          // get the testcases results
          console.log(res);
          getSubmissionResults(
            { submission_token: res.token },
            (res) => {
              console.log(res);
              this.setState({
                testResults: res,
                loading: false,
              });
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  // display resuklts in the test section
  displayResults(testResults) {
    if (testResults.stdout) {
      const passedResults = testResults.stdout;
      var numTestPassed = 0;
      const testCaseResults = passedResults.trim().split("\n");
      console.log(testCaseResults);
      const totalTestResults = testCaseResults.length;
      for (var result of testCaseResults) {
        if (result === "True") {
          numTestPassed++;
        }
      }
      if (numTestPassed !== totalTestResults) {
        return (
          <h6 className="failedResults">{`${numTestPassed} / ${totalTestResults} Test Passed`}</h6>
        );
      } else {
        return <h6 className="passedResults">All Test Passed</h6>;
      }
    } else if (testResults.stderr) {
      return <h6 className="failedResults">{testResults.stderr}</h6>;
    } else if (!testResults) {
      return (
        <h6 className="failedResults">
          API Failed, Please Submit Again.{"\n"} We're currently optimizing it
          ^_^{" "}
        </h6>
      );
    } else {
      console.log(testResults);
      return;
    }
  }

  render() {
    return (
      <div className="workspace-wrapper">
        <SplitPane
          split="vertical"
          minSize={300}
          maxSize={500}
          defaultSize={340}
        >
          <SplitPane
            split="horizontal"
            minSize={200}
            maxSize={700}
            defaultSize={520}
          >
            <Pane>
              <div className="Pane LeftSection_CodeWorkspace">
                <Prompt prompt={this.state.prompt} />
              </div>
            </Pane>
            <Pane>
              <div className="Pane LeftSection_CodeWorkspace">
                <OpponentProgress roomid={this.props.roomid} />
              </div>
            </Pane>
          </SplitPane>

          <SplitPane
            split="horizontal"
            minSize={200}
            maxSize={700}
            defaultSize={520}
          >
            <Pane>
              <div className="Pane">
                <CodeSection
                  defaultEditorCode={this.state.defaultEditorCode}
                  language={this.state.codeLanguage}
                  onChange={this.onChange}
                />
              </div>
            </Pane>
            <Pane>
              <TestSection
                displayResults={this.displayResults}
                handleSubmitClick={this.handleSubmitClick}
                testResults={this.state.testResults}
                loading={this.state.loading}
              />
            </Pane>
          </SplitPane>
        </SplitPane>
      </div>
    );
  }
}
