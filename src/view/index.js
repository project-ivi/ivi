import React from 'react'

import Console from './console'
import Editor from './editor'
import Navbar from './navbar'
import Visualizer from './visualizer'

import './styles/index.scss'

export default class Interpreter extends React.Component {
  render() {
    return (
      <div className="main-view">

        <h1 style={{text:'center'}}> Interactive Visual Interpreter </h1>

        <div style={{float:'left', width:'50%', minHeight: '100%', border:'1px solid black'}}>
          <Navbar />
          <Editor />
        </div>

        <div style={{border:'1px solid black', width:'48%', float:'right'}}>
          <Visualizer />
        </div>

        <div style={{border:'1px solid black', width:'48%', float:'right'}}>
           <Console />
        </div>

      </div>
    )
  }
}
