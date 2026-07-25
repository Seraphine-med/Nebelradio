const audioA = document.getElementById("audioA");
const audioB = document.getElementById("audioB");
const audios = [audioA, audioB];

const playButton = document.getElementById("play");
const vinyl = document.querySelector(".vinyl");
const volumeControl = document.getElementById("volume");
const muteButton = document.getElementById("mute");
const progressFill = document.getElementById("progress-fill");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");

let playlist = [];
let currentSong = 0;
let activeIndex = 0;
let durations = [];
let durationsReady = false;
let crossfadeStarted = false;

const CROSSFADE_DURATION = 4; // v sekundách, doba prolnutí

let masterVolume = 0.7;
volumeControl.value = masterVolume;
muteButton.innerHTML = "🔊";

// tlačítko je neaktivní, dokud se rádio nenačte
playButton.disabled = true;
playButton.innerHTML = "⏳";

// čas začátku vysílání (automaticky přepočítáno na pražský čas, ať je léto nebo zima)
const startTime = document.body.dataset.start;
const broadcastStart = getPragueBroadcastStart(startTime);

function getPragueOffsetMinutes(date){

    const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Prague',
        hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const parts = dtf.formatToParts(date).reduce((acc, p) => {
        if (p.type !== 'literal') acc[p.type] = p.value;
        return acc;
    }, {});

    const asUTC = Date.UTC(
        parts.year, parts.month - 1, parts.day,
        parts.hour, parts.minute, parts.second
    );

    return (asUTC - date.getTime()) / 60000;

}

function getPragueBroadcastStart(dateTimeStr){

    // vezme zapsaný čas jako "hodiny v Praze" a přepočítá na skutečný univerzální okamžik
    const naiveUTC = new Date(dateTimeStr + "Z").getTime();

    const offsetMinutes = getPragueOffsetMinutes(new Date(naiveUTC));

    return new Date(naiveUTC - offsetMinutes * 60000);

}
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
                onRadioReady();
            }

        });

        audioTest.addEventListener("error", function(){

            console.warn("Nepodařilo se načíst skladbu:", song.url);

            durations[index] = 0;
            loaded++;

            if(loaded === playlist.length){
                onRadioReady();
            }

        });

    });

}

function onRadioReady(){

    durationsReady = true;

    playButton.disabled = false;
    playButton.innerHTML = "▶";

}

function getActiveAudio(){
    return audios[activeIndex];
}

function getInactiveAudio(){
    return audios[1 - activeIndex];
}

function bindActiveAudioEvents(audio){

    audio.onerror = function(){

        console.warn("Chyba přehrávání, přeskakuji na další skladbu.");

        currentSong = (currentSong + 1) % playlist.length;
        playCurrentSong(0);

    };

    audio.onplay = function(){

        vinyl.classList.add("playing");
        playButton.innerHTML = "⏸";

    };

    audio.onpause = function(){

        if(audio === getActiveAudio()){
            vinyl.classList.remove("playing");
            playButton.innerHTML = "▶";
        }

    };

    audio.ontimeupdate = function(){

        if(audio !== getActiveAudio()) return;

        let current = formatTime(audio.currentTime);
        let duration = formatTime(audio.duration);

        currentTimeEl.textContent = current;
        durationTimeEl.textContent = duration;

        if(audio.duration){
            let percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + "%";
        }

        // spustit crossfade těsně před koncem skladby
        if(!crossfadeStarted && audio.duration && (audio.duration - audio.currentTime) <= CROSSFADE_DURATION){
            crossfadeStarted = true;
            startCrossfade();
        }

    };

    audio.onended = function(){

        // pojistka pro případ, že by crossfade z nějakého důvodu neproběhl
        if(!crossfadeStarted){

            const position = getBroadcastPosition();

            if(position){
                currentSong = position.songIndex;
                playCurrentSong(position.time);
            }

        }

    };

}

function playCurrentSong(startTime){

    crossfadeStarted = false;

    const audio = getActiveAudio();
    const song = playlist[currentSong];

    audio.src = song.url;
    audio.load();
    audio.volume = masterVolume;

    bindActiveAudioEvents(audio);

    audio.onloadedmetadata = function(){

        audio.currentTime = Math.min(startTime, audio.duration - 0.1);

        audio.play()
        .catch(error => {
            console.log("Chyba play:", error.name, error.message);
        });

    };

}

function startCrossfade(){

    const outgoing = getActiveAudio();
    const incoming = getInactiveAudio();

    const nextIndex = (currentSong + 1) % playlist.length;
    const nextSong = playlist[nextIndex];

    incoming.src = nextSong.url;
    incoming.load();
    incoming.volume = 0;

    incoming.onloadedmetadata = function(){

        incoming.currentTime = 0;

        incoming.play()
        .catch(error => {
            console.log("Chyba play (crossfade):", error.name, error.message);
        });

    };

    const steps = 30;
    const stepTime = (CROSSFADE_DURATION * 1000) / steps;
    let step = 0;

    const fadeInterval = setInterval(() => {

        step++;

        const progress = step / steps;

        outgoing.volume = Math.max(masterVolume * (1 - progress), 0);
        incoming.volume = Math.min(masterVolume * progress, masterVolume);

        if(step >= steps){

            clearInterval(fadeInterval);

            outgoing.pause();
            outgoing.currentTime = 0;

            activeIndex = 1 - activeIndex;
            currentSong = nextIndex;
            crossfadeStarted = false;

            bindActiveAudioEvents(incoming);

        }

    }, stepTime);

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

    const audio = getActiveAudio();

    // pokud právě hraje, tlačítko funguje jako pauza
    if(!audio.paused){
        audio.pause();
        return;
    }

    if(!durationsReady){
        return; // tlačítko je stejně disabled, tohle je jen pojistka
    }

    const position = getBroadcastPosition();

    if(position === null){
        alert("Vysílání ještě nezačalo.");
        return;
    }

    currentSong = position.songIndex;

    playCurrentSong(position.time);

};

volumeControl.addEventListener("input", function(){

    masterVolume = parseFloat(this.value);

    getActiveAudio().volume = masterVolume;

    if(masterVolume > 0){
        muteButton.innerHTML = "🔊";
    } else {
        muteButton.innerHTML = "🔇";
    }

});

let previousVolume = 0.7;

muteButton.addEventListener("click", function(){

    if(masterVolume > 0){

        previousVolume = masterVolume;
        masterVolume = 0;

        volumeControl.value = 0;
        muteButton.innerHTML = "🔇";

    } else {

        masterVolume = previousVolume;

        volumeControl.value = previousVolume;
        muteButton.innerHTML = "🔊";

    }

    getActiveAudio().volume = masterVolume;

});
