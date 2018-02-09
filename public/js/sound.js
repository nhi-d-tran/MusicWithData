var synthOne = new Tone.Synth({
  oscillator: {   // pick that type of oscillator
    type: 'square8'
  },
  envelope: {
    attack: 0.001, //amount of time to get to maximum volume
    decay: 2,     //during it should be
    sustain: 0    
  }
}).toMaster();      // create instrument, toMaster - connect the variable to where the sound will go (speaker)


// on the client side, all the capability 
var socket = io();

socket.on('note', function(tweetText, userHandle, friendsCount){

// take the tweet on the screen and fetch them together 
var tweetWithHandle = '@' + userHandle + ': ' + tweetText;

if(friendsCount >= 100)
{
  triggerNote('high', tweetWithHandle, synthOne, synthTwo);
}
else
{
  triggerNote('low', tweetWithHandle, synthOne, synthTwo);
}


//2 types of notes that we created : highnote and low note


// print in the console to check if we get the data
console.log(tweetText);

});  // i dont want to get a lot of socket, i want specific socket

var synthTwo = new Tone.MonoSynth({
  oscillator:{
    type: 'fatsawtooth4'
  },
  filter: {
    type: "peaking"
      },
  envelope: {
    attack: 2,    //amount of time to get to maximum volume
    decay: 1,     //during it should be
    sustain: 4,
    release: 16    
  },
  filterEnvelope: {   // filter signal in the same way, we modulate amount of time and introducing higher or lower 
    attack: 2,    //amount of time to get to maximum volume
    decay: 1,     //during it should be
    sustain: 4,
    release: 16,
    baseFrequency: 100,       // frequency of the sound
    octaves: 2,
    exponent: 4
  }
}).toMaster();

synthTwo.triggerAttackRelease('C4', 4, 0);

// synthOne.triggerAttackRelease('C4', 0.5, 0);
// synthOne.triggerAttackRelease('C5', 0.5, 1);
// synthOne.triggerAttackRelease('G5', 0.5, 2);
// synthOne.triggerAttackRelease('A5', 0.5, 3);

var loop = new Tone.Loop(function(time) 
{
    synthOne.triggerAttackRelease('E3', 0.25, time);
    synthOne.triggerAttackRelease('C5', 0.25, time + 1);
    synthOne.triggerAttackRelease('A8', 0.25, time + 2);
});   //accept the callback function 

// loop.start(0);

// will it play?
//trigger the Tone.Loop
//in order to stop the loop Tone.Transport.stop() or loop.stop()
//because Tone.Transport.stop() will kill the loop and cant play again
Tone.Transport.start();


var notes = ['A2', 'C2', 'D2', 'E2', 'G2'];
var tweetCount = 0;


// put the tweet in the screen
// take the data that we want to use to generate sound of tweet to the screen
// receive data and push data in the screen and trigger it 
function triggerNote(type, tweet, _synthOne, _synthTwo){

  // getting tweet position on the page radomally
  var height = Math.floor(Math.random() * 80);
  var width = Math.floor(Math.random() * 50);

  // adding html tags to tweet
  var tweetHtml = '<div class="tweet" id="' + tweetCount + '" style="top:' + height + 'vh; left:' + width + 'vw"><p>' + tweet + '</p></div>';

  // coloring the relevant hashtags
  tweetHtml = tweetHtml.replace('#thishashtag', '<span id="hashtag">#thishashtag</span>');

  // getting note randomally
  var note = notes[Math.round(Math.random()*notes.length - 1)];
  console.log(note);

  // playing the note
  // using 'regular' synth
  if (type === 'high') {
    _synthOne.triggerAttackRelease(note, 0.5);

  // using 'rare' synth
  } else {
    _synthTwo.triggerAttackRelease(note, 5);
  }

  // adding the tweet to the page
  $('.container').append(tweetHtml);

  // making tweet disappear gradually
  var id = '#' + tweetCount;

    $(id).delay(500).animate({
      'opacity': 0
    }, 4000, function(){
      $(id).remove();
    });


  // incrementing tweetCount
  tweetCount++;

}
