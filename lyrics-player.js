

/* =========================================================
   BIODATA-LINK
   LYRICS PLAYER ENGINE — LRC VERSION
========================================================= */


/* =========================================================
   KONFIGURASI
========================================================= */

const LYRICS_PLAYER_CONFIG = {

  songs: [

    {
      audio: "lyricstime/song4.mp3",
      lyricsFile: "lyricstime/song4.lrc"
    },

    {
      audio: "lyricstime/song5.mp3",
      lyricsFile: "lyricstime/song5.lrc"
    },

    {
      audio: "lyricstime/song6.mp3",
      lyricsFile: "lyricstime/song6.lrc"
    },

    {
      audio: "lyricstime/song7.mp3",
      lyricsFile: "lyricstime/song7.lrc"
    }

  ],

  autoNext: true,

  loopPlaylist: true

};


/* =========================================================
   PLAYER CLASS
========================================================= */

class LyricsPlayer {

  constructor(config) {

    this.config = config;

    this.currentIndex = 0;

    this.audio = new Audio();

    this.audio.preload = "metadata";

    this.isPlaying = false;

    this.currentLyrics = [];

    this.currentLyricIndex = -1;

    this.playButton = null;

    this.lyricsContainer = null;

    this.initialized = false;

  }


  /* =======================================================
     INITIALIZE
  ======================================================= */

  init() {

    this.playButton =
      document.getElementById(
        "musicToggle"
      );
 this.previousButton =
  document.getElementById(
    "previousSong"
  );


 this.nextButton =
  document.getElementById(
    "nextSong"
  );

    this.lyricsContainer =
      document.getElementById(
        "lyricsDisplay"
      );


    if (!this.playButton) {

      console.warn(
        "LyricsPlayer: #musicToggle tidak ditemukan."
      );

      return;

    }


    if (!this.lyricsContainer) {

      console.warn(
        "LyricsPlayer: #lyricsDisplay tidak ditemukan."
      );

      return;

    }


    /* PLAY / PAUSE */

    this.playButton.addEventListener(
      "click",
      () => {

        this.toggle();

      }
    );

/* PREVIOUS */

if (this.previousButton) {

  this.previousButton.addEventListener(
    "click",
    () => {

      this.previousSong();

    }
  );

}

/* NEXT */

if (this.nextButton) {

  this.nextButton.addEventListener(
    "click",
    () => {

      this.nextSong();

    }
  );

}

    /* UPDATE LIRIK */

    this.audio.addEventListener(
      "timeupdate",
      () => {

        this.updateLyrics();

      }
    );

    /* LAGU SELESAI */

    this.audio.addEventListener(
      "ended",
      () => {

        if (this.config.autoNext) {

          this.nextSong();

        }

      }
    );

    /* LOAD LAGU PERTAMA */

    this.loadSong(
      0,
      false
    );


    this.initialized = true;

  }


  /* =======================================================
     LOAD SONG
  ======================================================= */

  async loadSong(
    index,
    autoplay = false
  ) {

    if (
      index < 0 ||
      index >= this.config.songs.length
    ) {

      index = 0;

    }


    this.currentIndex =
      index;


    const song =
      this.config.songs[
        this.currentIndex
      ];


    /* SET AUDIO */

    this.audio.pause();

    this.audio.src =
      song.audio;

    this.audio.currentTime =
      0;


    /* RESET LIRIK */

    this.currentLyrics = [];

    this.currentLyricIndex = -1;

    this.clearLyrics();


    /* LOAD LRC */

    try {

      this.currentLyrics =
        await this.loadLRC(
          song.lyricsFile
        );


      /*
       * Pastikan timestamp
       * tersusun dari kecil ke besar.
       */

      this.currentLyrics.sort(
        (a, b) =>
          a.time - b.time
      );


      /*
       * Tampilkan baris pertama
       * sebagai persiapan.
       */

      this.updateLyrics();


    } catch (error) {

      console.error(
        "LyricsPlayer: gagal membaca LRC:",
        error
      );

      this.clearLyrics();

    }


    /* AUTOPLAY */

    if (autoplay) {

      this.play();

    }

  }


  /* =======================================================
     LOAD LRC
  ======================================================= */

  async loadLRC(
    file
  ) {

    const response =
      await fetch(file, {
        cache: "no-cache"
      });


    if (!response.ok) {

      throw new Error(
        "File LRC tidak ditemukan: " +
        file
      );

    }


    const text =
      await response.text();


    return this.parseLRC(
      text
    );

  }


  /* =======================================================
     PARSE LRC
  ======================================================= */

  parseLRC(
    text
  ) {

    const lines =
      text.split(/\r?\n/);


    const lyrics = [];


    lines.forEach(
      line => {

        /*
         * Mendukung:
         *
         * [00:33.3396]Teks
         *
         * [01:20.500]Teks
         */

        const match =
          line.match(
            /^\[(\d{1,2}):(\d{2}(?:\.\d+)?)\](.*)$/
          );


        if (!match)
          return;


        const minutes =
          parseInt(
            match[1],
            10
          );


        const seconds =
          parseFloat(
            match[2]
          );


        const text =
          match[3].trim();


        const time =
          minutes * 60 +
          seconds;


        if (
          text.length === 0
        )
          return;


        lyrics.push({

          time: time,

          text: text

        });

      }
    );


    return lyrics;

  }


  /* =======================================================
     PLAY
  ======================================================= */

  play() {

    const promise =
      this.audio.play();


    if (
      promise !== undefined
    ) {

      promise
        .then(
          () => {

            this.isPlaying =
              true;

            this.updateButton();

          }
        )
        .catch(
          error => {

            console.warn(
              "LyricsPlayer: audio tidak dapat dimainkan.",
              error
            );

            this.isPlaying =
              false;

            this.updateButton();

          }
        );

    }

  }


  /* =======================================================
     PAUSE
  ======================================================= */

  pause() {

    this.audio.pause();

    this.isPlaying =
      false;

    this.updateButton();

  }


  /* =======================================================
     TOGGLE
  ======================================================= */

  toggle() {

    if (
      this.audio.paused
    ) {

      this.play();

    } else {

      this.pause();

    }

  }


  /* =======================================================
     NEXT SONG
  ======================================================= */

  nextSong() {

    let nextIndex =
      this.currentIndex + 1;


    if (
      nextIndex >=
      this.config.songs.length
    ) {

      if (
        this.config.loopPlaylist
      ) {

        nextIndex = 0;

      } else {

        this.pause();

        return;

      }

    }


    this.loadSong(
      nextIndex,
      true
    );

  }

/* =======================================================
     PREVIOUS SONG
  ======================================================= */

  previousSong() {

    let previousIndex =
      this.currentIndex - 1;


    if (
      previousIndex < 0
    ) {

      if (
        this.config.loopPlaylist
      ) {

        previousIndex =
          this.config.songs.length - 1;

      } else {

        previousIndex = 0;

      }

    }


    this.loadSong(
      previousIndex,
      true
    );

  }

  /* =======================================================
     UPDATE BUTTON
  ======================================================= */

  updateButton() {

    if (!this.playButton)
      return;


    if (
      this.isPlaying
    ) {

      this.playButton.textContent =
        "PAUSE";


      this.playButton.setAttribute(
        "aria-label",
        "Pause music"
      );

    } else {

      this.playButton.textContent =
        "PLAY";


      this.playButton.setAttribute(
        "aria-label",
        "Play music"
      );

    }

  }


  /* =======================================================
     UPDATE LYRICS
  ======================================================= */

  updateLyrics() {

    if (
      !this.lyricsContainer
    )
      return;


    if (
      this.currentLyrics.length === 0
    )
      return;


    const currentTime =
      this.audio.currentTime;


    let activeIndex = -1;


    for (
      let i = 0;
      i < this.currentLyrics.length;
      i++
    ) {

      if (
        currentTime >=
        this.currentLyrics[i].time
      ) {

        activeIndex = i;

      } else {

        break;

      }

    }


    /*
     * Belum mencapai
     * timestamp pertama.
     */

    if (
      activeIndex === -1
    ) {

      return;

    }


    /*
     * Tidak ada perubahan.
     */

    if (
      activeIndex ===
      this.currentLyricIndex
    ) {

      return;

    }


    this.currentLyricIndex =
      activeIndex;


    this.renderLyrics(
      activeIndex
    );

  }


  /* =======================================================
     RENDER LYRICS
     MODE BERGULIR
  ======================================================= */

  renderLyrics(
    activeIndex
  ) {

    this.lyricsContainer.innerHTML =
      "";


    /*
     * Satu baris sebelumnya
     * + baris aktif
     * + satu baris berikutnya
     */

    const start =
      Math.max(
        0,
        activeIndex - 1
      );


    const end =
      Math.min(
        this.currentLyrics.length,
        activeIndex + 2
      );


    for (
      let i = start;
      i < end;
      i++
    ) {

      const line =
        document.createElement(
          "div"
        );


      line.className =
        "lyrics-line";


      line.textContent =
        this.currentLyrics[i].text;


      if (
        i === activeIndex
      ) {

        line.classList.add(
          "active"
        );

      } else if (
        i < activeIndex
      ) {

        line.classList.add(
          "past"
        );

      } else {

        line.classList.add(
          "next"
        );

      }


      this.lyricsContainer.appendChild(
        line
      );

    }


    /*
     * Efek pergantian baris.
     */

    requestAnimationFrame(
      () => {

        this.lyricsContainer.classList.remove(
          "lyrics-change"
        );


        void this.lyricsContainer.offsetWidth;


        this.lyricsContainer.classList.add(
          "lyrics-change"
        );

      }
    );

  }


  /* =======================================================
     CLEAR LYRICS
  ======================================================= */

  clearLyrics() {

    if (
      this.lyricsContainer
    ) {

      this.lyricsContainer.innerHTML =
        "";

    }

  }

}


/* =========================================================
   CREATE PLAYER
========================================================= */

const lyricsPlayer =
  new LyricsPlayer(
    LYRICS_PLAYER_CONFIG
  );


/* =========================================================
   START AFTER DOM READY
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    lyricsPlayer.init();

  }
);


/* =========================================================
   GLOBAL ACCESS
========================================================= */

window.lyricsPlayer =
  lyricsPlayer;
