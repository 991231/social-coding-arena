import React, { Component } from "react";

import "../../assets/css/WorkSpace.css";

export default class TestSection extends Component {
  render() {
    return (
      <div className="testSection">
        {this.props.loading ? (
          <span style={{ color: "#e83e8c" }}>Running Tests...</span>
        ) : (
          this.props.displayResults(this.props.testResults)
        )}
        <h6>{this.props.testResults.compile_output}</h6>
        <button
          className="button test_submitButton"
          onClick={this.props.handleSubmitClick}
        >
          Submit
        </button>
      </div>
    );
  }
}
