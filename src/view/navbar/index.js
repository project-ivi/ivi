import React from 'react';
import { Menu } from 'semantic-ui-react';

import Logo from '../assets/ivy-bg.png'
import WhiteButton from '../components/WhiteButton';

const Navbar = () => (
    <Menu className='component__navbar'>
      <span style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={{height: '100%', padding: '8px'}}>
          <img alt='ivy' src={Logo} className='ivy-logo'/>
        </span>
        <span style={{padding: '15px'}}>
          <span style={{paddingRight: '7px'}} >
            <WhiteButton text='Run' />
          </span>
          <WhiteButton text='Step' />
        </span>
      </span>
    </Menu>
)

export default Navbar
