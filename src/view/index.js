import React from 'react'

import Console from './console'
import Editor from './editor'
import Navbar from './navbar'
import Visualizer from './visualizer'

import './styles/index.scss'

export default class Interpreter extends React.Component {
  render() {
    return (
      <div className="component__interpreter">
        <Console />
        <Editor />
        <Navbar />
        <Visualizer />
      </div>
    )
  }
}