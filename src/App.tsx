import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import fs from 'fs'
// @ts-ignore
import { ss } from 'socket.io-stream';
import './App.css'
import AudioPlayer from './components/AudioPlayer';
import TrackSelect from './components/TrackSelect';
import VideoPlayer from './components/VideoPlayer';

const socket = io('http://localhost:3000');

function App() {
  const [messageToServer, setMessageToServer] = useState('')
  const [broadcastedMessage, setBroadcastedMessage] = useState('')
  const [audioSource, setAudioSource] = useState<ArrayBuffer>(new ArrayBuffer(0))
  const [audioUrl, setAudioUrl] = useState('')
  const [trackList, setTrackList] = useState<string[]>([])

  const sendMessageToServer = () => {
    socket.emit('send_message_to_server', { message: messageToServer })
  }

  const chooseTrack = (selectedTrack:any) => {
    console.log()
    socket.emit('play_music', { filename: selectedTrack})
    console.log('track emited')
  }

  useEffect(() => {
    socket.on("broadcast_message", (data) => {
      console.log(data.message)
      setBroadcastedMessage(data.message);
      console.log(broadcastedMessage)
    });

    console.log('halo')

    socket.on('send-track-list', trackListData => {
      console.log(trackListData)
      setTrackList(trackListData);
    })

    socket.on('play-song', (trackArray:ArrayBuffer, filename:any, type) => {
      // console.log('halo from the other side')
  
      // console.log(fileArray)
      // console.log("audio source set")
      // setAudioSource(URL.createObjectURL(fileArray));
      // console.log("audio source set2")
      // console.log(audioSource)
      // const audio = document.getElementById('audio') as HTMLAudioElement;
      // // audio.load();
      // // audio.play();
      // console.log(audio.src)

      
      setAudioSource(trackArray)
      const blob = new Blob([trackArray], { type: "audio/mpeg" });
    
      setAudioUrl(window.URL.createObjectURL(blob))
   

    });

  }, [socket, audioSource, audioUrl]);

  

  return (
    <div className="App">
      {/* <script src="/assets/socket.io-stream.js"></script>
      <input placeholder='Type your message here...'
        onChange={(e) => setMessageToServer(e.target.value)}
      />
      <button onClick={sendMessageToServer}>Send</button>
      <div>
        <h3>Broadcasted message from server:</h3>
        <p>{broadcastedMessage}</p>
      </div>
      <div> */}
      {/* <audio id="audio" controls>
        <source src={audioSource} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}
      
        {/* <button onClick={chooseTrack}>Choose</button> */}
        {/* <TrackSelect chooseTrack={chooseTrack} trackList={trackList} />
      </div>
      <AudioPlayer audioSource={audioSource} audioUrl={audioUrl}/> */}

      <h1> VIDEO CHAT</h1>
      <VideoPlayer />
    </div>
  )
}

export default App
