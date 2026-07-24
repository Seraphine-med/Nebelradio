const audio = document.getElementById("audio");

const playButton = document.getElementById("play");

const vinyl = document.querySelector(".vinyl");

const volumeControl = document.getElementById("volume");

const muteButton = document.getElementById("mute");

const progressFill = document.getElementById("progress-fill");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");


let playlist = [];

let currentSong = 0;

audio.volume = 0.7;

volumeControl.value = 0.7;

muteButton.innerHTML = "🔊";

let durations = [];

let durationsReady = false;


// čas začátku vysílání
const startTime = document.body.dataset.start;
const broadcastStart = new Date(startTime);

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

    durationsReady = true;
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
        playButton.innerHTML = "⏸";

    };

    audio.onpause = function(){

        vinyl.classList.remove("playing");
        playButton.innerHTML = "▶";

    };
    
    audio.ontimeupdate = function(){

    let current = formatTime(audio.currentTime);
    let duration = formatTime(audio.duration);

    currentTimeEl.textContent = current;
    durationTimeEl.textContent = duration;

    if(audio.duration){
        let percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + "%";
    }

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

    // pokud právě hraje, tlačítko funguje jako pauza
    if(!audio.paused){
        audio.pause();
        return;
    }

    if(!durationsReady){

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

});
