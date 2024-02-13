import React, { useState, useEffect } from 'react';
import Board from './Board';
import { useSocket } from '@/context/SocketProvider';

const WhiteBoard = () => {
    const [color, setColor] = useState("#000000");
    const [size, setSize] = useState("3");
    const socket = useSocket();

    const changeColor = (event) => {
        setColor(event.target.value);
    };

    const changeSize = (event) => {
        setSize(event.target.value);
    };

    return (
        <div className=" bg-gray-900">
            <div className="tools-section text-center ">
                <div className="color-picker-container font-bold inline text-white">
                    Color : &nbsp;
                    <input type="color" className=' h-7 w-7' value={color} onChange={changeColor} />
                </div>

                <div className=" inline text-white font-bold ml-12">
                    Brush Size : &nbsp;
                    <select className='text-black font-semibold' value={size} onChange={changeSize}>
                        <option> 1 </option>
                        <option> 2 </option>
                        <option> 3 </option>
                        <option> 5 </option>
                        <option> 10 </option>
                        <option> 15 </option>
                        <option> 20 </option>
                    </select>
                </div>
            </div>

            <div className="board-container bg-white">
                <Board color={color} size={size} socket={socket} />
            </div>
        </div>
    );
};

export default WhiteBoard;