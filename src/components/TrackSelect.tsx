import React, { useEffect, useState } from "react";
import { IconMusic } from "@tabler/icons";
import { ThemeIcon, Table, Text } from "@mantine/core";

const TrackSelect = ({ chooseTrack, trackList }) => {
  const [selectedTrack, setSelectedTrack] = useState<string>("");

  const handleTrackSelect = (e) => {
    setSelectedTrack(e.target.value);
  };

  const handleChooseTrack = () => {
    chooseTrack(selectedTrack);
  };

  const tracks = [
    { title: "Track 1", artist: "Artist 1", album: "Album 1" },
    { title: "Track 2", artist: "Artist 2", album: "Album 2" },
    { title: "Track 3", artist: "Artist 3", album: "Album 3" },
    { title: "Track 4", artist: "Artist 4", album: "Album 4" },
    { title: "Track 5", artist: "Artist 5", album: "Album 5" },
  ];
  let rows;
  useEffect(() => {
    rows = tracks.map((track) => {
      <tr key={track.title}>
        <td>{track.title}</td>
        <td>{track.artist}</td>
        <td>{track.album}</td>
      </tr>;
    });
  }, []);

  console.log(rows);
  return (
    <>
      {/* <select onChange={handleTrackSelect}>
                {trackList.map((track) => (
                    <option value={track} key={track}>{track}</option>
                ))}
            </select>
            <button type="button" onClick={handleChooseTrack}>Choose</button> */}

      <Table highlightOnHover>
        <thead>
          <tr>
            <th>
              <ThemeIcon variant="light" color="pink" size="sm">
                <IconMusic />
              </ThemeIcon>
            </th>
            <th>
              <Text color="pink.2">Track Title</Text>
            </th>
            <th>
              <Text color="pink.2">Artist</Text>
            </th>
            <th>
              <Text color="pink.2">Album</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ThemeIcon variant="light" color="pink" size="sm">
                <IconMusic />
              </ThemeIcon>
            </td>
            <td>
              <Text color="pink.2">Track 2</Text>
            </td>
            <td>
              <Text color="pink.2">Artist 2</Text>
            </td>
            <td>
              <Text color="pink.2">Album 2</Text>
            </td>
          </tr>
          <tr>
            <td>
              <ThemeIcon variant="light" color="pink" size="sm">
                <IconMusic />
              </ThemeIcon>
            </td>
            <td>
              <Text color="pink.2">Track 3</Text>
            </td>
            <td>
              <Text color="pink.2">Artist 3</Text>
            </td>
            <td>
              <Text color="pink.2">Album 3</Text>
            </td>
          </tr>
          <tr>
            <td>
              <ThemeIcon variant="light" color="pink" size="sm">
                <IconMusic />
              </ThemeIcon>
            </td>
            <td>
              <Text color="pink.2">Track 4</Text>
            </td>
            <td>
              <Text color="pink.2">Artist 4</Text>
            </td>
            <td>
              <Text color="pink.2">Album 4</Text>
            </td>
          </tr>
          <tr>
            <td>
              <ThemeIcon variant="light" color="pink" size="sm">
                <IconMusic />
              </ThemeIcon>
            </td>
            <td>
              <Text color="pink.2">Track 5</Text>
            </td>
            <td>
              <Text color="pink.2">Artist 5</Text>
            </td>
            <td>
              <Text color="pink.2">Album 5</Text>
            </td>
          </tr>
          <tr>
            <td>
              <ThemeIcon variant="light" color="pink" size="sm">
                <IconMusic />
              </ThemeIcon>
            </td>
            <td>
              <Text color="pink.2">Track 6</Text>
            </td>
            <td>
              <Text color="pink.2">Artist 6</Text>
            </td>
            <td>
              <Text color="pink.2">Album 6</Text>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default TrackSelect;
