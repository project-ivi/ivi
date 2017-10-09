import React from 'react'
import { Form, TextArea, Card } from 'semantic-ui-react'

const textAreaStyle = {
	minHeight: '100%',
	borderColor: 'transparent',
	backgroundColor:'black',
	color: 'white',
	fontFamily: 'Courier',
	overflow: 'scroll'
}

class Console extends React.Component {
	
	constructor(props) {
		super(props);

		this.addLine = this.addLine.bind(this);
		this.state = {consoleContents: ['o']}
	}

	componentDidMount() {
		console.log('this happened')
		this.setState({consoleContents: ['okay']})
	}

	addLine(line) {
	}
	
	render() {
		return (
			<Card raised={true} style={{height: '100%', width: '100%'}}>
				<Form style={{height: '100%'}}>
					<TextArea autoHeight placeholder='>' readOnly style={textAreaStyle}>
						{this.state.consoleContents}
					</TextArea>
				</Form>
	  		</Card>
		)
	}
}


export default Console
