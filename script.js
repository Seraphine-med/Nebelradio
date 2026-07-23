const audio = document.getElementById("audio");

const playButton = document.getElementById("play");

const songText = document.getElementById("song");

const timeText = document.getElementById("time");

const vinyl = document.querySelector(".vinyl");


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

    const song = playlist[currentSong];

    audio.src = song.url;

    songText.innerHTML =
        "Now playing: <strong>" +
        song.title +
        "</strong>";

}

function playCurrentSong(startTime){

    loadSong();

    audio.onloadedmetadata = function(){

        audio.currentTime = Math.min(startTime, audio.duration - 0.1);

       audio.play();

audio.onplay = function(){

    vinyl.classList.add("playing");

};

}
function getBroadcastPosition(){

    const now = new Date();

    let elapsed = (now - broadcastStart) / 1000;


    if(elapsed < 0){

        return null;

    }


  const totalDuration =
    durations.reduce((sum, duration) => sum + duration, 0);

if (totalDuration === 0) {
    return null;
}

let position = elapsed % totalDuration;


    for(let i = 0; i < playlist.length; i++){

        if(position < durations[i]){

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


playCurrentSong(position.time);
    
       audio.onended = function(){

        vinyl.classList.remove("playing");

        const position = getBroadcastPosition();

        if(position){

            currentSong = position.songIndex;

            playCurrentSong(position.time);

        }

    };

};
};
