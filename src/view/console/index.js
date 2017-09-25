import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'

const Console = () => (
  <div className="component__console">
	<h2>Console</h2>

	<Form>
		<TextArea placeholder='Console output' />
	</Form>

  </div>
)


export default Console
