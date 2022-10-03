import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

interface IAudioPlayerProps {
    audioSource: ArrayBuffer;
    audioUrl: string;
}

const audioCtx = new AudioContext();
var source = new AudioBufferSourceNode(audioCtx)

const AudioPlayer = ({audioSource, audioUrl}: IAudioPlayerProps) => {
    const [playTrackDisabled, setPlayTrackDisabled] = useState<boolean>(false)
    const [stopTrackDisabled, setStopTrackDisabled] = useState<boolean>(true)


    const prepareAudio = () => {
    
        const audioElement = document.querySelector("audio");
        
        let songLength;
        if (audioElement){
        audioElement.src = audioUrl
        }
    
        audioCtx.decodeAudioData(
          audioSource,
          (buffer) => {
            songLength = buffer.duration;
            source.buffer = buffer;
    
            source.connect(audioCtx.destination);
            source.loop = false;
            console.log("source w srodku decode")
            console.log(source)
          },
          (e) => {
            `Error with decoding audio data ${e}`;
          }
        );
        console.log("source poza decode")
        console.log(source)
    }

    const pleaseJustPlay = () => {
        prepareAudio();
        console.log("czemu tu masz nulla")
        console.log(source)
        source.start(0);
        console.log(source)
        setPlayTrackDisabled(true)
        setStopTrackDisabled(false)
      }
    
      const pleaseJustStop = () => {
        console.log(source)
        source.stop(0);
        setPlayTrackDisabled(false)
        setStopTrackDisabled(true)
      }

    return (
        <>
            <button 
                className="playTrack" 
                onClick={pleaseJustPlay}
                disabled={playTrackDisabled}
                >
                    Play
            </button>
            <button 
                className="stopTrack" 
                onClick={pleaseJustStop}
                disabled={stopTrackDisabled}
                >
                    Stop
            </button>

            <h2>Set playback rate</h2>
            <input
                className="playback-rate-control"
                type="range"
                min="0.25"
                max="3"
                step="0.05"
                value="1"
            />
            <span className="playback-rate-value">1.0</span>

            <h2>Set loop start and loop end</h2>
            <input
                className="loopstart-control"
                type="range"
                min="0"
                max="20"
                step="1"
                value="0"
            />
            <span className="loopstart-value">0</span>

            <input
                className="loopend-control"
                type="range"
                min="0"
                max="20"
                step="1"
                value="0"
            />
            <span className="loopend-value">0</span>  
        </>
    )
}

export default AudioPlayer;