import React from 'react';
import p5 from 'p5';

export default class P5Wrapper extends React.Component {
  componentDidMount() {
    this.canvas = new p5(this.props.sketch, this.refs.wrapper);
  }

  render() {
    return <div id='visualizer' ref='wrapper' style={{ height: '100%', width: '100%' }}></div>;
  }
}