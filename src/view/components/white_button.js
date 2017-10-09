import React from 'react';
import {Button} from 'semantic-ui-react';

export default class WhiteButton extends React.Component {

    constructor(props) {
        super(props);

        this.hover = this.hover.bind(this);
        this.unhover = this.unhover.bind(this);
        this.state = {
            hovering: false
        }
    }

    hover() {
        this.setState({hovering: true})
    }
    unhover() {
        this.setState({hovering: false})
    }

    render() {

        let color;
        if (this.state.hovering) {
            color = this.props.isRunning ? '#cc0000' : '#e6e6e6'
        } else {
            color = this.props.isRunning ? '#ff0000' : 'white'
        }

        return (
            <Button style={{
                        backgroundColor: color,
                        transition: 'background-color 0.1s',
                        width: '90px'
                    }}
                    onMouseOver={ this.hover }
                    onMouseLeave={ this.unhover }
                    onClick={ this.props.onClick } >
                {this.props.text}
            </Button>
        );
    }
}
