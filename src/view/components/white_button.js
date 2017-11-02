import React from 'react';
import {Button} from 'semantic-ui-react';

export default class WhiteButton extends React.Component {

  constructor(props) {
    super(props);

    this.hover = this.hover.bind(this);
    this.unhover = this.unhover.bind(this);
    this.state = {
      hovering: false,
    };
  }

  hover() {
    this.setState({hovering: true});
  }
  unhover() {
    this.setState({hovering: false});
  }

  render() {

    let color;
    let text = this.props.text;
    let textColor = 'black';
    switch (this.props.runMode) {
    case 0:
      color = this.state.hovering ? '#e6e6e6' : 'white';
      text = 'Run';
      textColor = 'black';
      break;
    case 1:
      color = this.state.hovering ? '#7300e6' : '#9933ff';
      text = 'Resume';
      textColor = 'white';
      break;
    case 2:
      color = this.props.isRunning ? '#cc0000' : '#ff0000';
      text = 'Pause';
      textColor = 'white';
      break;
    default:
      color = this.state.hovering ? '#e6e6e6' : 'white';
    }

    return (
      <Button style={{
        backgroundColor: color,
        color: textColor,
        transition: 'background-color 0.1s',
        width: '90px',
      }}
      onMouseOver={ this.hover }
      onMouseLeave={ this.unhover }
      onClick={ this.props.onClick } >
        {text}
      </Button>
    );
  }
}
