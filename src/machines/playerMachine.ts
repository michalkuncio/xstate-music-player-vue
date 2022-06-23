import { createMachine } from "xstate";

export const playerMachine = createMachine({
    id: "playerMachine",
    initial: "idle",
    states: {
        idle: {
            on: { PLAY_BEGIN: { target: "playingBegin" } },
        },
        playingBegin: {
            on: {
                PLAY: { target: "playing" },
                PAUSE: { target: "paused" },
            },
        },
        playing: {
            on: {
                PAUSE: { target: "paused" },
                PLAY_BEGIN: { target: "playingBegin" } 
            },
        },
        paused: {
            on: {
                PLAY: { target: "playing" },
            },
        },
    },
});
