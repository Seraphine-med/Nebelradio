const audio = document.getElementById("audio");

const playButton = document.getElementById("play");

const songText = document.getElementById("song");

const timeText = document.getElementById("time");


let playlist = [];

let currentSong = 0;


// čas začátku vysílání

const broadcastStart = new Date("2026-07-23T17:55:00");



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

    const now = new Date();

    let elapsed =
    (now - broadcastStart) / 1000;


    if(elapsed < 0){

        return null;

    }


    let position = elapsed;


    for(let i = 0; i < playlist.length; i++){

        if(position < playlist[i].duration){

            return {

                songIndex:i,

                time:position

            };

        }


        position -= playlist[i].duration;

    }


    return null;

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
