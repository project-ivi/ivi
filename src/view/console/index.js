import React from 'react'
import { Form, TextArea, Card } from 'semantic-ui-react'

const Console = () => (
  <Card raised={true} style={{height: '100%', width: '100%'}}>
		<Form style={{height: '100%'}}>
			<TextArea autoHeight placeholder='Console output' readOnly style={{minHeight: '100%', borderColor: 'transparent'}}/>
		</Form>
  </Card>
)


export default Console
