import React, { Component } from 'react';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { email: null, password: null };
        this.onChangeField = this.onChangeField.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    onChangeField(e, field) {
        this.setState({ [field]: e.target.value });
    }

    onLogin() {
        const { email, password } = this.state;
        this.props.onLogin(email, password);
    }

    render() {
        return (
            <div className="Login">
                <div className="container pt-5 pb-5">
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" onChange={(e) => { this.onChangeField(e, "email"); }}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" onChange={(e) => { this.onChangeField(e, "password"); }}/>
                    </div>
                    <button className="btn btn-primary text-white" onClick={this.onLogin}>Login</button>
                </div>
            </div>
        );
    }
}

export default Login;
