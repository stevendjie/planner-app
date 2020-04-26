import React, { Component } from 'react';
import './App.css';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Main from "./components/Main/Main.js";
import { USER_ID } from "./credentials.js";
import Login from "./components/Login/Login.js";

class App extends Component {
    constructor() {
        super();
        this.state = { userId: USER_ID || null };
        this.onLogin = this.onLogin.bind(this);
    }

    onLogin(email, password) {
        fetch('/users/login', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        }).then(res => res.json())
        .then((json) => {
            const { userId, error } = json;
            if (userId) {
                this.setState({ userId });
            } else {
                NotificationManager.error(error.message, "Failed to login", 3000);
            }
        })
        .catch(err => NotificationManager.error("", "Failed to login", 3000))
    }

    render() {
        return (
            <div className="App">
                <NotificationContainer />
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">&copy; S.D.</a>
                    <button className="btn btn-sm btn-dark nav-link text-white" onClick={() => { this.setState({ userId: null }); }}>{ this.state.userId && ("Sign Out")}</button>
                </nav>
                { this.state.userId ?
                (<Main 
                    userId={this.state.userId}
                />) :
                (<Login
                    onLogin={this.onLogin}
                />) }
            </div>
        );
    }
}

export default App;