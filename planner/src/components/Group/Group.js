import React, { Component } from 'react';
import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';
import { getTotal, getConvertedValue, format, getSplit, orderCurrencies, floor } from "../../helpers.js";
import "./Group.css";

class Group extends Component {
    constructor(props){
        super(props);
        const { name, displayCurrency, splitQuantity, entries, editMode } = props;
        this.state = { 
            name, 
            displayCurrency, 
            splitQuantity, 
            editMode: !!editMode, 
            entries
        };

        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.toggleEntryEditMode = this.toggleEntryEditMode.bind(this);
        this.onChangeGroupAttr = this.onChangeGroupAttr.bind(this);
        this.onChangeEntryAttr = this.onChangeEntryAttr.bind(this);
        this.saveGroup = this.saveGroup.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.addEntry = this.addEntry.bind(this);
        this.saveEntry = this.saveEntry.bind(this);
        this.removeEntry = this.removeEntry.bind(this);
    }

    addEntry() {
        const entry = {
            groupId: this.props._id,
            quantity: 1,
            value: 0,
            isPersonal: true,
            details: `${this.props.name} ${this.props.entries.length + 1}`,
            currency: this.state.displayCurrency.toLowerCase()
        };
        const { entries } = this.state;
        fetch(`/entries`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry)
        }).then(res => res.json())
        .then((json) => {
            const { entry, message } = json;
            if (entry) {
                entry.editMode = true;
                entries.push(entry);
                this.setState({ entries });
                this.props.updateGroup(this.props._id, { entries });
                NotificationManager.success(message, "Success!", 3000);
            } else {
                NotificationManager.error(message, "Failed!", 3000);
            }
        })
        .catch(err => NotificationManager.error(err.message, "Failed!", 3000));
    }

    toggleEntryEditMode(entryId) {
        const { entries } = this.state;
        const idx = entries.findIndex(e => e._id === entryId);
        entries[idx].editMode = true;
        this.setState({ entries });
    }

    onChangeEntryAttr(e, attr, entryId, fromCheckBox = false) {
        let { value, checked } = e.target;
        if (fromCheckBox) {
            value = checked;
        }
        const { entries } = this.state;
        const idx = entries.findIndex(e => e._id === entryId);
        entries[idx][attr] = value;
        this.setState({ entries });
    }

    onChangeGroupAttr(e, attr) {
        const { value } = e.target;
        const newState = { [attr]: value };
        this.setState(newState);
    }

    saveEntry(entryId) {
        const {  entries } = this.state;
        const idx = entries.findIndex(e => e._id === entryId);
        let { quantity, value, details, isPersonal, currency } = entries[idx];
        const groupId = this.props._id;

        quantity = floor(quantity);
        value = parseFloat(value);
        details = details && details.trim();
        currency = currency.trim().toLowerCase();
        if (isNaN(quantity) || isNaN(value) || quantity < 1 || !details || !currency) {
            return;
        }
        fetch(`/entries/${entryId}`, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                groupId,
                quantity,
                value,
                details,
                isPersonal,
                currency
            })
        }).then(res => res.json())
        .then((json) => {
            const { entry, message } = json;
            if (entry) {
                entry.editMode = false;
                entries[idx] = entry;
                this.setState({ entries });
                this.props.updateGroup(this.props._id, { entries });
                NotificationManager.success(message, "Success!", 3000);
            } else {
                NotificationManager.error(message, "Failed!", 3000);
            }
        })
        .catch(err => NotificationManager.error(err.message, "Failed!", 3000));
    }

    saveGroup(e) {
        let { name, displayCurrency, splitQuantity } = this.state;
        name = name.trim();
        if (name === "") {
            return;
        }
        displayCurrency = displayCurrency.trim().toLowerCase();
        splitQuantity = floor(splitQuantity);
        if (isNaN(splitQuantity) || splitQuantity < 1 ) {
            return;
        }
        const { _id } = this.props;
        fetch(`/groups/${_id}`, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                displayCurrency,
                splitQuantity
            })
        }).then(res => res.json())
        .then((json) => {
            this.setState({ editMode: false });
            const { group, message } = json;
            if (group) {
                this.props.updateGroup(_id, group);
                NotificationManager.success(message, "Success!", 3000);
            } else {
                NotificationManager.error(message, "Failed!", 3000);
            }
        });
    }

    removeGroup() {
        const { _id } = this.props;
        fetch(`/groups/${_id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(() => Promise.all(this.state.entries.map(e =>
            fetch(`/entries/${e._id}`, { method: "DELETE" }))))
        .then(() => {
            this.props.removeGroup(_id);
            NotificationManager.success("Group removed", "Success!", 3000);
        })
        .catch(err => NotificationManager.error(err.message, "Failed!", 3000));
    }

    removeEntry(entryId) {
        const entries = this.state.entries.filter(e => e._id !== entryId);
        fetch(`/entries/${entryId}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then((json) => {
            const { message } = json;
            this.setState({ entries });
            this.props.updateGroup(this.props._id, { entries });
            NotificationManager.success(message, "Success!", 3000);
        })
        .catch(err => NotificationManager.error(err.message, "Failed", 3000));
    }

    toggleEditMode() {
        this.setState({ editMode: true });
    }
    
    render() {
        const options = orderCurrencies(Object.keys(this.props.rates));
        const { entries } = this.state;
        let total = 0;
        let convertedTotal = 0;
        let personalTotal = 0;
        let convertedPersonalTotal = 0;
        entries.map((entry) => {
            entry.convertedValue = getConvertedValue(entry.value, entry.currency, this.state.displayCurrency, this.props.rates);
            entry.total = getTotal(entry.value, entry.quantity);
            entry.convertedTotal = getTotal(entry.convertedValue, entry.quantity);
            entry.splitTotal = entry.isPersonal ? getSplit(entry.total, this.state.splitQuantity) : 0;
            entry.convertedSplitTotal = entry.isPersonal ? getSplit(entry.convertedTotal, this.state.splitQuantity) : 0;

            total += entry.total;
            convertedTotal += entry.convertedTotal;
            personalTotal += entry.splitTotal;
            convertedPersonalTotal += entry.convertedSplitTotal;

            return entry;
        });
        return (
          <div className="Group">
            <div className="pt-3">
                <div className="card">
                    <div className="card-header bg-dark pt-1 pb-1">
                        <div className="row text-white">
                            <div className="col">
                                { this.state.editMode ? 
                                    (<input 
                                        type="text" 
                                        className="form-control form-control-sm" 
                                        style={{ width:'70%', display:"inline-block"}} 
                                        onChange={(e) => { this.onChangeGroupAttr(e, "name"); }}
                                        value={this.state.name} 
                                        />) :
                                    (<span className="font-weight-bold">{this.state.name}</span>)
                                }
                                <a className="btn btn-sm" onClick={this.addEntry}><i className="fa fa-plus"></i></a>
                            </div>
                            <div className="col pt-1">
                                <span className="mr-1"><i className="fa fa-square text-primary"></i></span>
                                <span className="mr-2">Showing In:</span>
                                { this.state.editMode ?
                                    (<select 
                                        className="custom-select custom-select-sm" 
                                        style={{ width: '30%' }} 
                                        value={this.state.displayCurrency.toUpperCase()}
                                        onChange={(e) => { this.onChangeGroupAttr(e, "displayCurrency"); }}
                                     >
                                        { options.map((value, idx) =>
                                            <option value={value} key={idx}> 
                                                {value}
                                            </option>
                                        )}
                                    </select>) :
                                    (<span>{this.state.displayCurrency.toUpperCase()}</span>)
                                }
                            </div>
                            <div className="col pt-1">
                                <span className="mr-2">Split Qty:</span>
                                { this.state.editMode ?
                                    (<input 
                                        type="number" 
                                        className="form-control form-control-sm" 
                                        style={{ width: '30%', display:"inline-block"}} 
                                        value={this.state.splitQuantity} 
                                        onChange={(e) => { this.onChangeGroupAttr(e, "splitQuantity"); }} />) :
                                    (<span>{floor(this.state.splitQuantity)}</span>)
                                }
                            </div>
                            <div className="col">
                                <a className="btn btn-sm btn-xsm"><i className="fa fa-save" onClick={this.saveGroup}></i></a>
                                <a className="btn btn-sm btn-xsm" onClick={this.toggleEditMode}><i className="fa fa-edit"></i></a>
                                <a className="btn btn-sm btn-xsm"><i className="fa fa-trash" onClick={this.removeGroup}></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-striped">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col" style={{ width: '2%'}}>#</th>
                                    <th scope="col" style={{ width: '8%'}}>Actions</th>
                                    <th scope="col" style={{ width: '20%'}}>Details</th>
                                    <th scope="col" style={{ width: '2%'}}>P?</th>
                                    <th scope="col" style={{ width: '10%'}}>Qty</th>
                                    <th scope="col" style={{ width: '10%'}}>Value</th>
                                    <th scope="col" style={{ width: '10%'}}>$</th>
                                    <th scope="col" style={{ width: '5%'}} className="text-white bg-primary">Value</th>
                                    <th scope="col" style={{ width: '10%'}}>Total</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Total</th>
                                    <th scope="col" style={{ width: '10%'}}>Personal</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Personal</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.entries.map((entry, idx) => 
                                    <tr key={entry._id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <a className="btn btn-sm btn-xsm" onClick={() => { this.saveEntry(entry._id); } }><i className="fa fa-save"></i></a>
                                            <a className="btn btn-sm btn-xsm" onClick={(e) => { this.toggleEntryEditMode(entry._id); }}><i className="fa fa-edit"></i></a>
                                            <a className="btn btn-sm btn-xsm" onClick={(e) => { this.removeEntry(entry._id); }}><i className="fa fa-trash"></i></a>
                                        </td>

                                        <td>{entry.editMode ? (<input type="text" className="form-control p-1" value={entry.details} onChange={(e) => { this.onChangeEntryAttr(e, "details", entry._id); } }/>) : (entry.details)}</td>
                                        <td>{entry.editMode ? (<input type="checkbox" className="form-control" checked={entry.isPersonal} onChange={(e) => { this.onChangeEntryAttr(e, "isPersonal", entry._id, true); } }/>) : (entry.isPersonal && <i className="fa fa-check"></i>)}</td>
                                        <td>{entry.editMode ? (<input type="number" className="form-control p-1" value={entry.quantity} onChange={(e) => { this.onChangeEntryAttr(e, "quantity", entry._id); } }/>) : (floor(entry.quantity))}</td>
                                        <td>{entry.editMode ? (<input type="number" className="form-control p-1" value={entry.value} onChange={(e) => { this.onChangeEntryAttr(e, "value", entry._id); } }/>) : (format(entry.value))}</td>
                                        <td>{entry.editMode ? (
                                            <select 
                                                className="custom-select custom-select-sm p-1" 
                                                value={entry.currency.toUpperCase()}
                                                onChange={(e) => { this.onChangeEntryAttr(e, "currency", entry._id); } }
                                            >
                                                { options.map((value, idx) =>
                                                    <option value={value} key={idx}> 
                                                        {value}
                                                    </option>
                                                )}
                                            </select>) : (entry.currency.toUpperCase())}
                                        </td>
                                        
                                        <td>{format(entry.convertedValue)}</td>
                                        <td>{format(entry.total)}</td>
                                        <td>{format(entry.convertedTotal)}</td>
                                        <td>{format(entry.splitTotal)}</td>
                                        <td>{format(entry.convertedSplitTotal)}</td>
                                    </tr>
                                  )
                                }
                                <tr className="bg-secondary text-white">
                                    <td></td>
                                    <td></td>
                                    <td>All</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>{format(total)}</td>
                                    <td>{format(convertedTotal)}</td>
                                    <td>{format(personalTotal)}</td>
                                    <td>{format(convertedPersonalTotal)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
        );
    }
}

export default Group;
