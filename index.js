/*globals require, console, process */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Assignment = require('./assignment');

// instantiate express
const app = express();

// instantiate mongoose
mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    user: 'admin',
    pass: 'admin'
  };
mongoose.connect('mongodb://admin:admin@ds235827.mlab.com:35827/exam', options);
const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;


// get an instance of the express Router
var router = express.Router();

// route /bears
router.route('/assignment')

    // create a bear
    // accessed at POST http://localhost:8080/api/bears
    .post(function (req, res) {
        // create a new instance of the Bear model
        var assignment =  new Assignment();
        // set the bears name (comes from the request)
        assignment.taskID = req.body.taskID;
        assignment.assignmentID = req.body.assignmentID;
        assignment.workerID = req.body.workerID;
        assignment.assignmentResult = req.body.assignmentResult;
        // save the bear and check for errors
        assignment.save(function (err) {
            if (err) { res.send(err); }
            res.json(assignment);
        });

    })

    // get all the assignment
    // accessed at GET http://localhost:8080/api/assignment
    .get(function (req, res) {
        Assignment.find(function (err, assignment) {
            if (err) { res.send(err); }
            res.json(assignment);
        });
    });

// route /bears/bear
router.route('/assignment/:assignmentID')
    // get the assignment with that id
    // (accessed at GET http://localhost:8080/api/assignment/:assignment_id)
    .get(function (req, res) {
        Assignment.find({assignmentID: req.params.assignmentID}, function (err, assignment) {
            if (err) { res.send(err); }
            res.json(assignment);
        });
    })

    // update the assignment with this id
    // (accessed at PUT http://localhost:8080/api/assignment/:assignmentID)
    .put(function (req, res) {

        // use our assignment model to find the bear we want
        Assignment.find({assignmentID:req.params.assignmentID}, function (err, assignment) {
            if (err) { res.send(err); }
            // update the assignment info

            //for(var i = 0; i < assignment.lenght; i++){
            //zero in quanto potrebbe ritornarmi più di una cosa e quindi devo vedere tutti i risultati, metto
            //zero perchè so che ritorna teoricamente qualcosa che dovrebbe essere univoco
              assignment[0].assignmentResult = req.body.assignmentResult;
            // save the assignment
              assignment[0].save(function (err) {
                  if (err) { res.send(err); }
                  res.json(assignment);
                });


        });
    })

    // delete the assignment with this id
    // (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function (req, res) {
        Assignment.remove({
            assignmentID: req.params.assignmentID
        }, function (err, bear) {
            if (err) { res.send(err); }
            res.json({ message: 'Successfully deleted' });
        });
    });


// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

// register our router on /api
app.use('/api', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});


app.listen(port);
console.log('Magic happens on port ' + port);
