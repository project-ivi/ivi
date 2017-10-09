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
		this.state = {consoleContents: [],
                      value : ""};
	}


	addLine(line) {
        let oldArray = this.state.consoleContents.slice();
        oldArray.push(line);
        let longString = "";
        oldArray.forEach(function(existingLine) {
            longString += "> " + existingLine + "\n";
        });
        this.setState({consoleContents : oldArray,
                       value : longString});
	}
	
	render() {
		return (
			<Card raised={true} style={{height: '100%', width: '100%'}}>
				<Form style={{height: '100%'}}>
					<TextArea autoHeight placeholder='>' readOnly style={textAreaStyle} value={this.state.value}>
					</TextArea>
				</Form>
	  		</Card>
		)
	}
}


export default Console
