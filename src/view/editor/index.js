import React from 'react'
import { Card } from 'semantic-ui-react'
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/chrome';

class Editor extends React.Component {

	componentDidMount() {
		// get the ace DOM element
		this.editor = this.refs.ace.editor.getSession();

		/* Disable automated syntax checking (for now).
		We may want to implement our own at some point. */
		this.editor.setUseWorker(false);
	}

	render() {

		return (
			<Card style={{width: '100%', height: '100%'}} raised={true} >
				<AceEditor
					ref="ace"
					style={{width: '100%', height: '100%'}}
					mode="javascript" 
					theme="chrome" />
			</Card>
		);
	}
}

export default Editor