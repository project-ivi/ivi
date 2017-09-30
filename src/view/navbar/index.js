import React from 'react';
import { Button, Card } from 'semantic-ui-react';

import WhiteButton from '../components/WhiteButton';

const Navbar = () => (
    <Card raised={true} style={{width: '100%', height: '100%', backgroundColor: '#00C673'}}>
      <div style={{height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '15px'}}>
        <span style={{paddingRight: '7px'}} >
          <WhiteButton text='Run' />
        </span>
        <WhiteButton text='Step' />
      </div>
    </Card>
)

export default Navbar