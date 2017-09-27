import React from 'react'
import { Button, Card } from 'semantic-ui-react'

import '../styles/index.scss'

const Navbar = () => (
    <Card raised={true} style={{width: '100%', height: '100%'}}>
      <div style={{height: '100%', display: 'flex', alignItems: 'center', padding: '15px'}}>
        <Button primary> Step </Button>
      </div>
    </Card>
)

export default Navbar