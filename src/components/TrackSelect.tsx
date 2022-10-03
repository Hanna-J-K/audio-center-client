import { useEffect, useState } from 'react'

const TrackSelect = ({chooseTrack, trackList}) => {
    
    const [selectedTrack, setSelectedTrack] = useState<string>('')

    const handleTrackSelect = (e) => {
        setSelectedTrack(e.target.value);
    }

    const handleChooseTrack = () => {
        chooseTrack(selectedTrack)
    }

    return (
        <>
            <select onChange={handleTrackSelect}>
                {trackList.map((track) => (
                    <option value={track} key={track}>{track}</option>
                ))}
            </select>
            <button onClick={handleChooseTrack}>Choose</button>

        </>
    )
}

export default TrackSelect