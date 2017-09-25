import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'

const Editor = () => (
  <div className="component__editor">
    <h2>Editor</h2>    
    	<Form>
    		<TextArea 
    		placeholder="Code here..."
    		rows='20'
    		/>
    	</Form>
  </div>
)

export default Editor