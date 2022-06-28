<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { useMachine } from "@xstate/vue";
import { playerMachine } from "./../machines/playerMachine";

import IconPlay from "./icons/IconPlay.vue";
import IconPause from "./icons/IconPause.vue";
import IconNext from "./icons/IconNext.vue";
import IconPrev from "./icons/IconPrev.vue";

const { state, send } = useMachine(playerMachine);

const tracks = ref([
    {
        name: "Ask The Mountains",
        artist: "Vangelis",
        length: 240
    },
    {
        name: "Colors of Love",
        artist: "Thomas Bergesen",
        length: 200
    }
]);

const currentTrackIndex = ref(0);

const currentTrack = computed(() => {
    return tracks.value[currentTrackIndex.value];
});

let progressInterval: ReturnType<typeof setInterval> | null = null;

const currentTrackProgress = ref(0);

const currentTrackProgressPercentage = computed(() => {
    return `${(currentTrackProgress.value / currentTrack.value.length) * 100}%`;
});

const playBeginStateDuration = 5000;

function togglePlayPause() {
    if (state.value.matches('idle')) {
        playBeginTrack();
    }
    else if (state.value.matches('paused')) {
        playTrack();
    }
    else {
        send("PAUSE");
        progressInterval && clearInterval(progressInterval);
    }
}

function playBeginTrack() {
    send("PLAY_BEGIN");

    startOrContinueProgressTimer();

    setTimeout(() => {
        send("PLAY");
    }, playBeginStateDuration);
}

function playTrack() {
    send("PLAY");
    startOrContinueProgressTimer();
}

function nextTrack() {
    resetTimer();

    if (currentTrackIndex.value < tracks.value.length - 1) {
        currentTrackIndex.value++;
    }
    else {
        currentTrackIndex.value = 0;
    }

    startOrContinueProgressTimer();
}

function rewindOrPrevious() {
    if (state.value.matches('playingBegin')) {
        previousTrack();
    }
    else {
        rewindTrack();
    }
}

function previousTrack() {
    resetTimer();

    if (currentTrackIndex.value > 0) {
        currentTrackIndex.value--;
    }
    else {
        currentTrackIndex.value = tracks.value.length - 1;
    }

    startOrContinueProgressTimer();
}

function rewindTrack() {
    resetTimer();

    send("PLAY_BEGIN");

    startOrContinueProgressTimer();
}

function startOrContinueProgressTimer() {
    progressInterval = setInterval(() => {
        checkForTrackEnd();
        currentTrackProgress.value += 1;
    }, 1000);
}

function checkForTrackEnd() {
    if (currentTrackProgress.value === currentTrack.value.length) {
        nextTrack();
    }
}

function resetTimer() {
    currentTrackProgress.value = 0;
    progressInterval && clearInterval(progressInterval);
}

onUnmounted(() => {
    progressInterval && clearInterval(progressInterval);
});
</script>

<template>
  <div class="music-player">
      <div class="display">
            <div class="current-track">
              <div class="track-name">{{ currentTrack.name }}</div>
              <div class="track-artist">{{ currentTrack.artist }}</div>
            </div>
            <div class="state-icon">
              <IconPlay v-if="state.matches('idle') || state.matches('paused')" class="icon icon-play"></IconPlay>
              <IconPause v-if="state.matches('playingBegin') || state.matches('playing')" class="icon icon-play"></IconPause>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-inner"></div>
            </div>
      </div>
      <div class="wheel">
          <button class="button-control menu">menu</button>
          <button class="button-control next" @click="nextTrack">
              <IconNext class="icon"></IconNext>
          </button>
          <button class="button-control prev" @click="rewindOrPrevious">
              <IconPrev class="icon"></IconPrev>
          </button>
          <button class="button-control playpause" @click="togglePlayPause">
              <IconPlay class="icon icon-play"></IconPlay>
              <IconPause class="icon"></IconPause>
          </button>
          <div class="wheel-inner"></div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.music-player {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 400px;
    height: 650px;
    border-radius: 30px;
    background: linear-gradient(0deg, rgba(114,114,114,1) 0%, rgba(186,186,186,1) 33%, rgba(239,239,239,1) 100%);
    position: relative;
    .display {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid black;
        border-radius: 10px;
        background: white;
        width: 80%;
        height: 250px;
        margin-top: 30px;
        flex-direction: column;
        gap: 20px;
        .current-track {
            text-align: center;
            .track-name {
                font-size: 1.5rem;
                font-weight: bold;
            }
            .track-artist {
                font-size: 1rem;
                font-weight: normal;
            }
            
        }
        .state-icon {
            .icon {
                width: 80px;
                height: 80px;
                fill: #4c4c4c;
            }
        }

        .progress-bar{
            width: 80%;
            height: 25px;
            border-top: 1px solid gainsboro;
            border-bottom: 1px solid gainsboro;
            .progress-bar-inner {
                background: #16a1ea;
                height: 100%;
                width: v-bind(currentTrackProgressPercentage);
            }
        }
    }
    .wheel {
        height: 250px;
        width: 250px;
        background: white;
        border-radius: 50%;
        margin-top: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .wheel-inner {
            width: 80px;
            height: 80px;
            background: linear-gradient(0deg, rgba(230,230,230,1) 0%, rgba(188,188,188,1) 100%);
            border-radius: 50%;
            border: 2px solid #c6cbc8;
        }
    }
    
    .button-control {
        color: rgb(165, 179, 185);
        position: absolute;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &.menu {
            top: 30px;
            left: 100px;
            text-transform: uppercase;
            font-weight: bold;
        }

        &.next {
            top: 113px;
            right: 9px;
        }

        &.prev {
            top: 113px;
            left: 9px;
        }

        &.playpause {
            bottom: 16px;
            left: 97px;
        }
    }

    .icon {
        fill: rgb(165, 179, 185);
    }
}
</style>
