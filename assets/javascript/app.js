var config = {
    apiKey: "AIzaSyC4jIRnyf_hIFqz-3Jx3OOuQbK2YDrrZmw",
    authDomain: "train-schedule-3986c.firebaseapp.com",
    databaseURL: "https://train-schedule-3986c.firebaseio.com",
    projectId: "train-schedule-3986c",
    storageBucket: "train-schedule-3986c.appspot.com",
    messagingSenderId: "23628934773"
  };
  
  // Get a reference to the database service
  firebase.initializeApp(config);
  // Create a variable to reference the database
  var database = firebase.database();

//on click function to generate new line in table
$("#submit").on("click", function() {
    event.preventDefault();

    //set variable with input from form
    var name = $("#name-input").val().trim()
    var destination = $("#destination-input").val().trim()
    var firstTime = $("#time-input").val().trim()
    var frequency = $("#frequency-input").val().trim()

    //add values to database
    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      })
})

//listening event when data changes in database. undates html
database.ref().on("child_added", function(childSnapshot){

    //console log values from database
    console.log(childSnapshot.val())
    console.log(childSnapshot.val().name)
    console.log(childSnapshot.val().destination)
    console.log(childSnapshot.val().firstTime)
    console.log(childSnapshot.val().frequency)

    //variables for time manipulation
    var frequency = childSnapshot.val().frequency

    var firstTime = childSnapshot.val().firstTime

    //convert time to one year previously
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted)

    //get current time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    //calculate difference between first arrival time and current time
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime)

    //calculate remainder of time between the difference and frequency
    var remainder = diffTime % frequency
    console.log(remainder);

    //calculate minutes until the next train
    var minutesTillTrain = frequency - remainder;
    console.log("MINUTES TILL TRAIN: " + minutesTillTrain)

    //calculate time of next train
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    //update html with new line in table
    var newLine = $("<tr>")

    var newName = $("<td>").text(childSnapshot.val().name)
    var newDestination = $("<td>").text(childSnapshot.val().destination)
    var newFrequency = $("<td>").text(frequency)
    var newNextTrain = $("<td>").text(moment(nextTrain).format("hh:mm"))
    var newMinutesTillTrain = $("<td>").text(minutesTillTrain)

    newLine.append(newName)
    newLine.append(newDestination)
    newLine.append(newFrequency)
    newLine.append(newNextTrain)
    newLine.append(newMinutesTillTrain)

    $("#schedule-table-body").append(newLine)

    //clear search fields
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
})