"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import ReactPlayer from "react-player";
import peer from "../../services/peer";
import { useSocket } from "../../context/SocketProvider";
import { SocketContext } from "../../context/SocketProvider";
import { useContext } from "react";
import { useRouter } from 'next/navigation'
import { LuPhoneCall } from "react-icons/lu";
import { SlCallEnd } from "react-icons/sl";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { HiOutlineVideoCameraSlash } from "react-icons/hi2";
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { RiFullscreenFill } from "react-icons/ri";
import { RiFullscreenExitFill } from "react-icons/ri";
import { LuScreenShare } from "react-icons/lu";
import { LuScreenShareOff } from "react-icons/lu";
import { TbChalkboardOff } from "react-icons/tb";
import { TbChalkboard } from "react-icons/tb";
import { TbCodeOff } from "react-icons/tb";
import { TbCode } from "react-icons/tb";
import screenfull from "screenfull";
import Chat from "./Chat";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [roomCreator, setRoomCreator] = useState();
  const [calldone, setCalldone] = useState(false);
  const [start, setStart] = useState(false);
  const {room} = useContext(SocketContext);
  const router = useRouter();
  const [callend,setcallend] = useState(false);
  const [vedio, setvedio] = useState(false);
  const [audio, setaudio] = useState(true);
  const [remotevedio, setremotevedio] = useState(false);
  const [remoteaudio, setremoteaudio] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [screenshare, setScreenshare] = useState(false);
  const [board, setboard] = useState(false);
  const [code, setcode] = useState(false);


  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };

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
    setCalldone(true);
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
    setStart(true);
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

  const handlecallend = useCallback(async () => {
    if (!callend) {
      myStream.getTracks().forEach((track) => track.stop());
  
      setRemoteSocketId(null);
      setMyStream(null);
      setRemoteStream(null);
      setRoomCreator(null);
      setCalldone(false);
      setStart(false);

      socket.emit("room:call:end", { roomCreator, room: room });
      router.push("/");
      setcallend(true);
    }
  }, [callend, myStream, roomCreator, remoteSocketId, socket, router, room]);

  const handelVedio = useCallback(async () => {
    console.log("vedio status: ", !vedio);
    socket.emit("vedio:status", { room, status: !vedio });
    setvedio(!vedio);
  }, [vedio, room, socket]);

  const handelAudio = useCallback(async () => {
    console.log("audio status: ", !audio);
    socket.emit("audio:status", { room, status: !audio });
    setaudio(!audio);
  }, [audio, room, socket]);

  const handelremotevedio = useCallback(async({status}) => {
    console.log("remote vedio status: ",!status);
    setremotevedio(status);
  },[]);

  const handelremoteaudio = useCallback(async({status}) => {
    console.log("remote audio status: ",!status);
    setremoteaudio(status);
  },[]);

  const handleScreenShareOn = useCallback(async() => {
    socket.emit("screenshare:status", {status: true, room});
    setcode(false);
    setboard(false);
    setScreenshare(true);
  },[]);

  const handleScreenShareOff = useCallback(async() => {
    socket.emit("screenshare:status", {status: false, room});
    setcode(false);
    setboard(false);
    setScreenshare(false);
  },[]);

  const handelRemoteScreenShare = useCallback(async({status}) => {
    setcode(false);
    setboard(false);
    setScreenshare(status);
  },[]);

  const handlewhiteboardOn = useCallback(async() => {
    socket.emit("whiteboard:status", {status: true, room});
    setcode(false);
    setScreenshare(false);
    setboard(true);
  },[]);

  const handlewhiteboardOff = useCallback(async() => {
    socket.emit("whiteboard:status", {status: false, room});
    setScreenshare(false);
    setcode(false);
    setboard(false);
  },[]);

  const handleRemoteWhiteboard = useCallback(async({status}) => {
    setcode(false);
    setScreenshare(false);
    setboard(status);
  },[]);

  const handlecodeeditorOn = useCallback(async() => {
    socket.emit("codeeditor:status", {status: true, room});
    setScreenshare(false);
    setboard(false);
    setcode(true);
  },[]);

  const handlecodeeditorOff = useCallback(async() => {
    socket.emit("codeeditor:status", {status: false, room});
    setScreenshare(false);
    setboard(false);
    setcode(false);
  },[]);

  const handleRemotecodeeditor = useCallback(async({status}) => {
    setScreenshare(false);
    setboard(false);
    setcode(status);
  },[]);

  useEffect(() => {
    socket.on("remotecodeeditor:status", handleRemotecodeeditor);
    socket.on("remotewhiteboard:status", handleRemoteWhiteboard);
    socket.on("remotescreenshare:status", handelRemoteScreenShare);
    socket.on("remotevedio:status", handelremotevedio);
    socket.on("remoteaudio:status", handelremoteaudio);
    socket.on("user:joined", handleUserJoined);
    socket.on("room:full", handleRoomFull);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    socket.on("room:creator", handleCreator);
    socket.on("room:call:end", handlecallend);

    return () => {
      socket.off("remotecodeeditor:status", handleRemotecodeeditor);
      socket.off("remotewhiteboard:status", handleRemoteWhiteboard);
      socket.off("remotescreenshare:status", handelRemoteScreenShare);
      socket.off("remoteaudio:status", handelremoteaudio);
      socket.off("remotevedio:status", handelremotevedio);
      socket.off("user:joined", handleUserJoined);
      socket.off("room:full", handleRoomFull);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
      socket.off("room:creator", handleCreator);
      socket.off("room:call:end", handlecallend);
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
    handleCreator,
    handelremotevedio,
    handelremoteaudio,
    handelRemoteScreenShare,
    handleRemoteWhiteboard,
    handleRemotecodeeditor
  ]);

  return (
    <div className=" p-5 flex flex-col overflow-hidden  items-center h-screen w-screen bg-slate-700">
      <div className=" flex w-full h-[87%] bg-white">
        <div className=" w-[78%] h-full flex justify-center items-center">


        {/* {start || calldone ? "Connected" : remoteSocketId ? "Some has joined" : "No one in room"} */}
        </div>
        <div className=" w-[22%] h-[100%] flex flex-col justify-between bg-slate-400 overflow-hidden">

        <div className=" w-full h-[30%] border-2 border-black bg-white flex items-center justify-center overflow-y-hidden">
        { (!remotevedio || !remoteStream) &&
          <div className=" bg-black text-white object-cover w-[21.4%] h-[24.5%] border-black border-2 flex justify-center items-center text-7xl absolute "><FaUser/></div>
        }
       
        {remoteStream && (
            <>
              <ReactPlayer
                playing={true}
                muted={remoteaudio}
                url={remoteStream}
              />
            </>
          )}
        </div>
        <div className=" h-[70%] overflow-x-hidde ">
        <Chat/>
        </div>

        </div>
      </div>

      <div className=" flex mt-6 w-full justify-center items-center bg-slate-700">

        <div className=" overflow-hidden rounded-full flex justify-center bg-white items-center h-[5rem] w-[5rem]">
        <div className=" flex justify-center items-center h-[7rem] w-[7rem]">
        {myStream && vedio ? (
        <>
          <ReactPlayer
            playing={true}
            muted={true}
            height="7rem"
            width="7rem"
            url={myStream}
          />
        </>
        ) : (<div className=" text-3xl"><FaUser/></div>)}
        </div>
        </div>

        {vedio ?
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handelVedio}><HiOutlineVideoCameraSlash/></button> 
        : 
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handelVedio}><HiOutlineVideoCamera/></button>
        }

        {!audio ?
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handelAudio}><IoMdMicOff/></button> 
        : 
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handelAudio}><IoMdMic/></button>
        }

        {screenshare ?
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handleScreenShareOff} ><LuScreenShareOff/></button> 
        : 
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handleScreenShareOn} ><LuScreenShare/></button>
        }

        {board ?
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handlewhiteboardOff} ><TbChalkboardOff/></button> 
        : 
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handlewhiteboardOn} ><TbChalkboard/></button>
        }

        {code ?
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handlecodeeditorOff} ><TbCodeOff/></button> 
        : 
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={handlecodeeditorOn} ><TbCode/></button>
        }

        {isFullscreen ?
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={toggleFullscreen} ><RiFullscreenExitFill/></button> 
        : 
        <button className="text-white ml-10 bg-gray-800 rounded-full text-2xl p-3" onClick={toggleFullscreen} ><RiFullscreenFill/></button>
        }
        
       {!start && myStream && !roomCreator && <button className=" text-white ml-10 bg-green-400 text-2xl rounded-full p-4" onClick={sendStreams}><LuPhoneCall/></button>}
       { start && !roomCreator && <button className="text-white ml-10 bg-red-400 rounded-full text-2xl p-4"onClick={handlecallend}><SlCallEnd/></button>}
       {!calldone && remoteSocketId && roomCreator && <button className="text-white ml-10 bg-green-400 text-2xl rounded-full p-4" onClick={handleCallUser}><LuPhoneCall/></button>}
       { calldone && <button className="text-white ml-10 bg-red-400 rounded-full text-2xl p-4" onClick={handlecallend}><SlCallEnd/></button>}

      </div>
    </div>
  );
};

export default RoomPage;
