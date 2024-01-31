"use client";

import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../../services/peer";
import { useSocket } from "../../context/SocketProvider";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [roomCreator, setRoomCreator] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleRoomFull = useCallback(async ({ message }) => {
    console.log(message);
  }, []);

  const handleCreator = useCallback(async ({creatorId})=> {
    setRoomCreator(creatorId);
    console.log("room creator id: ",creatorId);
  },[])

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      console.log(remoteStream);
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("room:full", handleRoomFull);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("room:creator", handleCreator);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("room:full", handleRoomFull);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("room:creator", handleCreator);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleCallUser,
    handleRoomFull,
    handleCreator
  ]);

  return (
    <div className=" p-5 flex flex-col  items-center h-screen w-screen bg-slate-700">
      <div className=" flex w-full h-[87%] bg-white">
        <div className=" w-[87%] h-full flex justify-center items-center">
        {remoteSocketId ? "Some has joined" : "No one in room"}
        </div>
        <div className=" w-[13%] h-full bg-slate-800">

        <div className=" w-full h-[8rem] border-2 border-black bg-white flex items-center justify-center overflow-hidden">
        {remoteStream && (
            <>
              <ReactPlayer
                playing
                muted={true}
                url={remoteStream}
              />
            </>
          )}
        </div>

        </div>
      </div>

      <div className=" flex w-full h-[13%] justify-center items-center bg-slate-700">

        <div className=" overflow-hidden rounded-full flex justify-center bg-white items-center h-[5rem] w-[5rem]">
        <div className=" flex justify-center items-center h-[7rem] w-[7rem]">
        {myStream && (
        <>
          <ReactPlayer
            playing
            muted
            height="7rem"
            width="7rem"
            url={myStream}
          />
        </>
        )}
        </div>
        </div>
       {myStream && !roomCreator && <button className=" text-white" onClick={sendStreams}>Send Stream</button>}
       {remoteSocketId && roomCreator && <button className="text-white" onClick={handleCallUser}>CALL</button>}

      </div>
    </div>
  );
};

export default RoomPage;
