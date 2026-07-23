const audio = document.getElementById("audio");

const playButton = document.getElementById("play");

const songText = document.getElementById("song");

const timeText = document.getElementById("time");


let playlist = [];

let currentSong = 0;

let durations = [];


// čas začátku vysílání

const broadcastStart = new Date(Date.now() - 600000);


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

    return {
        songIndex: 0,
        time: 0
    };

}


playButton.onclick = function(){
    return;
}

    const position = getBroadcastPosition();
    return {
    songIndex: 0,
    time: 0
};


    if(position === null){

        alert("Vysílání ještě nezačalo.");

        return;

    }


    currentSong = position.songIndex;


    loadSong();


    audio.currentTime = position.time;


    audio.play();


};
