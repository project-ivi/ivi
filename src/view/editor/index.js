import React from 'react'
import { Form, TextArea, Card } from 'semantic-ui-react'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/chrome';

class Editor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {code: ''};
	}

	componentDidMount() {
		// get the ace DOM element
		this.editor = this.refs.ace.editor.getSession();

		/* Disable automated syntax checking (for now).
		We may want to implement our own at some point. */
		this.editor.setUseWorker(false);

		const ace = require('brace')
		const Range = ace.acequire('ace/range').Range;
	}

	render() {

		return (
			<Card style={{width: '100%', height: '100%'}} raised={true} >
				<AceEditor
					ref="ace"
					style={{width: '100%', height: '100%'}}
					mode="javascript" 
					theme="chrome" 
					onChange={(text) => {
						// unconventional, but ace will not work if we re-render on every keystroke
						this.state.code = text;
					}} />
			</Card>
		);
	}
}

export default Editor