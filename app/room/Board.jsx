// Board.js (Client-side)
import React, { useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketProvider';

const Board = ({ color, size }) => {
    const timeoutRef = useRef();
    const ctxRef = useRef();
    const isDrawingRef = useRef(false);
    const canvasRef = useRef();
    const socket = useSocket();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const sketch_style = getComputedStyle(document.body);

        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        const mouse = { x: 0, y: 0 };
        const lastMouse = { x: 0, y: 0 };

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', (e) => {
            lastMouse.x = mouse.x;
            lastMouse.y = mouse.y;

            mouse.x = e.pageX - canvas.offsetLeft;
            mouse.y = e.pageY - canvas.offsetTop;
        }, false);

        /* Drawing on Paint App */
        ctx.lineWidth = size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;

        canvas.addEventListener('mousedown', () => {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', () => {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        const onPaint = () => {
            ctx.beginPath();
            ctx.moveTo(lastMouse.x, lastMouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                const base64ImageData = canvas.toDataURL("image/png");
                socket.emit("canvas-data", base64ImageData);
            }, 10);
        };

        // Listen for incoming canvas data from other clients
        socket.on('canvas-data', (data) => {
            var image = new Image();
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
            };
            image.src = data;
        });

        ctxRef.current = ctx;
    }, [color, size, socket]);

    return (
        <div className='h-[50%] w-[60%]'>
            <canvas ref={canvasRef} id="board"></canvas>
        </div>
    );
};

export default Board;
