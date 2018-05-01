// Prerequisites - first run:
//   npm install
//
// which will look in package.json and install all dependencies
// (e.g., express)
//
// To start the server, run node server.js in Git Bash
// and open the frontend webpage at http://localhost:3000/index.html/

const express = require('express');
const app = express();

// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('data.db');

/**
  The text transcription code for the server. It takes in the sample.mp3 file
  and transcribes it onto a file labled "test".
*/
/** Older guaranteed working code.
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var speech_to_text = new SpeechToTextV1 ({
  username: 'c51d6149-2c60-41d7-ae78-4e824772aa0a',
  password: 'M3auuesFSoXu',
  headers: {
  'X-Watson-Learning-Opt-Out': 'true'
  }
});
var files = ['sample.mp3'];
var params = {
    content_type: 'audio/mp3',
    audio: fs.createReadStream('sample.mp3'),
    'user_token': 'job25',
    timestamps: true
  };

  speech_to_text.createJob(params, function(error, job) {
    if (error)
      console.log('Error:', error);
    else
      console.log('No problems!');
  });

  let latestJobID = undefined;
  speech_to_text.checkJobs(null, (latestJobID = function(error, jobs) {
    if (error)
      console.log('Error:', error);
    else
      //console.log(JSON.stringify(jobs, null, 2));
      console.log('No problems!')
      let idVal = jobs.recognitions[0].id;
      params2 = {};
      params2['id'] = idVal;
      console.log(params2);
      speech_to_text.checkJob(params2, function(error, job) {
        if (error)
          console.log('Error:', error);
        else
          var string = (JSON.stringify(job.results[0].results[0].alternatives[0].transcript, null, 2))
          console.log(string);
          var fs = require('fs');
          fs.writeFile("test", string, function(err) {
          if(err) {
              return console.log(err);
          }
          console.log("The file was saved!");
          speech_to_text.deleteJob(params2, function(error) {
            if (error)
              console.log('Error:', error);
            else {
              console.log('Job Deleted, if errors should occur please remove deleteJob.')
            }
          });
      });
      });
  }));
*/

  //ISSUE: CURRENTLY THE MOST RECENT JOB DISPLAYED IS ONE BEHIND IF ISSUES OCCUR RUN SERVER AGAIN!
  //app.get('/upload', (req, res) => {
    var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1'); //Import Watson TTS Service
    var fs = require('fs'); //For writing text to files
    var speech_to_text = new SpeechToTextV1 ({ //All necessary api verification data
      username: 'c51d6149-2c60-41d7-ae78-4e824772aa0a',
      password: 'M3auuesFSoXu',
      headers: {
      'X-Watson-Learning-Opt-Out': 'true'
      }
    });
    var files = ['audio-file1.flac']; //Audio file to be transcribed
    for(var file in files) { //For loop in case we ever want to transcribe multiple files
    var params = { //Data about the audio file
        content_type: 'audio/flac', //filetype CHANGE TO MP3 if using mp3 files to test
        audio: fs.createReadStream(files[file]), //Creates a stream to read the mp3 file
        //'user_token': 'job25',
        timestamps: true //Provides timestamp info
      };
      speech_to_text.createJob(params, function(error, job) { //Creates a job to read the audio file mentioned above
        if (error)
          console.log('Error:', error);
        else
          console.log('No problems!');
      });
    }
      speech_to_text.checkJobs(null, function(error, jobs) { //Generates the list of all jobs created so far
        if (error)
          console.log('Error:', error);
        else
          console.log('No problems!')
          console.log(JSON.stringify(jobs, null, 2));
          for(let x = 0; x < jobs.recognitions.length; x++){ //For loop that gets the id of every job listed
          let idVal = jobs.recognitions[x].id; //Extracts id from specific job info
          let params2 = {};
          params2['id'] = idVal;
          console.log(params2);
          speech_to_text.checkJob(params2, function(error, job) { //Usus prior job id to get transcript from job
            if (error)
              console.log('Error:', error);
            else
              var string = (JSON.stringify(job.results[0].results[0].alternatives[0].transcript, null, 2)); //Clean data to only show transcript
              console.log(string);
              db.run(
                'INSERT INTO transcripts VALUES ($transcript)', //Insert transcript into the Transcripts table in data.db
                // parameters to SQL query:
                {
                  $transcript: string
                },
                db.each("SELECT transcript FROM transcripts", (err, row) => { //Prints transcripts table for debugging
                    console.log("Inserted: " + row.transcript);
                }));

              var fs = require('fs'); //fs is used to write transcript to file
              fs.writeFile("test.txt", string, function(err) {
              if(err) {
                  return console.log(err);
              }
              console.log("The file was saved with: " + string);
              speech_to_text.deleteJob(params2, function(error) { //Deletes job from list to avoid clutter
                if (error)
                  console.log('Error:', error);
                else {
                  console.log('Job Deleted, if errors should occur please remove deleteJob.')
                }
              });
          });
          });
      }
        });
    //});

// put all of your static files (e.g., HTML, CSS, JS, JPG) in the static_files/
app.use(express.static('static_files'));

/**
    Deprecated Database
const quotes =
{
  "1": {number: "1", content: "You are a trash jungler.", topic: "Swearing"},
  "2": {number: "2", content: "Your brain must be a pea.", topic: "Profanity"},
  "3": {number: "3", content: "Lol, just concede piece of garbage.", topic: "Sarcasm"},
  "4": {number: "4", content: "Hey, just concede with us or I'll report.", topic: "Emphasis"},
  "5": {number: "5", content: "OMG, your gank and gameplay suck.", topic: "Anger"},
  "6": {number: "6", content: "Stop fighting dude.", topic: "Disappointment"},
  "7": {number: "7", content: "Get out of my lane!", topic: "Sadness"},
  "8": {number: "8", content: "Get your CS up.", topic: "Sexual"},
  "9": {number: "9", content: "Use your ult yo.", topic: "Violent"},
  "10": {number: "10", content: "I'll report and find you irl.", topic: "Threat"}
};
*/
/*app.get('/quizQ/', (req, res) => {
  const allQuotes = Object.keys(quotes); // returns a list of object keys
  console.log('The quote is:', allQuotes);
  res.send(allQuotes);
});*/


app.get('/quizQ/:number', (req, res) => {
  const quoteToLookup = req.params.number; // matches ':number' above
  db.all(
   'SELECT * FROM questions_to_contexts WHERE idx=$number',
   // parameters to SQL query:
   {
     $number: quoteToLookup
   },
   (err, rows) => {
     console.log(rows);
     if (rows.length > 0) {
       console.log(rows[0]);
       res.send(rows[0]);
     } else {
       res.send({}); // failed, so return an empty object instead of undefined
     }
   }
)});

/**
app.get('/quizQ/:content', (req, res) => {
  const quoteToLookup = req.params.number; // matches ':number' above
  //const quizData = quotes[quoteToLookup];
  console.log(quoteToLookup, '->', quizData); // for debugging
  if (quizData) {
    res.send(quizData);
  } else {
    console.log("Something's gone wrong on retrieving the topic!")
    res.send({}); // failed, so return an empty object instead of undefined
  }
});
*/
/*const data =
{
  "1": {number: "1", content: "Swearing"},
  "2": {number: "2", content: "Profanity"},
  "3": {number: "3", content: "Sarcasm"},
  "4": {number: "4", content: "Emphasis"},
  "5": {number: "5", content: "Anger"},
  "6": {number: "6", content: "Disappointment"},
  "7": {number: "7", content: "Sadness"},
  "8": {number: "8", content: "Sexual"},
  "9": {number: "9", content: "Violent"},
  "10": {number: "10", content: "Threat"}
};

app.get('/quiz/:number', (req, res) => {
  const nameToLookup = req.params.number; // matches ':number' above
  const val = data[nameToLookup];
  console.log(nameToLookup, '->', val); // for debugging
  if (val) {
    res.send(val);
  } else {
    console.log("Something's gone wrong!")
    res.send({}); // failed, so return an empty object instead of undefined
  }
});*/

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/index.html');
});
