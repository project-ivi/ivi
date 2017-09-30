import React from 'react'
import { Form, TextArea, Card } from 'semantic-ui-react'

const textAreaStyle = {
	minHeight: '100%',
	borderColor: 'transparent',
	backgroundColor:'black',
	color: 'white'
}

const Console = () => (
  <Card raised={true} style={{height: '100%', width: '100%'}}>
		<Form style={{height: '100%'}}>
			<TextArea autoHeight placeholder='Console output' readOnly style={textAreaStyle}/>
		</Form>
  </Card>
)


export default Console
