const audio = document.getElementById("audio");

const playButton = document.getElementById("play");

const timeText = document.getElementById("time");

const vinyl = document.querySelector(".vinyl");

const volumeControl = document.getElementById("volume");

const muteButton = document.getElementById("mute");


let playlist = [];

let currentSong = 0;

audio.volume = 0.7;

volumeControl.value = 0.7;

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
audio.load();
    
}

function playCurrentSong(startTime){

    audio.onloadedmetadata = function(){

        console.log("Audio načteno");
        console.log("Délka:", audio.duration);
        console.log("Start:", startTime);

        audio.currentTime = Math.min(startTime, audio.duration - 0.1);

        audio.play()
        .then(() => {

            console.log("Přehrávání spuštěno");

        })
        .catch(error => {

            console.log("Chyba play:", error.name, error.message);

        });

    };

    audio.onplay = function(){

        vinyl.classList.add("playing");

    };
    
    audio.ontimeupdate = function(){

    let current = formatTime(audio.currentTime);
    let duration = formatTime(audio.duration);

    timeText.innerHTML =
        "Live time: " + current + " / " + duration;

};
    loadSong();

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

function formatTime(seconds){

    if(isNaN(seconds)){
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60);

    let secondsLeft = Math.floor(seconds % 60);


    if(secondsLeft < 10){
        secondsLeft = "0" + secondsLeft;
    }


    return minutes + ":" + secondsLeft;

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

console.log("Klik tlačítko");
console.log("Skladba:", currentSong);
console.log("Čas:", position.time);

playCurrentSong(position.time);


    audio.onended = function(){

        const position = getBroadcastPosition();

        if(position){

            currentSong = position.songIndex;

            playCurrentSong(position.time);

        }

    };

};
volumeControl.addEventListener("input", function(){

    audio.volume = this.value;


    if(audio.volume > 0){

        muteButton.innerHTML = "🔊";

    } else {

        muteButton.innerHTML = "🔇";

    }

});
let previousVolume = 0.7;


muteButton.addEventListener("click", function(){

    if(audio.volume > 0){

        previousVolume = audio.volume;

        audio.volume = 0;

        volumeControl.value = 0;

        muteButton.innerHTML = "🔇";

    } else {

        audio.volume = previousVolume;

        volumeControl.value = previousVolume;

        muteButton.innerHTML = "🔊";

    }
    /* 📱 Mobile version */

@media (max-width: 600px) {


    body {
        padding: 20px;
    }


    .radio {

        width: 100%;
        max-width: 330px;

        padding: 30px 20px;

        border-radius: 20px;

    }


    h1 {

        font-size: 32px;

        letter-spacing: 4px;

    }


    .vinyl {

        width: 180px;
        height: 180px;

        margin: 30px auto;

    }


    .center-label {

        width: 55px;
        height: 55px;

        margin: 62px auto;

        font-size: 18px;

    }


    button {

        font-size: 15px;

        padding: 12px 25px;

    }


    #volume {

        width: 180px;

    }


}
});
