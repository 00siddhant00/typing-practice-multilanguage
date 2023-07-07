const testItem = document.getElementById("textDisplay");
const inputItem = document.getElementById("textInput");
const timeName = document.getElementById("timeName");
const time = document.getElementById("time");
const cwName = document.getElementById("cwName");
const cw = document.getElementById("cw");
const restartBtn = document.getElementById("restartBtn");
const thirty = document.getElementById("thirty");
const sixty = document.getElementById("sixty");
const beg = document.getElementById("beg");
const pro = document.getElementById("pro");

var wordNo = 1;
var wordsSubmitted = 0;
var wordsCorrect = 0;
var timer = 30;
var flag=0;
var factor=2;
var seconds;
var difficulty=1;

displayTest(difficulty);

//on Input
inputItem.addEventListener('input', function(event){
  if(flag===0){
    flag=1;
    timeStart();
  }
  var charEntered = event.data;
  if(/\s/g.test(charEntered)){  //check if the character entered is a whitespace
    checkWord();
  }
  else{
    currentWord();
  }
});

//time selection
thirty.addEventListener("click",function(){
  timer = 30;
  factor = 2;
  limitColor(thirty,sixty);
  time.innerText = timer;
});
sixty.addEventListener("click",function(){
  timer = 60;
  factor = 1;
  limitColor(sixty, thirty);
  time.innerText = timer;
});

//difficulty Selection
beg.addEventListener("click",function(){
  difficulty = 1;
  displayTest(difficulty);
  limitColor(beg,pro);
});
pro.addEventListener("click",function(){
  difficulty = 2;
  displayTest(difficulty);
  limitColor(pro,beg);
});

//set the color of time and difficulty
function limitColor(itema,itemr ){
  itema.classList.add('yellow');
  itemr.classList.remove('yellow');
}

document.getElementById('setCustomTime').addEventListener('click', function() {
  var customTime = document.getElementById('customTime').value;
  // Here you can set your timer with the customTime
  // Make sure to convert it to a number
  timer = Number(customTime);
  timeLeft = timer;
  document.getElementById('time').innerText = timeLeft;
});


//restart the Test
restartBtn.addEventListener("click",function(){

  wordsSubmitted = 0;
  wordsCorrect = 0;
  flag=0;

  time.classList.remove("current");
  cw.classList.remove("current");
  time.innerText = timer;
  timeName.innerText = "Time";
  cw.innerText = wordsCorrect;
  cwName.innerText = "CW";
  inputItem.disabled = false;
  inputItem.value = '';
  inputItem.focus();

  displayTest(difficulty);
  clearInterval(seconds);
  limitVisible();
});

//start the timer countdown
function timeStart(){
  limitInvisible();
  seconds = setInterval(function() {
    time.innerText--;
    if (time.innerText == "-1") {
        timeOver();
        clearInterval(seconds);
    }
  }, 1000);
}

//diable textarea and wait for restart
function timeOver(){
  inputItem.disabled = true;
  restartBtn.focus();

  displayScore();
}

//set Limit visibility
function limitVisible(){
  thirty.style.visibility = 'visible';
  sixty.style.visibility = 'visible';
  beg.style.visibility = 'visible';
  pro.style.visibility = 'visible';
}
function limitInvisible(){
  thirty.style.visibility = 'hidden';
  sixty.style.visibility = 'hidden';
  beg.style.visibility = 'hidden';
  pro.style.visibility = 'hidden';
}

//display the score
function displayScore(){
  let percentageAcc = 0;
  if(wordsSubmitted!==0){
    percentageAcc = Math.floor((wordsCorrect/wordsSubmitted)*100);
  }

  time.classList.add("current");
  cw.classList.add("current");

  time.innerText = percentageAcc+"%";
  timeName.innerText = "PA";

  cw.innerText = factor*wordsCorrect;
  cwName.innerText = "WPM";
}

//check if the user is entering correcrt word
function currentWord(){
  const wordEntered = inputItem.value;
  const currentID = "word "+wordNo;
  const currentSpan = document.getElementById(currentID);
  const curSpanWord = currentSpan.innerText;

  if(wordEntered == curSpanWord.substring(0,wordEntered.length)){
    colorSpan(currentID, 2);
  }
  else{
    colorSpan(currentID, 3);
  }

}
//checks word entered
function checkWord(){
  const wordEntered = inputItem.value.trim();
  inputItem.value='';

  const wordID = "word "+wordNo;
  const checkSpan = document.getElementById(wordID);
  wordNo++;
  wordsSubmitted++;

  const isEndOfSentence = (checkSpan.nextSibling === null || checkSpan.nextSibling.tagName !== "SPAN");

  if(checkSpan.innerText === wordEntered && isEndOfSentence){
    colorSpan(wordID, 1);
    wordsCorrect++;
    cw.innerText=wordsCorrect;
  }
  else{
    colorSpan(wordID, 3);
  }

  if(wordNo>wordIndex-1){ //Update this condition with wordIndex

    displayTest(difficulty);
  }
  else{
    const nextID = "word "+wordNo;
    colorSpan(nextID, 2);
  }
}


//color the words
function colorSpan(id, color){
  const span = document.getElementById(id);
  if(color === 1 ){
    span.classList.remove('wrong');
    span.classList.remove('current');
    span.classList.add('correct');
  }
  else if(color ===2){
    span.classList.remove('correct');
    span.classList.remove('wrong');
    span.classList.add('current');
  }
  else{
    span.classList.remove('correct');
    span.classList.remove('current');
    span.classList.add('wrong');
  }
}

//display the random words on screen
function displayTest(diff){
  wordNo = 1;
  testItem.innerHTML = '';

  let newTest = randomSentences(diff);
  let wordIndex = 1;
  newTest.forEach(function(sentence){
    let words = sentence.split(" ");
    words.forEach(function(word){
      let wordSpan = document.createElement('span');
      wordSpan.innerText = word;
      wordSpan.setAttribute("id", "word " + wordIndex);
      testItem.appendChild(wordSpan);
      wordIndex++;
      // Add space after each word except the last
      if (word !== words[words.length - 1]) {
        testItem.innerHTML += " ";
      }
    });
    // Add line break after each sentence
    testItem.innerHTML += "<br/>";
  });

  const nextID = "word "+wordNo;
  colorSpan(nextID, 2);
}

//Generate an array of 5 random sentences
function randomSentences(diff){
  var basicSentencesMarathi = [
    "माझं नाव सागर आहे.", 
    "तो विद्यालयाला जातो.", 
    "माझी मित्रा मला मदत करते.", 
    "आज हवामान छान आहे.", 
    "मी जेवण खाल्लाय."
  ];
  
  var topSentencesMarathi = [
    "ही पुस्तक माझी आहे.", 
    "माझी मांजर मला प्रेम करते.", 
    "मी त्याला दूरध्वनी केली.", 
    "ती गाणं गा राहते.", 
    "मला काही समजून येत नाही."
  ];
  
  var sentenceArray = basicSentencesMarathi;

  if(diff == 2){
    sentenceArray = topSentencesMarathi;
  }

  var selectedSentences = [];
  for(var i = 0; i < 5; i++){ // Only select 5 sentences
    var randomNumber = Math.floor(Math.random() * sentenceArray.length);
    selectedSentences.push(sentenceArray[randomNumber]);
    sentenceArray.splice(randomNumber, 1); // Remove the selected sentence from the sentenceArray to avoid repetitions
  }
  return selectedSentences;
}

const themeSwitch = document.querySelector('#checkbox');
const body = document.getElementsByTagName('BODY')[0];

themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    body.style.background = '#c9e4f0'; // A softer white color
    body.style.color = '#333333'; // A dark grey color instead of black
    // Change purple text to sky blue
    document.querySelectorAll('.accent').forEach(function(el){
        el.style.color = '#87ceeb';
    });

    // Change the .limit and .text-input background and color
    document.querySelectorAll('.limit input[type="number"], .limit button, .text-input').forEach(function(el){
        el.style.background = '#ffffff'; // Or whatever color you want for the background
        el.style.color = '#333333'; // Or whatever color you want for the text
    });

  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    body.style.background = '#212121';
    body.style.color = '#eeeeee';
    // Change sky blue text back to purple
    document.querySelectorAll('.accent').forEach(function(el){
        el.style.color = '#d69dec';
    });
    
    // Reset the .limit and .text-input background and color
    document.querySelectorAll('.limit input[type="number"], .limit button, .text-input').forEach(function(el){
        el.style.background = '#212121'; 
        el.style.color = '#eeeeee'; 
    });
  }    
});

// To keep the user's preference on page reload
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null
