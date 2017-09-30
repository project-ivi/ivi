import React from 'react';
import {Button} from 'semantic-ui-react';

const unhoverStyle = {
    backgroundColor: 'white',
    transition: 'background-color 0.1s',
    width: '90px'
}

const hoverStyle = {
    backgroundColor: '#e6e6e6',
    transition: 'background-color 0.1s',
    width: '90px'
}

class WhiteButton extends React.Component {

    constructor(props) {
        super(props);

        this.hover = this.hover.bind(this);
        this.unhover = this.unhover.bind(this);
        this.state = {currentStyle: unhoverStyle}
    }

    hover() {
        this.setState({currentStyle: hoverStyle})
    }
    unhover() {
        this.setState({currentStyle: unhoverStyle})
    }

    render() {
        return (
            <Button 
                    style={this.state.currentStyle}
                    onMouseOver={this.hover}
                    onMouseLeave={this.unhover} >
                {this.props.text}
            </Button>
        );
    }
}

export default WhiteButton;