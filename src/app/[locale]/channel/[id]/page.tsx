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

        await client.join(appId, channelName, token, uid);
        const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = localTracks;

        if (localVideoRef.current) {
          localTracks[1].play(localVideoRef.current);
        }

        await client.publish(localTracks);

        // Lấy danh sách người dùng hiện có trong kênh
        const existingUsers = client.remoteUsers || [];
        const initialRemoteUsers: RemoteUser[] = existingUsers.map((user) => ({
          uid: String(user.uid),
          videoTrack: user.videoTrack || null,
          audioTrack: user.audioTrack || null,
        }));

        setRemoteUsers(initialRemoteUsers);

        // Đăng ký và phát các track của người dùng hiện có
        for (const user of existingUsers) {
          if (user.videoTrack) {
            await client.subscribe(user, "video");
            const remoteVideoDiv = document.getElementById(`remote-${user.uid}`);
            if (remoteVideoDiv) {
              user.videoTrack.play(remoteVideoDiv);
            }
          }
          if (user.audioTrack) {
            await client.subscribe(user, "audio");
            user.audioTrack.play();
          }
        }

        // Đăng ký sự kiện user-published
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
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
                videoTrack: user.videoTrack || null,
                audioTrack: user.audioTrack || null,
              },
            ];
          });

          if (mediaType === "video" && user.videoTrack) {
            const remoteVideoDiv = document.getElementById(`remote-${user.uid}`);
            if (remoteVideoDiv) {
              user.videoTrack.play(remoteVideoDiv);
            }
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
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
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== String(user.uid)));
        });

        setJoined(true);
        return;
      } catch (error) {
        console.error(`Thử lần ${attempt} thất bại:`, error);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    console.error("Không thể join phòng sau nhiều lần thử");
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
      console.error("Lỗi khi rời phòng:", error);
    }
  };

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
      <p className="mt-4">{joined ? `Đã join phòng với ${remoteUsers.length} người khác` : "Đang kết nối..."}</p>
    </div>
  );
}