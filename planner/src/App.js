import React, { Component } from 'react';
import './App.css';
import Group from './components/Group/Group.js';

class App extends Component {
  constructor(){
    super();
    this.state = { groups: [] };
  }

  componentDidMount() {
    fetch('/groups')
      .then(res => res.json())
      .then((res) => {
        const { groups } = res;
        console.log(groups);
        this.setState({ groups });
      });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/">&copy; S.D.</a>
        </nav>
        <div className="container pt-3">
        {this.state.groups.map(group =>
          <Group 
            id={group._id}
            name={group.name}
            displayCurrency={group.displayCurrency}
            splitQuantity={group.splitQuantity}
          />
        )}
        </div>
      </div>
    );
  }
}

export default App;
