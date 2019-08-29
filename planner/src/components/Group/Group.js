import React, { Component } from 'react';

class Group extends Component {
    constructor(props){
        super(props);
        const { _id, name, displayCurrency, splitQuantity } = props;
        this.state = { name, displayCurrency };
    }
    
    render() {
        return (
          <div className="Group">
            <div className="pt-3">
                <div className="card">
                    <div className="card-header bg-dark d-flex justify-content-between">
                        <div className="text-white">
                            <span>{this.state.name}</span>
                            <a className="btn btn-sm mr-3"><i className="fa fa-plus"></i></a>
                            <span className="text-white ml-3 mr-3">Showing In:</span>
                            <input type="text" class="form-control form-control-sm mr-3" style={{ width: '10%', display:"inline-block"}}/>
                            <span className="text-white ml-3 mr-3">Split Qty:</span>
                            <input type="number" class="form-control form-control-sm mr-3" style={{ width: '10%', display:"inline-block"}}/>
                            <a className="btn btn-sm"><i className="fa fa-save"></i></a>
                            <a className="btn btn-sm"><i className="fa fa-edit"></i></a>
                            <a className="btn btn-sm"><i className="fa fa-trash"></i></a>
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col" style={{ width: '2%'}}>#</th>
                                    <th scope="col" style={{ width: '15%'}}>Actions</th>
                                    <th scope="col">Details</th>
                                    <th scope="col" style={{ width: '10%'}}>Qty</th>
                                    <th scope="col" style={{ width: '10%'}}>Value</th>
                                    <th scope="col" style={{ width: '10%'}}>Curr.</th>
                                    <th scope="col" style={{ width: '10%'}}>Split</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Value</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Split</th>
                                    <th scope="col" style={{ width: '10%'}} className="text-white bg-primary">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>
                                        <a className="btn btn-sm"><i class="fa fa-edit"></i></a>
                                        <a className="btn btn-sm"><i class="fa fa-save"></i></a>
                                        <a className="btn btn-sm"><i class="fa fa-trash"></i></a>
                                    </td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                    <td>@mdo</td>
                                    <td>@mdo</td>
                                    <td>@mdo</td>
                                    <td>@mdo</td>
                                    <td>@mdo</td>
                                    <td>@mdo</td>
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
