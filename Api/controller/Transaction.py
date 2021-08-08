### Used core functionalies instead of ORM in order to do SQL queries as described in the requirements

from database import get_db

def get_transactions():                                                                     #Method to get transaction list
    db = get_db()
    if db:
        cursor = db.cursor()

        # query all transactions jointly with balances by decending order based on the created date time #
        query = """
        SELECT transactions.account_id, transactions.amount,account_balance.balance FROM (SELECT * FROM transactions ORDER BY created_at DESC) as transactions LEFT JOIN 
        account_balance ON transactions.account_id=account_balance.account_id GROUP BY transactions.account_id ORDER BY created_at DESC
        """
        cursor.execute(query)
        return cursor.fetchall()
    return []    


def insert_transaction(id, amount):                     #Method takes two arguments as input and insert into transactions table
    db = get_db()
    cursor = db.cursor()
    statement = "INSERT INTO transactions(account_id, amount) VALUES (?, ?)"
    cursor.execute(statement, [id, amount])
    current_balance=get_balance(id) 
    if current_balance is not None:                                                          #Checking if the account is new one
       db.commit()
       updated_balance=int(current_balance[0])+int(amount)
       update_balance(id,updated_balance)
    else:
       statement2 = "INSERT INTO account_balance(account_id, balance) VALUES (?, ?)"  #Intering balance to account_balance schema
       cursor.execute(statement2, [id, amount])
       db.commit()


    return True


def get_balance(id):                                                         #This method will return balance based on account_id 
    db = get_db()
    cursor = db.cursor()
    statement = "SELECT balance FROM account_balance WHERE account_id = ?"               
    cursor.execute(statement,[id])
    return cursor.fetchone()

def update_balance(id, balance):                                                          #Updating balance after evry transaction
    db = get_db()
    cursor = db.cursor()
    statement = "UPDATE account_balance SET balance = ? WHERE account_id = ?"
    cursor.execute(statement,[balance,id])
    db.commit()
    return True

  