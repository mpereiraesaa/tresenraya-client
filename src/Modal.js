import React, { Component } from "react";
import Modal from "react-bootstrap-modal";
import fetch from "cross-fetch";
import PropTypes from "prop-types";

export default class PlayerModal extends Component {
    static propTypes = {
        open: PropTypes.bool,
        onSave: PropTypes.func,
        onHide: PropTypes.func
    }

    state = {
        player1: '',
        player2: '',
        player1_mark: 'O',
        player2_mark: 'X',
        oldPlayer1: null,
        oldPlayer2: null,
        showOldPlayers1: false,
        showOldPlayers2: false
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.open === false && nextProps.open === true) {
            this.setState({
                player1_mark: 'O',
                player2_mark: 'X',
            });
        }
    }

    componentWillMount() {
        this.players = [];
    }

    async componentDidMount() {
        const response = await fetch(`/api/base.php?type=players`);
        this.players = await response.json();
    }

    onChange = (e) => {
        let field = e.target.name;

        this.setState({
            [field]: e.target.value
        });
    }

    onCheck = (e) => {
        let player1_mark = '',
            player2_mark = '';

        if (e.target.checked) {
            player1_mark = "X";
            player2_mark = "O";
        }
        else {
            player1_mark = "O";
            player2_mark = "X";
        }

        this.setState({
            player1_mark,
            player2_mark
        });
    }

    showPlayers1 = (e) => {
        const { showOldPlayers1 } = this.state;

        this.setState({
            showOldPlayers1: !showOldPlayers1,
            oldPlayer1: null
        });
    }

    showPlayers2 = (e) => {
        const { showOldPlayers2 } = this.state;

        this.setState({
            showOldPlayers2: !showOldPlayers2,
            oldPlayer2: null
        });
    }

    onSelectPlayer1 = (e) => {
        this.setState({
            oldPlayer1: e.target.value
        });
    }

    onSelectPlayer2 = (e) => {
        this.setState({
            oldPlayer2: e.target.value
        });
    }

    onHide = () => {
        this.setState({
            oldPlayer1: null,
            oldPlayer2: null,
            player1: '',
            player2: '',
            showOldPlayers1: false,
            showOldPlayers2: false
        });

        this.props.onHide();
    }

    handleClick = async () => {
        let data = {};

        if (this.state.oldPlayer1) {
            data["oldPlayer1"] = this.state.oldPlayer1;
        }

        if (this.state.oldPlayer2) {
            data["oldPlayer2"] = this.state.oldPlayer2;
        }

        if (this.state.player1 !== '') {
            data["player1"] = this.state.player1;
        }

        if (this.state.player2 !== '') {
            data["player2"] = this.state.player2;
        }

        data["player1_mark"] = this.state.player1_mark;
        data["player2_mark"] = this.state.player2_mark;

        const response = await this.props.onSave(data);

        if (this.state.player1 !== '') {
            this.players.push(response.player1);
        }

        if (this.state.player2 !== '') {
            this.players.push(response.player2);
        }

        this.onHide();
    }

    renderOption1 = () => {
        if (this.state.showOldPlayers1) {
            return (
                <select className="form-control" onChange={this.onSelectPlayer1}>
                  <option disabled={true} selected={true}>Seleccione un Jugador</option>
                  {this.players.map((player) => {
                      if (player.id !== this.state.oldPlayer2) {
                        return <option value={player.id}>{player.name}</option>
                      }
                  })}
                </select>
            );
        }
        else {
            return (
                <input type="text" className="form-control" name="player1" onChange={this.onChange}/>
            );
        }
    }

    renderOption2 = () => {
        if (this.state.showOldPlayers2) {
            return (
                <select className="form-control" onChange={this.onSelectPlayer2}>
                  <option disabled={true} selected={true}>Seleccione un Jugador</option>
                  {this.players.map((player) => {
                      if (player.id !== this.state.oldPlayer1) {
                          return <option value={player.id}>{player.name}</option>
                      }
                  })}
                </select>
            );
        }
        else {
            return (
                <input type="text" className="form-control" name="player2" onChange={this.onChange}/>
            );
        }
    }

    renderForm = () => {
        return (
            <form>
                <div className="form-group">
                    <label>Player1 name:</label>
                    <div className="checkbox">
                        <label><input type="checkbox" onChange={this.showPlayers1} />¿Quieres cargar un jugador ya existente?</label>
                    </div>
                    {this.renderOption1()}
                </div>
                <div className="form-group">
                    <label>Player2 name:</label>
                    <div className="checkbox">
                        <label><input type="checkbox" onChange={this.showPlayers2} />¿Quieres cargar un jugador ya existente?</label>
                    </div>
                    {this.renderOption2()}
                </div>
                <div className="checkbox">
                    <label><input type="checkbox" onChange={this.onCheck} /> Player1 will use the "X" mark</label>
                </div>
            </form>
        );
    }

    render() {
        return (
            <Modal show={this.props.open} onHide={this.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        PLAYER DETAILS
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-xs-12">
                        {this.renderForm()}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Dismiss className="btn btn-default">
                        Cancel
                    </Modal.Dismiss>
                    <button className="btn btn-primary" onClick={this.handleClick}>
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}
