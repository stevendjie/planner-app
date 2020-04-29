import React, { Component } from 'react';
import { NotificationManager } from 'react-notifications';
import Analytics from '../Analytics/Analytics.js';
import Group from '../Group/Group.js';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { groups: [], rates: null, displayCurrency: null };

    this.updateRates = this.updateRates.bind(this);
    this.updateDisplayCurrency = this.updateDisplayCurrency.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
  }

  componentDidMount() {
    const { userId } = this.props;
    let groups = [];
    fetch(`/users/${userId}/groups`)
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
        });
        this.setState({ groups });
    })
    .catch((err) => { throw err; });
    
    fetch(`/users/${userId}`)
    .then(res => res.json())
    .then((res) => {
      const { user } = res;
      if (user) {
        const { rates, displayCurrency } = user;
        this.setState({ rates, displayCurrency });
      }
    });
  }

  updateDisplayCurrency(e) {
    const { value } = e.target;
    this.setState({ displayCurrency: value });
  }

  updateGroup(groupId, newGroupObj) {
    const { groups } = this.state;
    groups.map((g) => {
      if (g._id === groupId) {
        Object.assign(g, newGroupObj);
      }
      return g;
    });
    this.setState({ groups });
  }

  addGroup() {
    const { groups } = this.state;
    fetch(`/groups`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: "Group",
            displayCurrency: this.state.displayCurrency.toLowerCase(),
            splitQuantity: 1,
            ownedBy: this.props.userId
        })
    }).then(res => res.json())
    .then((json) => {
      const { group, message, error } = json;
      if (group) {
        group.entries = [];
        group.editMode = true;
        groups.push(group);
        this.setState({ groups });
        NotificationManager.success(message, "Success!", 3000)
      } else {
        NotificationManager.error(error.message, "Failed!", 3000);
      }
    })
    .catch((err) => { NotificationManager.error(err.message, "Failed!", 3000); });
  }

  removeGroup(_id) {
    let { groups } = this.state;
    groups = groups.filter(g => g._id !== _id);
    this.setState({ groups });
  }

  updateRates() {
    const { userId } = this.props;
    fetch("https://api.exchangeratesapi.io/latest?base=CAD")
    .then(res => res.json())
    .then((res) => {
      const { rates } = res;
      return fetch(`/users/${userId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rates })
      });
    })
    .then(res => res.json())
    .then((res) => {
      const { user, message, error } = res;
      if (user) {
        const { rates } = user;
        this.setState({ rates });
        NotificationManager.success(message, "Success!", 3000);
      } else {
        NotificationManager.error(error.message, "Failed!", 3000);
      }
    })
    .catch(err => NotificationManager.error(err.message, "Failed!", 3000));
  }

  render() {
    return (
      <div className="Main">
        <div className="container pt-3">
          <div className="d-flex justify-content-start">
            <p><button className="btn btn-light" onClick={this.updateRates}>Reload Exchange Rates</button>&nbsp;
                (Powered by Madis Väin's ECB-based<a target="_blank" rel="noopener noreferrer" href="https://github.com/exchangeratesapi/exchangeratesapi">&nbsp;Exchange Rate API</a>)</p>
          </div>
          <Analytics
            groups={this.state.groups}
            displayCurrency={this.state.displayCurrency}
            rates={this.state.rates}
            userId={this.props.userId}
            updateDisplayCurrency={this.updateDisplayCurrency}
          />
        {this.state.rates && this.state.groups.map(group =>
          <Group 
            _id={group._id}
            key={group._id}
            name={group.name}
            editMode={group.editMode}
            displayCurrency={group.displayCurrency}
            splitQuantity={group.splitQuantity}
            rates={this.state.rates}
            entries={group.entries}
            updateGroup={this.updateGroup}
            removeGroup={this.removeGroup}
          />
        )}
          <div className="d-flex pt-3 pb-3">
            <button className="btn btn-light" onClick={this.addGroup}>+ Group</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
