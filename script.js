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

    console.log("Playlist:", playlist);

    getDurations();

});
function getDurations(){

    let loaded = 0;


    playlist.forEach((song, index) => {

        let audioTest = new Audio();

        audioTest.src = song.url;


        audioTest.addEventListener("loadedmetadata", function(){

            durations[index] = audioTest.duration;

            loaded++;


            if(loaded === playlist.length){

                loadSong();

            }

        });

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


    let position = elapsed;


    for(let i = 0; i < playlist.length; i++){

        if(position < durations[i]){

    console.log("Hraje skladba:", i, "čas:", position);

    return {
        songIndex: i,
        time: position
    };

}


        position -= durations[i];

    }


    return {
        songIndex: 0,
        time: 0
    };

}

playButton.onclick = function(){

    if(durations.length === 0){

        alert("Rádio se ještě načítá, zkus to za chvíli.");

        return;

    }


    const position = getBroadcastPosition();


    if(position === null){

        alert("Vysílání ještě nezačalo.");

        return;

    }


   currentSong = position.songIndex;

console.log("Vybraná skladba:", currentSong);

audio.src = playlist[currentSong].url;

audio.onloadedmetadata = function(){

    const currentPosition = position.time;


    console.log("Hraje skladba:", currentSong);
    console.log("Startuji na:", currentPosition);


    audio.currentTime = currentPosition;


    audio.play();

};
    audio.onended = function(){

    currentSong++;

    if(currentSong >= playlist.length){

        currentSong = 0;

    }

    loadSong();

    audio.play();

};
};
