import React, { Component } from "react";
import AceEditor from "react-ace";
import "brace/mode/python";
import "brace/theme/dracula";
import "brace/ext/language_tools";

export default class CodeSection extends Component {
  render() {
    return (
      <div className="code-section-wrapper">
        <AceEditor
          className="code-section"
          mode={this.props.language}
          theme="dracula"
          height="100%"
          width="100%"
          fontSize="13px"
          defaultValue={this.props.defaultEditorCode}
          onChange={this.props.onChange.bind(this)}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            enableSnippets: false,
            showLineNumbers: true,
            tabSize: 4,
          }}
        />
      </div>
    );
  }
}
