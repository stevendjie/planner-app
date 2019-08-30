import React, { Component } from 'react';
import { getTotal, getConvertedValue, format, getSplit, orderCurrencies } from "../../helpers.js";
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
        this.onChangeGroupAttr = this.onChangeGroupAttr.bind(this);
        this.saveGroup = this.saveGroup.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
    }

    onChangeGroupAttr(e, attr) {
        const { value } = e.target;
        const newState = { [attr]: value };
        this.setState(newState);
    }

    saveGroup(e) {
        let { name, displayCurrency, splitQuantity } = this.state;
        name = name.trim();
        if (name === "") {
            return;
        }
        displayCurrency = displayCurrency.trim().toLowerCase();
        splitQuantity = parseInt(splitQuantity, 10);
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
            const { group } = json;
            this.props.updateGroup(_id, group);
        });
    }

    removeGroup() {
        const { _id } = this.props;
        fetch(`/groups/${_id}`, {
            method: "DELETE"
        })
        .then(() => Promise.all(this.state.entries.map(e =>
            fetch(`/entries/${e.id}`, { method: "DELETE" }))))
        .then(() => {
            this.props.removeGroup(_id);
        });
    }

    toggleEditMode() {
        this.setState({ editMode: true });
    }
    
    render() {
        const options = orderCurrencies(Object.keys(this.props.rates));
        return (
          <div className="Group">
            <div className="pt-3">
                <div className="card">
                    <div className="card-header bg-dark">
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
                                <a className="btn btn-sm"><i className="fa fa-plus"></i></a>
                            </div>
                            <div className="col">
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
                            <div className="col">
                                <span className="mr-2">Split Qty:</span>
                                { this.state.editMode ?
                                    (<input 
                                        type="number" 
                                        className="form-control form-control-sm" 
                                        style={{ width: '30%', display:"inline-block"}} 
                                        value={this.state.splitQuantity} 
                                        onChange={(e) => { this.onChangeGroupAttr(e, "splitQuantity"); }} />) :
                                    (<span>{this.state.splitQuantity}</span>)
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
                        <table className="table table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col" style={{ width: '2%'}}>#</th>
                                    <th scope="col" style={{ width: '10%'}}>Actions</th>
                                    <th scope="col" style={{ width: '20%'}}>Details</th>
                                    <th scope="col" style={{ width: '2%'}}>P?</th>
                                    <th scope="col" style={{ width: '2%'}}>Qty</th>
                                    <th scope="col" style={{ width: '10%'}}>Value</th>
                                    <th scope="col" style={{ width: '4%'}}>$</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Value</th>
                                    <th scope="col" style={{ width: '10%'}}>Personal</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Personal</th>
                                    <th scope="col" style={{ width: '10%'}}>Total</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.entries.map((entry, idx) => 
                                    <tr key={entry._id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <a className="btn btn-sm btn-xsm"><i className="fa fa-save"></i></a>
                                            <a className="btn btn-sm btn-xsm"><i className="fa fa-edit"></i></a>
                                            <a className="btn btn-sm btn-xsm"><i className="fa fa-trash"></i></a>
                                        </td>
                                        <td>{entry.details}</td>
                                        <td><input type="checkbox" className="form-control" checked={entry.isPersonal}/></td>
                                        <td>{entry.quantity}</td>
                                        <td>{format(entry.value)}</td>
                                        <td>{entry.currency.toUpperCase()}</td>
                                        <td>{format(getConvertedValue(entry.value, entry.currency, this.state.displayCurrency, this.props.rates))}</td>
                                        <td>{format(getSplit(entry.value, this.props.splitQuantity))}</td>
                                        <td>{format(getSplit(getConvertedValue(entry.value, entry.currency, this.state.displayCurrency, this.props.rates),
                                            this.props.splitQuantity))}</td>
                                        <td>{format(getTotal(entry.value, entry.quantity))}</td>
                                        <td>{format(getTotal(getConvertedValue(entry.value, entry.currency, this.state.displayCurrency, this.props.rates),
                                            entry.quantity))}</td>
                                    </tr>
                                  )
                                }
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
