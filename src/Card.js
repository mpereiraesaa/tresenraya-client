import React, { Component } from "react";
import PropTypes from 'prop-types';
import Flipcard from '@kennethormandy/react-flipcard'
import '@kennethormandy/react-flipcard/dist/Flipcard.css'
import "./card.css";

export default class Card extends Component {
    static propTypes = {
        cellCode: PropTypes.string,
        isReady: PropTypes.bool,
        onMove: PropTypes.func,
        getCurrentTurn: PropTypes.func
    }

    state = {
        isFlipped: false,
        mark: ''
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.isReady !== nextProps.isReady && this.state.isFlipped) {
            this.setState({
                isFlipped: false,
                mark: ''
            });
        }
    }

    flip = () => {
        const { isFlipped } = this.state;

        this.setState({
            isFlipped: !isFlipped
        });
    }

    handleClick = async () => {
        if (!this.props.isReady) {
            return false;
        }

        if (this.state.mark !== '') {
            return false;
        }

        await this.setState({
            mark: this.props.getCurrentTurn()
        });

        this.flip();

        await this.props.onMove(this.props.cellCode);
    }

    render() {
        return (
            <div className="flippable" onClick={this.handleClick}>
                <Flipcard
                flipped={this.state.isFlipped}>
                <div className="card visible-card"></div>
                <div className="card hidden-card"><h1>{this.state.mark}</h1></div>
                </Flipcard>
            </div>
        );
    }
}
