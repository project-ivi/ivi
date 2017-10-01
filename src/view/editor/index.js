import React from 'react'
import { Form, TextArea, Card } from 'semantic-ui-react'

const textAreaStyle = {
	width: '100%', 
	minHeight: '100%', 
	borderColor: 'transparent',
	fontFamily: 'Courier'
}

class Editor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {code: ''};
	}
	
	render() {
		return (
			<Card style={{width: '100%', height: '100%'}} raised={true} >
				<Form style={{height: '100%', borderColor: 'transparent'}}>
					<TextArea 
						autoHeight placeholder="Code here..." 
						style={textAreaStyle}
					/>
				</Form>
			</Card>
		);
	}
}

export default Editor