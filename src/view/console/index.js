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

const Console = ({ consoleOutput, }) => (
  <Card raised={ true } style={{ height: '100%', width: '100%', }}>
    <div style={ textAreaStyle }>
      { consoleOutput.map(elem => (
        <div>{ elem }</div>
      )) }
    </div>
  </Card>
)

export default Console
