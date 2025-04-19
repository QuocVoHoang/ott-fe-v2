"use client";

import { useEffect, useRef, useState } from "react";
import AgoraRTC, { IAgoraRTCClient, ILocalTrack, IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import axios from "axios";
import { API_SERVER } from "@/constants/constants";
import { useParams } from "next/navigation";

type RemoteUser = {
  uid: string;
  videoTrack: IRemoteVideoTrack | null;
  audioTrack: IRemoteAudioTrack | null;
};

export default function Page() {
  const { id } = useParams();
  const channelName = String(id);
  const [joined, setJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<ILocalTrack[]>([]);
  const uid = useRef(Math.floor(Math.random() * 10000)).current;

  const joinChannel = async (retries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await axios.post(`${API_SERVER}/call/agora/token`, {
          channel_name: channelName,
          uid: uid,
        });

        const { token, appId } = res.data;
        const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        clientRef.current = client;

        // Đăng ký các sự kiện trước khi join
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          console.log(`User ${user.uid} published ${mediaType}`);

          setRemoteUsers((prev) => {
            const exists = prev.find((u) => u.uid === String(user.uid));
            if (exists) {
              return prev.map((u) =>
                u.uid === String(user.uid)
                  ? {
                      ...u,
                      videoTrack: mediaType === "video" ? user.videoTrack || null : u.videoTrack,
                      audioTrack: mediaType === "audio" ? user.audioTrack || null : u.audioTrack,
                    }
                  : u
              );
            }
            return [
              ...prev,
              {
                uid: String(user.uid),
                videoTrack: mediaType === "video" ? user.videoTrack || null : null,
                audioTrack: mediaType === "audio" ? user.audioTrack || null : null,
              },
            ];
          });
        });

        client.on("user-unpublished", (user, mediaType) => {
          console.log(`User ${user.uid} unpublished ${mediaType}`);
          setRemoteUsers((prev) =>
            prev.map((u) =>
              u.uid === String(user.uid)
                ? {
                    ...u,
                    videoTrack: mediaType === "video" ? null : u.videoTrack,
                    audioTrack: mediaType === "audio" ? null : u.audioTrack,
                  }
                : u
            )
          );
        });

        client.on("user-left", (user) => {
          console.log(`User ${user.uid} left`);
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== String(user.uid)));
        });

        // Join kênh
        await client.join(appId, channelName, token, uid);
        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = localTracks;

        if (localVideoRef.current) {
          localTracks[1].play(localVideoRef.current);
        }

        await client.publish(localTracks);
        setJoined(true);
        return;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    console.error("Failed to join channel after multiple attempts");
  };

  const leaveChannel = async () => {
    try {
      const client = clientRef.current;
      const localTracks = localTracksRef.current;

      if (client && localTracks.length) {
        await client.unpublish(localTracks);
      }

      localTracks.forEach((track) => {
        track.stop();
        track.close();
      });

      await client?.leave();
      clientRef.current = null;
      localTracksRef.current = [];
      setRemoteUsers([]);

      await axios.post(`${API_SERVER}/call/agora/leave`, {
        channel_name: channelName,
        uid: uid,
      });

      setJoined(false);
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  };

  // Đồng bộ video tracks với DOM
  useEffect(() => {
    remoteUsers.forEach((user) => {
      if (user.videoTrack) {
        const remoteVideoDiv = document.getElementById(`remote-${user.uid}`);
        if (remoteVideoDiv) {
          try {
            user.videoTrack.play(remoteVideoDiv);
            console.log(`Playing video for user ${user.uid}`);
          } catch (error) {
            console.error(`Failed to play video for user ${user.uid}:`, error);
          }
        }
      }
      if (user.audioTrack) {
        try {
          user.audioTrack.play();
          console.log(`Playing audio for user ${user.uid}`);
        } catch (error) {
          console.error(`Failed to play audio for user ${user.uid}:`, error);
        }
      }
    });
  }, [remoteUsers]);

  useEffect(() => {
    joinChannel();
    return () => {
      leaveChannel();
    };
  }, []);

  return (
    <div className="w-screen h-screen p-4 flex flex-col items-center justify-center">
      <div className="flex flex-wrap gap-4">
        <div className="w-80 h-60 bg-black">
          <div ref={localVideoRef} className="w-full h-full"></div>
        </div>
        {remoteUsers.map((user) => (
          <div key={user.uid} className="w-80 h-60 bg-black">
            <div id={`remote-${user.uid}`} className="w-full h-full"></div>
          </div>
        ))}
      </div>
      <p className="mt-4">{joined ? `Joined room with ${remoteUsers.length} others` : "Connecting..."}</p>
    </div>
  );
}