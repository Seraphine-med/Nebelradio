const audio = document.getElementById("audio");

const playButton = document.getElementById("play");

const songText = document.getElementById("song");

const timeText = document.getElementById("time");


let playlist = [];

let currentSong = 0;

let durations = [];


// čas začátku vysílání

const broadcastStart = new Date(Date.now() - 10000);


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


function getBroadcastPosition(){

    const now = new Date();

    const elapsed = (now - broadcastStart) / 1000;


    if(elapsed < 0){

        return null;

    }


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


    audio.src = playlist[currentSong].url;


audio.addEventListener("loadedmetadata", function(){

    console.log("Délka:", audio.duration);
    console.log("Startuji na:", position.time);


    audio.currentTime = Math.min(position.time, audio.duration - 1);


    audio.play();

}, { once: true });


};

   
