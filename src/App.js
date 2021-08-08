import React, { Component, Fragment } from "react";
import {  Route } from "react-router-dom";
import "./App.css";
import "./assets/css/style.css";
import classnames from "classnames";
import TransactionList from "./components/transactions/TransactionList";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      account_id: "",
      inputErrors: {},
      transactions: [],
      new_entry: {},
      error:''
    };
  }

  componentDidMount() {
    fetch(" http://127.0.0.1:5000/")                       // Loads all transactions by default
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.transactions);
          this.setState({
            transactions: result.transactions,
          });
        },
        (error) => {
          this.setState({
            error,
          });
          alert(error+'! Check the status of Api server');
        }

      );
  }

  changeHandler = (e) => {

      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  

  syncData() {                                            // Syncronization of old and newly created transaction
    var found = false;
    const old_transactions = this.state.transactions;
    for (var x = 0; x < old_transactions.length; x++) {
      if (old_transactions[x].account_id === this.state.new_entry.account_id) {
        old_transactions[x].balance = this.state.new_entry.balance;
        old_transactions[x].amount = this.state.new_entry.amount;

        found = true;
        break;
      }
    }
    this.setState({ transactions: old_transactions });

    if (!found) {
      const updated_transactions = this.state.transactions;
      updated_transactions.unshift(this.state.new_entry);
      this.setState({ transactions: updated_transactions });
    }
  }

  handleSubmit = (e) => {                        // Form handler
    e.preventDefault();
    const errors = [];
    if (
      this.state.account_id === "" ||
      !/^[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}$/.test(
        this.state.account_id
      )
    ) {
      errors.account_id = true;
      this.setState({ inputErrors: errors });
    } else if (this.state.amount === "" || isNaN(this.state.amount)) {
      errors.amount = true;
      this.setState({ inputErrors: errors });
    } else if (!this.state.inputErrors.length) {
    //  console.log("submitted");

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_id: this.state.account_id,
          amount: this.state.amount,
        }),
      };

      fetch("http://127.0.0.1:5000/amount", requestOptions)    // Post request to create transaction
        .then((response) => response.json())
        .then((res1) => {
          const data = [];
          data.balance = parseInt(res1.balance);
          data.amount = parseInt(this.state.amount);
          data.account_id = this.state.account_id;
          this.setState({
            new_entry: data,
            amount: "",
            account_id: "",
            inputErrors: {},
          });
          this.syncData();
        });
    }

    return false;
  };

  render() {
    const { inputErrors } = this.state;

    return (
      <div className="App">
       {/* Route [/] */}
        <Route exact path="/" render={(props) => (                          
            <Fragment>
              <h3 className="heading center">Account Management App</h3>
              <h4 className="sub-heading center">Submit new transaction</h4>
              <form data-type="transaction-form" onSubmit={this.handleSubmit.bind(this)}>    {/* Form to create transaction starts */}
              
                <div className="form-input-group">
                  <label htmlFor="account_id">Account Id:</label>
                  <input type="input" data-type="account-id" name="account_id" value={this.state.account_id}
                    onChange={this.changeHandler} className={classnames("form-control", {
                      error: inputErrors.account_id,})}/>
                </div>
                <div className="form-input-group">
                  <label htmlFor="amount">Amount:</label>
                  <input type="input" name="amount" data-type="amount" value={this.state.amount}
                    onChange={this.changeHandler}
                    className={classnames("form-control", {
                      error: inputErrors.amount,
                    })}
                  />
                </div>
                <button type="submit" className="btn default"> Submit</button>
              </form>                                                            {/* Form ends here */}

              <h4 className="sub-heading center">
                Recently submitted transactions
              </h4>
              <TransactionList data={this.state.transactions} />  {/* TransactionList module used here*/}
            </Fragment>
          )}/>
      </div>
    );
  }
}

export default App;
