import sqlite3
DATABASE_NAME = "alvalab.db"    ### database name albalab


def get_db():
    conn = sqlite3.connect(DATABASE_NAME)
    return conn


def create_tables():
    ### Sql for creating transaction table
    sql1 = """CREATE TABLE IF NOT EXISTS transactions(                         
                account_id UUID ,
                amount REAL NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
            """
    ### Sql for creating account balance table
    sql2 = """CREATE TABLE IF NOT EXISTS account_balance(
                account_id UUID PRIMARY KEY,
                balance REAL NOT NULL
            )
            """   
    ### sql for creating index on account_id in transactions table in order to speed up selection and search 
    sql3=  """CREATE INDEX IF NOT EXISTS transaction_id
           ON transactions (account_id)"""             
    
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute(sql1)
    cursor.execute(sql2)
    cursor.execute(sql3)




