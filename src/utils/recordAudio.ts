import type { RecorderControl } from "../types";

export const recordAudio = (): Promise<RecorderControl> => new Promise((resolve, reject) => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks: Blob[] = [];

            mediaRecorder.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data);
            });

            const start = () => {
                audioChunks.length = 0;
                mediaRecorder.start();
            };

            const stop = () =>
                new Promise<Blob>((resolveStop) => {
                    mediaRecorder.addEventListener("stop", () => {
                        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                        resolveStop(audioBlob);
                    });
                    mediaRecorder.stop();
                });

            resolve({ start, stop });
        })
        .catch(err => reject(err));
});
