const audio = document.getElementById("audio");

const playButton = document.getElementById("play");

const songText = document.getElementById("song");

const timeText = document.getElementById("time");


let playlist = [];

let currentSong = 0;


// čas začátku vysílání

const broadcastStart = new Date(Date.now() - 600000);


// načtení playlistu

fetch("playlist.json")

.then(response => response.json())

.then(data => {

    playlist = data;

    loadSong();

});



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

    return {
        songIndex: 0,
        time: 0
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


    audio.currentTime = position.time;


    audio.play();


};
