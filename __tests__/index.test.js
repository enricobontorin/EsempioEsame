/**
 * Created by Enrico
 */

const root = process.env.SERVER_URL || 'http://127.0.0.1:8080'
const fetch = require("node-fetch")
const assignmentsRoot = root+'/api/assignment'
const exampleAssignment_post_delete =  {
    "workerID": "wi8",
    "taskID": "task8",
    "assignmentResult": "ar8",
    "assignmentID": "ass8"
}

const exampleAssignment_getOne=  {
    "workerID": "wi4",
    "taskID": "task4",
    "assignmentResult": "ar4",
    "assignmentID": "ass4"
}

const exampleAssignment_getOneErr=  {

    "assignmentID": "ass44"
}

const exampleAssignment_put=  {
    "workerID": "wi3",
    "taskID": "task3",
    "assignmentResult": "ar3",
    "assignmentID": "ass3"
}



// helper methods - you can put these  in a separate file if you have many tests file and want to reuse them

const postAssignment = function (newAssignment) {
    return fetch(assignmentsRoot, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newAssignment)
    })
}

const putAssignment = function (assignmentID, assignmentResult) {
    //console.log(assignmentResult);
    return fetch(assignmentsRoot+'/'+assignmentID, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(assignmentResult)
    })
}

const getOneAssignment = function (assignmentID) {
    return fetch(assignmentsRoot+'/'+assignmentID, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
    })
}
const deleteAssignments = function (assignmentID) {
    return fetch(assignmentsRoot+'/'+assignmentID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }//,
    })
}



/*________TEST_____________*/

test('post', () => {
    return postAssignment(exampleAssignment_post_delete)
        .then(postResponse => {return postResponse.json()})
        .then(postResponseJson => {
            expect(postResponseJson.assignmentID).toEqual(exampleAssignment_post_delete.assignmentID)
          });
});


test('getOneAssignment', () => {
    return getOneAssignment(exampleAssignment_getOne.assignmentID)
        .then(getOneResponse => {return getOneResponse.json()})
        .then(getOneResponseJson => {
            expect(getOneResponseJson.assignmentID).toEqual(exampleAssignment_getOne.assignmentID)
          });
});

test('getOneAssignment Error', () => {
    return getOneAssignment(exampleAssignment_getOneErr.assignmentID)
      .then(getOneResponse => {expect(getOneResponse.status).toBe(404)})
});

test('delete by assignmentID', () => {
    /*return deleteAssignments(exampleAssignment_post_delete.assignmentID)
    .then(deleteResponse => {console.log(deleteResponse.status); return deleteResponse.json()})
    .then(deleteResponseJson => {

        expect(deleteResponseJson.message).toEqual("Successfully deleted")
      });*/
      return deleteAssignments(exampleAssignment_post_delete.assignmentID)
      .then(deleteResponse => {expect(deleteResponse.status).toBe(200)})
});

test('delete not existing element by assignmentID', () => {
    return deleteAssignments({ "assignmentID": "assffrfr9" })
    .then(deleteResponse => {expect(deleteResponse.status).toBe(404)})

});


test('put test', ()=>{
  return putAssignment(exampleAssignment_put.assignmentID, { "assignmentResult" : "ar3" })
      .then(putResponse => {return putResponse.json()})
      .then(putResponseJson => {
          return getOneAssignment(exampleAssignment_put.assignmentID);
      })
      .then(getResponse => {return getResponse.json()})
      .then(getResponseJson => {
          expect(getResponseJson.assignmentResult).toEqual(exampleAssignment_put.assignmentResult)})
      //.catch(e => {console.log(e)})

});
