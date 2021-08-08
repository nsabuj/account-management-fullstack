import React, { Component, Fragment } from "react";

class TransactionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    const formatPrice = (price) => {
      var isNegative = price < 0 ? "-" : "";
      return isNegative + "$" + Math.abs(price.toFixed(0));
    };
    return (
      <Fragment>
        <ul className="transaction-list">
          {" "}
          {/* list start here */}
          {this.props.data.map(function (transaction, i) {       /* Iteration of the transactions */            
            const trans_type = transaction.amount > -1
                ? "Transferred " + formatPrice(transaction.amount)
                : "Withdrew " + formatPrice(transaction.amount);

            return (
              <li className="transaction-single" key={i}
                data-type="transaction"
                data-amount={transaction.amount}
                data-account-id={transaction.account_id}
                data-balance={transaction.balance}>
                <p>
                  <span className="trans-type">{trans_type} </span>
                  {transaction.amount > 0 ? " to " : " from "}{" "}
                  <span className="account">{transaction.account_id}</span>
                </p>
                <p>
                  Current{" "} <span className="account">{transaction.account_id}</span>'s
                  balance is{" "}
                  <span className="balance">
                    {formatPrice(transaction.balance)}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>{" "}
        {/* list ends here */}
      </Fragment>
    );
  }
}

export default TransactionList;
