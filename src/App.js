import React, { Component } from "react";
import PlayerModal from "./Modal";
import Card from "./Card";
import Header from "./Header";
import fetch from "cross-fetch";
import "./App.css";

class App extends Component {
    state = {
        modalOpen: false,
        game: null,
        next: null,
        playerActive: null,
        winner: null
    }

    handleClick = () => {
        this.setState({
            modalOpen: true,
            game: null,
            next: null,
            playerActive: null,
            winner: null
        });
    }

    onSave = async (values) => {
        const data = encodeURIComponent(JSON.stringify(values));
        const response = await fetch(`/api/base.php?type=game&gamedata=${data}`);
        let results = await response.json();

        if (results){
            await this.setState({
                game: results,
                next: results.player1_mark,
                playerActive: 1
            });
        }

        return results;
    }

    onMove = async (cellCode) => {
        const json = JSON.stringify({ game: this.state.game.id, value: this.state.next,
            player: this.state.game[`player${this.state.playerActive}`]["id"], cell: cellCode })
        const data = encodeURIComponent(json);
        const response = await fetch(`/api/base.php?type=move&movedata=${data}`);
        let results = await response.json();

        if (results.winner) {
            let player = false;

            if (results.winner.id === this.state.game.player1.id) {
                player = 1;
            }
            else {
                player = 2;
            }

            let game = {...this.state.game, [`player${player}`] : results.winner };

            await this.setState({
                next: null,
                winner: results.winner,
                game
            });
        }

        this.setState({
            next: results.next,
            playerActive: results.nextPlayer
        });
    }

    onHide = () => {
        this.setState({
            modalOpen: false
        });
    }

    getCurrentTurn = () => {
        return this.state.next;
    }

    renderCards() {
        let cards = [];

        for (let j = 0; j < 3; j++) {
            let row = [];
            for (let i = 0; i < 3; i++) {
                row.push(
                    <Card
                        cellCode={`${j},${i}`}
                        key={`index${j}-${i}`}
                        isReady={this.state.next ? true : false}
                        onMove={this.onMove}
                        getCurrentTurn={this.getCurrentTurn}/>
                );
            }
            cards.push(
                <div className="row-cards" key={`index${j}`}>
                    {row}
                </div>
            );
        }

        return cards;
    }

    renderPlayerDetails() {
        if (this.state.game) {
            let player1 = this.state.game.player1.name,
                player2 = this.state.game.player2.name,
                isWinner = '';

            if (this.state.game.player1_mark === this.state.next) {
                player1 = <b>{player1}</b>;
            }
            else {
                player2 = <b>{player2}</b>;
            }

            if (this.state.winner) {
                isWinner = <h2>{this.state.winner.name} wins! </h2>;
            }

            return (
                <div className="player-panel">
                <p>PLAYER1: {player1}({(this.state.game.player1.score.value)})</p>
                <p>PLAYER2: {player2}({(this.state.game.player2.score.value)})</p>
                {isWinner}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="container-fluid">
                    <PlayerModal open={this.state.modalOpen} onSave={this.onSave} onHide={this.onHide}/>
                    <div className="row">
                        <div className="col-sm-8 col-xs-12">
                            <div className="box board">
                                {this.renderCards()}
                            </div>
                        </div>
                        <div className="col-sm-4 col-xs-12">
                            <div className="box panel">
                                <div className="game-btns">
                                    <button
                                        className="btn btn-success"
                                        onClick={this.handleClick}
                                        type="button">
                                        NUEVO JUEGO
                                    </button>
                                </div>
                                {this.renderPlayerDetails()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
