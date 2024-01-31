"use client";

import { useState, useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";

import { useRouter } from 'next/navigation'

import React from 'react'

const page = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const router = useRouter();

  const socket = useSocket();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      console.log(email,room);
      router.push("/room");
    },
    []
  );

  const handleRoomFull = useCallback( async(message) => {
      console.log("Sorry Room Full");
      console.log(message);
    },
    []
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    socket.on("room:full" , handleRoomFull);
    return () => {
      socket.off("room:join", handleJoinRoom);
      socket.off("room:full" , handleRoomFull);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button type="submit">Join</button>
      </form>
    </div>
  );
};

export default page;
