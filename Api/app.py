#Load libraries
from flask import Flask, jsonify, request
from flask_cors import CORS
import controller.Transaction as ts
from database import get_db,create_tables
from flask import abort
from uuid import UUID
from werkzeug.exceptions import HTTPException
app = Flask(__name__)                                     ### creating a flask object
CORS(app)                                                 ### initializing cors for all routes


@app.route('/ping', methods=["GET"])                       ### End point for fetching server status
def server_status():
    return jsonify({'success':True})


@app.route('/', methods=["GET"])                          ### Endpoint for fetching all transactions
def get_transaction_list():
    result=ts.get_transactions()
    transactions=[]
    for data in result:
        transaction={}
        transaction['account_id']=data[0]
        transaction['amount']=data[1]
        transaction['balance']=data[2]
        transactions.append(transaction)
    return jsonify({"transactions":transactions}) 

@app.route("/amount", methods=["POST"])                     ### Endpoint for creating transaction
def insert_transaction():
    if not request.is_json:
        msg = f"Specified content type not allowed."
        return jsonify(error=msg), 415
    else:    
        trsansaction_details = request.get_json()
        try:
            amount = int(trsansaction_details["amount"])
            trans_id = trsansaction_details["account_id"]
            if amount is not None and len(trans_id)>31:    
                ts.insert_transaction(trans_id, amount)
                balance=ts.get_balance(trans_id)
                return jsonify({"balance":balance}),200
            else:    
                msg = f"Mandatory body parameters missing or have incorrect type"
                return jsonify(error=msg), 400    
        except:
            msg = f"Mandatory body parameters missing or have incorrect type"
            return jsonify(error=msg), 400
   


@app.route("/balance/<id>", methods=["GET"])                ### Endpoint for checking balance
def get_balance(id):
    result = ts.get_balance(id)
    if(result):
        return jsonify({"balance":int(result[0])}), 200

    abort(404)
     
@app.errorhandler(404)                                       ### handler for Page not found error
def page_not_found(e):
    msg = f"The requested URL path {request.path} was not found on the server."
    return jsonify(error=msg), 404
    

@app.errorhandler(405)                                     ### handler for invalid http methods
def method_not_allowed(e):
    msg=f"Specified HTTP method not allowed."
    return jsonify(error=msg), 405    

if __name__ == '__main__':
    create_tables()                                         ### Schemas initializer if doesn't exist
    app.run(debug=True)                                     ### Running the app in main
