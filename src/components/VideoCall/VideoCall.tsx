'use client'

import {
  useJoin,
  useIsConnected,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  LocalUser,
  RemoteUser,
} from "agora-rtc-react";

import { useState } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";



export const VideoCall = () => {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  return (
    <AgoraRTCProvider client={client}>
      <CallUI />
    </AgoraRTCProvider>
  );
}

const CallUI = () => {
  const [appId, setAppId] = useState("");
  const [channel, setChannel] = useState("");
  const [token, setToken] = useState("");
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn && calling);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn && calling);
  const remoteUsers = useRemoteUsers();

  useJoin({ appid: appId, channel, token: token || null }, calling);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const handleLeave = () => {
    setCalling(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-4">
      {!isConnected ? (
        <div className="space-y-2">
          <input
            type="text"
            className="w-full border px-2 py-1"
            placeholder="App ID"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
          />
          <input
            type="text"
            className="w-full border px-2 py-1"
            placeholder="Channel Name"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
          <input
            type="text"
            className="w-full border px-2 py-1"
            placeholder="Token (optional)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            disabled={!appId || !channel}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => setCalling(true)}
          >
            Join Channel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                videoTrack={localCameraTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                style={{ width: '100%', height: 200 }}
              />
              <p className="text-center">You</p>
            </div>

            {remoteUsers.map((user) => (
              <div key={user.uid} className="w-1/2">
                <RemoteUser
                  user={user}
                  style={{ width: '100%', height: 200 }}
                />
                <p className="text-center">User {user.uid}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between space-x-2">
            <button
              onClick={() => setMicOn((prev) => !prev)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              {micOn ? "Mute Mic" : "Unmute Mic"}
            </button>
            <button
              onClick={() => setCameraOn((prev) => !prev)}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
            </button>
            <button
              onClick={handleLeave}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Leave Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;