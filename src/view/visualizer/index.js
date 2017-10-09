import React from 'react'
import { Card, } from 'semantic-ui-react'

import P5Wrapper from './p5_wrapper'
import Sketch from './sketch'

const Visualizer = () => (
  <div style={{ height: '100%', }}>
    <Card raised={ true } style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
      <P5Wrapper sketch={ Sketch } />
    </Card>
  </div>
)

export default Visualizer