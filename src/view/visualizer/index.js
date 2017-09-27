import React from 'react'
import {Card} from 'semantic-ui-react'

const Visualizer = () => (
  <div style={{height: '100%'}}>
    <Card raised={true} style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center'}}>
      <canvas style={{width: '100%', height: '100%'}}>
      </canvas>
    </Card>
  </div>
)

export default Visualizer