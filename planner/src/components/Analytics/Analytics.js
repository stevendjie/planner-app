import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import { getTotal, getConvertedValue, getSplit, format, orderCurrencies } from "../../helpers.js";
import "./Analytics.css";

class Analytics extends Component {
    constructor(props) {
        super(props);
        this.state = { editMode: false };

        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.saveDisplayCurrency = this.saveDisplayCurrency.bind(this);
    }

    saveDisplayCurrency() {
        const { displayCurrency, userId } = this.props;
        fetch(`/users/${userId}`, {
            method: "PATCH",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ displayCurrency: displayCurrency.toLowerCase() })
        }).then(() => {
            this.setState({ editMode: false });
        });
    }

    toggleEditMode() {
        this.setState({ editMode: true });
    }

    render() {
        const { displayCurrency, rates, groups, updateDisplayCurrency } = this.props;
        if (!displayCurrency || !rates) {
            return <div></div>;
        }
        const personalChartData = [["Group", displayCurrency]];
        const totalChartData = [["Group", displayCurrency]];
        let allSplitTotal = 0;
        let allTotal = 0;
        groups.forEach((group) => {
            const { entries, name, splitQuantity } = group;
            let total = 0;
            let splitTotal = 0;
            entries.forEach((entry) => {
                const converted = getConvertedValue(entry.value, entry.currency, displayCurrency, rates);
                const entryTotal = getTotal(converted, entry.quantity);
                total += entryTotal;
                if (entry.isPersonal) {
                    splitTotal += getSplit(entryTotal, splitQuantity);
                }
            });
            personalChartData.push([name, splitTotal]);
            totalChartData.push([name, total]);
            allSplitTotal += splitTotal;
            allTotal += total;
        });
        const options = orderCurrencies(Object.keys(rates));
        return (
            <div className="Analytics">
                <div className="jumbotron pt-3 pb-3">
                    <div className="row">
                        <div className="col-sm d-flex justify-content-center">
                            <span className="mr-3">Showing In:&nbsp;</span>
                            { this.state.editMode ?
                                (<select 
                                    className="custom-select custom-select-sm mr-3" 
                                    style={{ width: '10%' }} 
                                    value={displayCurrency.toUpperCase()}
                                    onChange={updateDisplayCurrency}
                                 >
                                    { options.map((value, idx) =>
                                        <option value={value} key={idx}> 
                                            {value}
                                        </option>
                                    )}
                                </select>) :
                                (<span className="mr-3">{displayCurrency.toUpperCase()}</span>)
                            }
                            <a className="btn btn-sm btn-xsm" onClick={this.saveDisplayCurrency}><i className="fa fa-save"></i></a>
                            <a className="btn btn-sm btn-xsm" onClick={this.toggleEditMode}><i className="fa fa-edit"></i></a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <Chart
                                width={'100%'}
                                height={'300px'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={personalChartData}
                                options={{
                                    title: 'Personal Total',
                                    backgroundColor: '#e9ecef',
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            />
                            <p>Personal Total: {format(allSplitTotal)} {displayCurrency.toUpperCase()}</p>
                        </div>
                        <div className="col">
                            <Chart
                                width={'100%'}
                                height={'300px'}
                                chartType="PieChart"
                                loader={<div>Loading Chart</div>}
                                data={totalChartData}
                                options={{
                                    title: 'Total',
                                    backgroundColor: '#e9ecef',
                                }}
                                rootProps={{ 'data-testid': '1' }}
                            />
                            <p>Total: {format(allTotal)} {displayCurrency.toUpperCase()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default Analytics;