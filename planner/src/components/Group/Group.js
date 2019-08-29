import React, { Component } from 'react';
import "./Group.css";

function getSplit(value, splitQty) {
    if (splitQty <= 0) {
        return 0;
    }
    const split = value / splitQty;
    return split.toFixed(2);
}

function getTotal(value, qty) {
    const tot = value * qty;
    return tot.toFixed(2);
}

function getConvertedValue(value, from, to, rates) {
    from = from.toUpperCase();
    to = to.toUpperCase();
    if (!rates || !rates[from] || !rates[to]) {
        return 0;
    }
    
    const valueInGlobalBase = value / rates[from];
    const converted = valueInGlobalBase * rates[to];
    return converted.toFixed(2);
}

function round(value) {
    return value.toFixed(2);
}

class Group extends Component {
    constructor(props){
        super(props);
        const { name, displayCurrency, splitQuantity, rates, entries } = props;
        this.state = { 
            name, 
            displayCurrency, 
            splitQuantity, 
            editMode: false, 
            entries,
            rates
        };

        this.toggleEditMode = this.toggleEditMode.bind(this);
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ rates: nextProps.rates });
    // }

    toggleEditMode() {
        this.setState({ editMode: true });
    }
    
    render() {
        return (
          <div className="Group">
            <div className="pt-3">
                <div className="card">
                    <div className="card-header bg-dark d-flex justify-content-between">
                        <div className="text-white">
                            { this.state.editMode ? 
                                (<input type="text" className="form-control form-control-sm" style={{ width:'20%', display:"inline-block"}} value={this.state.name} />) :
                                (<span className="font-weight-bold">{this.state.name}</span>)
                            }
                            <a className="btn btn-sm mr-3"><i className="fa fa-plus"></i></a>
                            <span className="ml-3 mr-1"><i className="fa fa-square text-primary"></i></span>
                            <span className="text-white mr-2">Showing In:</span>
                            { this.state.editMode ?
                                (<input type="text" className="form-control form-control-sm mr-3" style={{ width: '10%', display:"inline-block"}} value={this.state.displayCurrency}/>) :
                                (<span className="mr-3">{this.state.displayCurrency.toUpperCase()}</span>)
                            }
                            <span className="text-white ml-3 mr-2">Split Qty:</span>
                            { this.state.editMode ?
                                (<input type="number" className="form-control form-control-sm mr-3" style={{ width: '10%', display:"inline-block"}} value={this.state.splitQuantity}/>) :
                                (<span className="mr-3">{this.state.splitQuantity}</span>)
                            }
                            <a className="btn btn-sm btn-xsm"><i className="fa fa-save"></i></a>
                            <a className="btn btn-sm btn-xsm" onClick={this.toggleEditMode}><i className="fa fa-edit"></i></a>
                            <a className="btn btn-sm btn-xsm"><i className="fa fa-trash"></i></a>
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
                                    <th scope="col" style={{ width: '10%'}}>Split</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Split</th>
                                    <th scope="col" style={{ width: '10%'}}>Total</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.entries.map((entry, idx) => 
                                    <tr>
                                        <td>{idx + 1}</td>
                                        <td>
                                            <a className="btn btn-sm btn-xsm"><i className="fa fa-save"></i></a>
                                            <a className="btn btn-sm btn-xsm"><i className="fa fa-edit"></i></a>
                                            <a className="btn btn-sm btn-xsm"><i className="fa fa-trash"></i></a>
                                        </td>
                                        <td>{entry.details}</td>
                                        <td><input type="checkbox" className="form-control" checked={entry.isPersonal}/></td>
                                        <td>{entry.quantity}</td>
                                        <td>{round(entry.value)}</td>
                                        <td>{entry.currency.toUpperCase()}</td>
                                        <td>{getConvertedValue(entry.value, entry.currency, this.state.displayCurrency, this.state.rates)}</td>
                                        <td>{getSplit(entry.value, this.state.splitQuantity)}</td>
                                        <td>{getSplit(getConvertedValue(entry.value, entry.currency, this.state.displayCurrency, this.state.rates), this.state.splitQuantity)}</td>
                                        <td>{getTotal(entry.value, entry.quantity)}</td>
                                        <td>{getTotal(getConvertedValue(entry.value, entry.currency, this.state.displayCurrency, this.state.rates), entry.quantity)}</td>
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
