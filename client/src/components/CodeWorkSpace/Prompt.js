import React, { Component } from "react";
import parse from "html-react-parser";
import { Scrollbars } from "react-custom-scrollbars";

export default class prompt extends Component {
  htmlDecode(input) {
    var e = document.createElement("div");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  render() {
    return (
      <Scrollbars style={{ height: "100%", overflow: "hidden" }}>
        <div className="prompt_section LeftSection_CodeWorkspace">
          {parse(this.props.prompt)}
        </div>
      </Scrollbars>
    );
  }
}
