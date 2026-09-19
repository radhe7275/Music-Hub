
//    SHYAMHUB MUSIC PLAYER
  



const API_URL = "https://YOUR-SHYAMHUB-API-URL.com/songs";


let songs = [];

let currentSongIndex = 0;

let isPlaying = false;

const audio = document.getElementById("audioPlayer");


/*   DEMO SONG DATA  */

const demoSongs = [

    {
        title: "Dreams",
        artist: "ShyamHub Artist",
        image: "https://picsum.photos/500?random=101",
        audio: "song/14h.mp3"
    },

    {
        title: "Night Vibes",
        artist: "Shyam Music",
        image: "https://picsum.photos/500?random=102",
        audio: "song/15h.mp3"
    },

    {
        title: "Summer Beat",
        artist: "Music World",
        image: "https://picsum.photos/500?random=103",
        audio: "song/16h.mp3"
    },

    {
        title: "Love Story",
        artist: "Shyam Artist",
        image: "https://picsum.photos/500?random=104",
        audio: "song/17h.mp3"
    },
    {
        title: "Chill Zone",
        artist: "Lo-Fi Artist",
        image: "https://picsum.photos/500?random=105",
        audio: "song/11h.mp3"
    },

    {
        title: "Party Time",
        artist: "DJ Shyam",
        image: "https://picsum.photos/500?random=106",
        audio: "song/enjoy.mp3"
    }

];



/*  LOAD SONGS  */


async function loadSongs() {

    const container =
        document.getElementById("songsContainer");

    container.innerHTML = `
        <div class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Loading...
        </div>
    `;


    try {



        if (
            API_URL.includes("YOUR-SHYAMHUB")
        ) {

            songs = demoSongs;

        } else {

            const response =
                await fetch(API_URL);

            if (!response.ok) {
                throw new Error("API Error");
            }

            const data =
                await response.json();




            songs =
                data.songs ||
                data.data ||
                data.results ||
                data;

        }


        displaySongs(songs);

    } catch (error) {

        console.error(error);

        songs = demoSongs;

        displaySongs(songs);

    }

}


/* 
   DISPLAY SONGS
 */

function displaySongs(songList) {

    const container =
        document.getElementById("songsContainer");


    if (!songList || songList.length === 0) {

        container.innerHTML =
            "<p>No songs found.</p>";

        return;
    }


    container.innerHTML = "";


    songList.forEach((song, index) => {

        const title =
            song.title ||
            song.name ||
            `Song ${index + 1}`;

        const artist =
            song.artist ||
            song.artist_name ||
            song.singer ||
            "Unknown Artist";

        const image =
            song.image ||
            song.cover ||
            song.thumbnail ||
            `https://picsum.photos/500?random=${index + 200}`;

        const card =
            document.createElement("div");

        card.className = "song-card";


        card.innerHTML = `

            <img src="${image}" alt="${title}">

            <button class="play-small"
                onclick="playSong(${index})">

                <i class="fa-solid fa-play"></i>

            </button>

            <h3>${title}</h3>

            <p>${artist}</p>

        `;


        card.addEventListener("click", function (e) {

            if (
                !e.target.closest(".play-small")
            ) {

                playSong(index);

            }

        });


        container.appendChild(card);

    });

}


/* 
   PLAY SONG
    */

function playSong(index) {

    if (!songs[index]) return;


    currentSongIndex = index;


    const song = songs[index];


    const title =
        song.title ||
        song.name ||
        "Unknown Song";

    const artist =
        song.artist ||
        song.artist_name ||
        song.singer ||
        "Unknown Artist";

    const image =
        song.image ||
        song.cover ||
        song.thumbnail ||
        "https://picsum.photos/500";


    const audioUrl =
        song.audio ||
        song.audio_url ||
        song.url ||
        song.download_url;


    document.getElementById("playerTitle")
        .textContent = title;


    document.getElementById("playerArtist")
        .textContent = artist;


    document.getElementById("playerImage")
        .src = image;


    if (!audioUrl) {

        alert(
            "Is song ka audio URL API response me nahi mila."
        );

        return;

    }


    audio.src = audioUrl;


    audio.play()
        .then(() => {

            isPlaying = true;

            updatePlayButton();

        })
        .catch(error => {

            console.log(error);

        });

}


/* 
   PLAY / PAUSE
    */

function togglePlay() {

    if (!audio.src) {

        playSong(0);

        return;

    }


    if (isPlaying) {

        audio.pause();

        isPlaying = false;

    } else {

        audio.play();

        isPlaying = true;

    }


    updatePlayButton();

}


function updatePlayButton() {

    const icon =
        document.getElementById("playIcon");


    if (isPlaying) {

        icon.className =
            "fa-solid fa-pause";

    } else {

        icon.className =
            "fa-solid fa-play";

    }

}


/*
   NEXT
    */

function nextSong() {

    if (songs.length === 0) return;


    currentSongIndex++;


    if (
        currentSongIndex >= songs.length
    ) {

        currentSongIndex = 0;

    }


    playSong(currentSongIndex);

}


/*
   PREVIOUS
    */

function previousSong() {

    if (songs.length === 0) return;


    currentSongIndex--;


    if (currentSongIndex < 0) {

        currentSongIndex =
            songs.length - 1;

    }


    playSong(currentSongIndex);

}


/* 
   AUTO NEXT
   */

audio.addEventListener("ended", function () {

    nextSong();

});


/*
   PROGRESS
 */

audio.addEventListener("timeupdate", function () {

    if (!audio.duration) return;


    const percentage =
        (audio.currentTime /
            audio.duration) * 100;


    document.getElementById("progressBar")
        .value = percentage;


    document.getElementById("currentTime")
        .textContent =
        formatTime(audio.currentTime);


    document.getElementById("duration")
        .textContent =
        formatTime(audio.duration);

});


function changeProgress() {

    if (!audio.duration) return;


    const value =
        document.getElementById("progressBar")
            .value;


    audio.currentTime =
        (value / 100) * audio.duration;

}


function formatTime(seconds) {

    if (isNaN(seconds)) return "0:00";


    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);


    return `${minutes}:${secs
        .toString()
        .padStart(2, "0")}`;

}


/*
   VOLUME
   */

function changeVolume() {

    const volume =
        document.getElementById("volumeBar")
            .value;


    audio.volume = volume;

}


/* 
   SEARCH
 */

function searchSongs() {

    const query =
        document.getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    if (!query) {

        displaySongs(songs);

        return;

    }


    const filtered =
        songs.filter(song => {

            const title =
                (
                    song.title ||
                    song.name ||
                    ""
                ).toLowerCase();


            const artist =
                (
                    song.artist ||
                    song.artist_name ||
                    song.singer ||
                    ""
                ).toLowerCase();


            return (
                title.includes(query) ||
                artist.includes(query)
            );

        });


    displaySongs(filtered);

}


/*
   LIKE
   */

function toggleLike() {

    const icon =
        document.getElementById("likeIcon");


    if (
        icon.classList.contains(
            "fa-regular"
        )
    ) {

        icon.className =
            "fa-solid fa-heart";

        icon.style.color =
            "#1ed760";

    } else {

        icon.className =
            "fa-regular fa-heart";

        icon.style.color =
            "white";

    }

}


/* 
   FEATURED PLAY
  */

function playFeatured() {

    if (songs.length > 0) {

        playSong(0);

    }

}


/* 
   LOGIN
  */

function openLogin() {

    document.getElementById("loginModal")
        .style.display = "flex";

}


function closeLogin() {

    document.getElementById("loginModal")
        .style.display = "none";

}


function loginUser() {

    const email =
        document.getElementById("loginEmail")
            .value.trim();

    const phone =
        document.getElementById("loginPhone")
            .value.trim();

    const password =
        document.getElementById("loginPassword")
            .value;


    if (!email && !phone) {

        alert(
            "Gmail/Email ya phone number enter karo."
        );

        return;

    }


    if (!password) {

        alert("Password enter karo.");

        return;

    }


    /*
       Ye demo login hai.

       Real login ke liye backend/Firebase
       authentication connect karna hoga.
    */

    alert("Login successful!");

    closeLogin();

}


/* 
   GOOGLE LOGIN
    */

function googleLogin() {

    alert(
        "Google Login ke liye Firebase Authentication connect karo."
    );

}


/* 
   SIGNUP
    */

function openSignup() {

    document.getElementById("signupModal")
        .style.display = "flex";

}


function closeSignup() {

    document.getElementById("signupModal")
        .style.display = "none";

}


function signupUser() {

    const name =
        document.getElementById("signupName")
            .value.trim();

    const email =
        document.getElementById("signupEmail")
            .value.trim();

    const phone =
        document.getElementById("signupPhone")
            .value.trim();

    const password =
        document.getElementById("signupPassword")
            .value;


    if (!name ||
        (!email && !phone) ||
        !password) {

        alert(
            "Please complete all required fields."
        );

        return;

    }


    alert(
        "Account created successfully!"
    );

    closeSignup();

}


/*
   SWITCH AUTH
   */

function switchToSignup() {

    closeLogin();

    openSignup();

}


function switchToLogin() {

    closeSignup();

    openLogin();

}


/*
   PLAYLIST
  */

function createPlaylist() {

    const name =
        prompt("Playlist ka naam enter karo:");

    if (name) {

        alert(
            `"${name}" playlist create ho gayi.`
        );

    }

}


/*
   START APP
   */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        audio.volume = 0.8;

        loadSongs();

    }
);