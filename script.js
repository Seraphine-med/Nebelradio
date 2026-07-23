const audio = document.getElementById("audio");

const playButton = document.getElementById("play");

const songText = document.getElementById("song");

const timeText = document.getElementById("time");


let playlist = [];

let currentSong = 0;

let durations = [];


// čas začátku vysílání

const broadcastStart = new Date("2026-07-23T18:00:00");


// načtení playlistu

fetch("playlist.json")

.then(response => response.json())

.then(data => {

    playlist = data;

    getDurations();

});



function getDurations(){

    let audioTest = new Audio();

    audioTest.src = playlist[0].url;


    audioTest.addEventListener("loadedmetadata", function(){

        durations[0] = audioTest.duration;

        loadSong();

    });

}

function loadSong(){

    audio.src = playlist[currentSong].url;


    songText.innerHTML =
    "Now playing: <strong>"
    +
    playlist[currentSong].title
    +
    "</strong>";

}


function getBroadcastPosition(){

    const now = new Date();

    let elapsed = (now - broadcastStart) / 1000;


    if(elapsed < 0){

        return null;

    }


    const songLength = durations[0];


    elapsed = elapsed % songLength;


    return {
        songIndex: 0,
        time: elapsed
    };

}


playButton.onclick = function(){

    const position = getBroadcastPosition();


    if(position === null){

        alert("Vysílání ještě nezačalo.");

        return;

    }


    currentSong = position.songIndex;

loadSong();


audio.addEventListener("loadedmetadata", function(){

    const now = new Date();

    const currentPosition = ((now - broadcastStart) / 1000) % audio.duration;


    console.log("Startuji na:", currentPosition);


    audio.currentTime = currentPosition;


    audio.play();

}, { once: true });
   
