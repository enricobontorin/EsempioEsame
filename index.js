/*globals require, console, process */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Assignment = require('./assignment');

// instantiate express
const app = express();

// instantiate mongoose
mongoose.Promise = global.Promise;
/*var options = {
    useMongoClient: true,
    user: 'admin',
    pass: 'admin'
  };*/
mongoose.connect('mongodb://admin:admin@ds235827.mlab.com:35827/exam'/*, options*/);
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

    // create a assignment
    // accessed at POST http://localhost:8080/api/assignment
    .post(function (req, res) {
        // create a new instance of the Assignment model
        var assignment =  new Assignment();

        // set the assignment name (comes from the request)
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
            if (err) { res.status(500).send(err); }
            res.json(assignment);
        });
    });

// route /assignment/assignmentID
router.route('/assignment/:assignmentID')
    // get the assignment with that id
    // (accessed at GET http://localhost:8080/api/assignment/:assignmentID)
    .get(function (req, res) {

        Assignment.findOne({assignmentID: req.params.assignmentID}, function (err, assignment) {
            if (err) {
              console.log("err");
                        res.status(500).send(err)
                    }
            if (assignment) {
                  res.status(200);
                  res.json(assignment);

            }
            else {  // In case no assignment was found with the given query
                res.status(404);
                res.json({ message: 'No assignment found' });

            }

        });
    })

    // update the assignment with this id
    // (accessed at PUT http://localhost:8080/api/assignment/:assignmentID)
    .put(function (req, res) {
        // use our assignment model to find the assignment we want
        Assignment.findOne({assignmentID:req.params.assignmentID}, function (err, assignment) {
          if (err) {
                      res.status(500).send(err)
                  }
          if (assignment) {
            assignment.assignmentResult = req.body.assignmentResult;
            // save the assignment
            assignment.save(function (err) {
                if (err) { res.status(500).send(err); }
                res.status(200);
                res.json(assignment);
              });
          } else {  // In case no assignment was found with the given query

              res.status(404);
              res.json({ message: 'No assignment found' });
          }

            //for(var i = 0; i < assignment.lenght; i++){
            //zero in quanto potrebbe ritornarmi più di una cosa e quindi devo vedere tutti i risultati, metto
            //zero perchè so che ritorna teoricamente qualcosa che dovrebbe essere univoco


        });
    })

    // delete the assignment with this id
    // (accessed at DELETE http://localhost:8080/api/assignment/:assignmentID)
    .delete(function (req, res) {
        Assignment.remove({
            assignmentID: req.params.assignmentID
        }, function (err, assignment) {
            if (err) {
              console.log("err");
                        res.status(500).send(err)
                    }
            if (assignment.n != 0) {
                  res.status(200);
                  res.json({ message: 'Successfully deleted' });
                  console.log("ass");
            }
            else {  // In case no assignment was found with the given query
                res.status(404);
                res.json({ message: 'No assignment found' });
                console.log("else");
            }

        });
    });

//prova
router.route('/assignment/findId/:pID')
  .get(function (req, res) {

      Assignment.findById(req.params.pID, function (err, assignment) {
        if (err){
            res.status(500).send(err)
        }
        if (assignment) {
            res.status(200);
            /*
            i try to do something to generate conflict. Ah now i changhe parameters in the query params*/
            res.json(assignment);

        } else {  // In case no assignment was found with the given query
            res.status(404);
            res.json({ message: 'No assignment found' });
        }
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
