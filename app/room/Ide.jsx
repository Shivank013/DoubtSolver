"use client";
// import Codemirror from "codemirror";
// import { useEffect, useRef } from "react";
// import "codemirror/lib/codemirror.css";
// import "codemirror/lib/codemirror.css"
// import "codemirror/mode/javascript/javascript";
// import "codemirror/theme/dracula.css";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/edit/closebrackets";
// import { useSocket } from "@/context/SocketProvider";

// export default function Ide() {
//   const editorRef = useRef(null);
//   const socket = useSocket();

//   useEffect(() => {
//     function init() {
//       if(editorRef.current == null){
//       const editorInstance = Codemirror(document.getElementById("realtimeEditor"), {
//         mode: { name: "javascript", json: true },
//         theme: "dracula",
//         autoCloseTags: true,
//         autoCloseBrackets: true,
//         lineNumbers: true,
//         width: 500,
//         height: 300,
//       });

//       editorRef.current = editorInstance;
//       editorRef.current.setSize("76vw", "83vh");

//       editorRef.current.on("change", (instance, changes) => {
//         const { origin } = changes;
//         const code = instance.getValue();
//         if (origin !== 'setValue') {
//           socket.emit('code-change', { code });
//         }
//       });

//       socket.on('code-change', ({ code }) => {
//         if (code !== null) {
//           editorRef.current.setValue(code);
//         }
//       });
//     }
//   }

//     init();
//   }, [editorRef.current]);

//   return (
//     <div className=" h-full w-full flex justify-center items-center">
//       <div className=" text-xl" id="realtimeEditor"></div>
//     </div>
//   );
// }

import React from 'react'

const Ide = () => {
  return (
    <div>Ide</div>
  )
}

export default Ide