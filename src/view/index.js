import React from 'react'

import Console from './console'
import Editor from './editor'
import Navbar from './navbar'
import Visualizer from './visualizer'

import '../semantic/out/semantic.min.css';

export default class Interpreter extends React.Component {
  render() {
    return (
      <div className="component__interpreter">

        <h1 style={{text:'center'}}> Interactive Visual Interpreter </h1>

        <div style={{float:'left', width:'50%', border:'1px solid black', margin:'5px'}}>
          <Navbar />
          <Editor />
        </div>

        <div style={{border:'1px solid black', width:'48%', float:'right', margin:'5px'}}>
          <Visualizer />
        </div>

        <div style={{border:'1px solid black', width:'48%', float:'right', margin:'5px'}}>
           <Console />
        </div>

      </div>
    )
  }
}
