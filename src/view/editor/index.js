import React from 'react'
import { Form, TextArea, Card } from 'semantic-ui-react'

const Editor = () => (
  <Card style={{width: '100%', height: '100%'}} raised={true}>  
		<Form style={{height: '100%', borderColor: 'transparent'}}>
    	<TextArea autoHeight placeholder="Code here..." style={{width: '100%', minHeight: '100%', borderColor: 'transparent'}}/>
		</Form>
  </Card>
)

export default Editor