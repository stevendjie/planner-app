import React, { Component } from 'react';
import './App.css';
import Group from './components/Group/Group.js';

const USER_ID = "5d681b04724536aa4a7e03a6";

class App extends Component {
  constructor(){
    super();
    this.state = { groups: [], rates: null };

    this.updateRates = this.updateRates.bind(this);
  }

  componentDidMount() {
    let groups = [];
    fetch('/groups')
    .then(res => res.json())
    .then((json) => {
      groups = json.groups;
      return fetch('/entries');
    })
    .then(res => res.json())
    .then((json) => {
        const { entries } = json;
        groups.map((g) => {
          g.entries = entries.filter(e => e.groupId === g._id);
          return g;
        })
        this.setState({ groups });
    })
    .catch((err) => { throw err; });
    
    fetch(`/users/${USER_ID}`)
    .then(res => res.json())
    .then((res) => {
      const { user } = res;
      if (user) {
        const { rates } = user;
        this.setState({ rates });
      }
    });
  }

  updateRates() {
    fetch("https://api.exchangeratesapi.io/latest?base=CAD")
    .then(res => res.json())
    .then((res) => {
      const { rates } = res;
      return fetch(`/users/${USER_ID}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rates })
      });
    })
    .then(res => res.json())
    .then((res) => {
      const { user } = res;
      if (user) {
        const { rates } = user;
        this.setState({ rates });
      }
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/">&copy; S.D.</a>
        </nav>
        <div className="container pt-3">
          <div className="d-flex justify-content-start">
            <a className="btn btn-light" onClick={this.updateRates}>Reload Exchange Rates</a>
          </div>
        {this.state.groups.map(group =>
          <Group 
            _id={group._id}
            name={group.name}
            displayCurrency={group.displayCurrency}
            splitQuantity={group.splitQuantity}
            rates={this.state.rates}
            entries={group.entries}
          />
        )}
          <div className="d-flex pt-3">
            <a className="btn btn-light">+ Group</a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
