###Documentation

### Back End
** Api (located in Api directory ) **
1. App.py contains all the Routes for the services. App initilizer is also located there.
2. database.py contains the code for connection and creating schema 
3. controller/Transaction.py responsible for all the methods that interact with database and routes like controller  in MVC pattern.
4. Run 'python app.py' or 'flask run' to start the Api
5. UUID version 4 allowed only 
### Front End
** Located in  root directory **
1. App.js contains the front page, all the libraries and files required for the application
2. Only route located in App.js (Didn't make structure for route because of time limitation)
3. TransactionList.jsx contains the iterations of the transactions.

