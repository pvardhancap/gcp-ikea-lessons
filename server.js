const express = require('express');
const crypto = require('crypto');

const app = express();
app.set('trust proxy', true);

const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

const getCustomers = () => {
    const query = datastore.createQuery('Customers');
    console.log(' >>> DB Process : getCustomers ' );
    return datastore.runQuery(query);
};

const getCustomerById = (sn) => {
    const query = datastore.createQuery('Customers').filter('sn',parseInt(sn));
    
    console.log(' >>> DB Process : getCustomerById : param : ' , sn);
   
    return datastore.runQuery(query);
};

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

app.get('/customers', async (req, res, next) => {

    try{
    const [records] = await getCustomers();
    console.log(' >>> Data Length :' , records.length);
    res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(records)
        .end();
    } catch(error) {
      console.log(' >>> ERROR : ' , error);
        next(error);
    }

  });

  app.get('/customer/:id', async (req, res, next) => {

    try{
    const [records] = await getCustomerById(req.params.id);
    console.log(' >>> Data Length :' , records.length);
    res
        .status(200)
        .set('Content-Type', 'application/json')
        .send(records)
        .end();
    } catch(error) {
      console.log(' >>> ERROR : ' , error);
        next(error);
    }

  });
  

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});