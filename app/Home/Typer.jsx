"use client"

import React from 'react'
import { TypeAnimation } from 'react-type-animation';

const Typer = () => {
  return (
        <TypeAnimation
                sequence={['Screen Sharing.',2000,'Messaging.',2000,'Whiteboard.',2000,'Code Editor.',2000,'Video call.',2000,'Review.',2000,'Rating.',2000]}
                wrapper="span"
                speed={50}
                style={{ fontSize: '1em', display: 'inline-block' }}
                repeat={Infinity}
          />
  )
}

export default Typer