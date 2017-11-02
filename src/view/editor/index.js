import React from 'react';
import { Card } from 'semantic-ui-react';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/chrome';

// constants
const fontSize = 15;

export default class Editor extends React.Component {
  componentDidMount() {
    // get the ace DOM element
    this.editor = this.refs.ace.editor;

    /* Disable automated syntax checking (for now).
		We may want to implement our own at some point. */
    this.editor.getSession().setUseWorker(false);

    // other defaults
    this.editor.setFontSize(fontSize);
  }

  render() {
    if (this.editor) {
      this.editor.setReadOnly(this.props.isRunning);
      if (this.props.isRunning) {
        this.editor.gotoLine(this.props.highlightedLine);
      }
    }

    return (
      <Card style={{ width: '100%', height: '100%' }} raised={true}>
        <AceEditor mode='javascript'
          onChange={ this.props.handleCodeChange }
          ref='ace'
          style={{ width: '100%', height: '100%' }}
          theme='chrome'
          value={ this.props.code } />
      </Card>
    );
  }
}
