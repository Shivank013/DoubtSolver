// server component

import React from 'react';
import Image from 'next/image';
import laptop from "../../public/images/laptop.png";
import logo from "../../public/images/LOGO.png";
import client from "../../public/images/client.jpg";
import screesharing from "../../public/images/screensharing.png"
import whiteboard from "../../public/images/whiteboard.png"
import messaging from "../../public/images/messaging.png"
import code from "../../public/images/code.png"
import vediocall from "../../public/images/someonehasjoined.png"
import { MdArrowOutward } from "react-icons/md";
import dynamic from 'next/dynamic';
import { SlCallEnd } from "react-icons/sl";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { IoMdMic } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { RiFullscreenFill } from "react-icons/ri";
import { LuScreenShare } from "react-icons/lu";
import { TbChalkboard } from "react-icons/tb";
import { TbCode } from "react-icons/tb";

const ClientComponent = dynamic(() => import('./Typer'), { ssr: false });

const Page = () => {
  let signup=true;

  return (
    <div className='w-full'>
      <nav className='flex z-50 bg-white justify-between items-center h-[3rem] fixed w-full'>
        <div><Image src={logo} className='ml-16 w-[14rem]' /></div>
        <div className='mr-16 font-sans flex justify-center items-center'>
          <a className='cursor-pointer mr-10 text-l font-semibold'>About</a>
          {signup ? (
            <div>
              <a className='cursor-pointer mr-10 text-l font-semibold'>Login</a>
              <a className='cursor-pointer text-center text-l font-semibold py-2 px-3 rounded-full text-white bg-purple-500'>Signup</a>
            </div>
          ) : (
            <div>
              <a className='cursor-pointer text-center text-l font-semibold py-2 px-3 rounded-full text-white bg-purple-500'>Dashboard</a>
            </div>
          )}
        </div>
      </nav>
      <section className='w-full h-[110vh] pt-[3rem] flex justify-between flex-col items-center bg-white'>
        <Image src={laptop} className='w-[82%]' alt='' />
        <div className='text-white text-7xl -ml-[8%] font-bold mt-8 absolute'>
          <p className=' font-sans'>Expert Guidance,</p>
          <p className=' text-purple-500 font-sans'>Right at Your Fingertips</p>
        </div>
        <Image src={client} className='absolute z-10 w-[20rem] mt-[20%] ml-[30%]' />
        <div className='absolute border-2 border-white w-[20rem] h-[13.5rem] mt-[21%] ml-[33%]'></div>

        <div className='text-6xl text-red-400 font-sans absolute mt-[20%] -ml-[29%] w-[35%] font-bold'>
          
          <ClientComponent/>

        </div>

        <div className=' flex justify-center items-center absolute text-white text-2xl mt-[40%]'>

        <span className=' p-4 mx-2 bg-white text-black rounded-full'><FaUser/></span>
        <span className=' p-2 mx-2 bg-slate-700 rounded-full'><HiOutlineVideoCamera/></span>
        <span className=' p-2 mx-2 bg-slate-700 rounded-full'><IoMdMic/></span>
        <span className=' p-2 mx-2 bg-slate-700 rounded-full'><LuScreenShare/></span>
        <span className=' p-2 mx-2 bg-slate-700 rounded-full'><TbChalkboard/></span>
        <span className=' p-2 mx-2 bg-slate-700 rounded-full'><TbCode/></span>
        <span className=' p-2 mx-2 bg-slate-700 rounded-full'><RiFullscreenFill/></span>
        <span className=' p-4 mx-2 bg-red-500 rounded-full '><SlCallEnd/></span>

        </div>
      </section>

      <section className=' w-full'>

      <div className='w-full text-center p-[7rem] text-red-500 text-6xl font-bold mx-auto bg-slate-200'>Elevate Your Learning Experience</div>

      <div className=' flex w-full'>
      <div className=' py-10 w-[50%]'>
      <Image src={screesharing} className='' alt=''/>
      </div>
      <div className=' flex flex-col py-20 px-14 items-center w-[50%]'>
        <h2 className=' text-5xl font-sans font-bold'>Screen Sharing</h2>
        <p className=' text-xl mt-10'>Screen sharing facilitates real-time visual demonstration, enabling experts to explain complex concepts, provide step-by-step guidance, and offer immediate feedback, thereby enhancing understanding and problem-solving capabilities.</p>
      </div>
      </div>

      <div className=' flex w-full'>
      <div className='flex flex-col py-20 px-14 items-center w-[50%]'>
        <h2 className=' text-5xl font-sans font-bold'>Whiteboard</h2>
        <p className=' text-xl mt-10'>Whiteboard functionality allows for dynamic visual representation, enabling experts to illustrate concepts, solve problems, and engage in interactive learning, fostering clearer understanding and effective doubt resolution.</p>
      </div>
      <div className=' py-10 w-[50%]'>
      <Image src={whiteboard} className='' alt=''/>
      </div>
      </div>

      <div className=' flex w-full'>
      <div className=' py-10 w-[50%]'>
      <Image src={messaging} className='' alt=''/>
      </div>
      <div className='flex flex-col py-20 px-14 items-center w-[50%]'>
        <h2 className=' text-5xl font-sans font-bold'>Messaging</h2>
        <p className=' text-xl mt-10'>Messaging provides a convenient and asynchronous communication channel, allowing students to ask questions, share doubts, and receive expert guidance at their own pace, fostering continuous learning and doubt resolution.</p>
      </div>
      </div>

      <div className=' flex w-full'>
      <div className='flex flex-col py-20 px-14 items-center w-[50%]'>
        <h2 className=' text-5xl font-sans font-bold'>Code Editor</h2>
        <p className=' text-xl mt-10'>Code editors provide a dedicated environment for students to write, test, and debug code, enabling them to receive real-time feedback and guidance from experts, leading to improved coding skills and effective doubt resolution.</p>
      </div>
      <div className=' py-10 w-[50%]'>
      <Image src={code} className='' alt=''/>
      </div>
      </div>

      <div className=' flex w-full'>
      <div className=' py-10 w-[50%]'>
      <Image src={vediocall} className='' alt=''/>
      </div>
      <div className='flex flex-col py-20 px-14 items-center w-[50%]'>
        <h2 className=' text-5xl font-sans font-bold'>Video Call</h2>
        <p className=' text-xl mt-10'>Video calls enable face-to-face interaction between students and experts, fostering a more personal and engaging learning experience, facilitating clearer communication, and enhancing doubt resolution through visual cues and real-time feedback.</p>
      </div>
      </div>

      </section>

      <section className=' flex flex-col items-center justify-center w-full py-20 bg-purple-500'>
      <h1 className=' text-7xl text-white font-bold font-sans'>Get Started with Your Learning</h1>
      <div className=' text-7xl text-white font-bold font-sans'>Journey</div>
      <p className=' text-2xl px-40 font-semibold font-sans text-white pt-8 pb-2 '>Welcome to our platform! We're excited to help you on your learning journey.</p>
      <p className=' text-2xl px-40 font-semibold font-sans text-white pb-2'> Whether you're a student looking to clarify doubts or an expert ready to share your knowledge,</p>
      <p className=' text-2xl px-40 font-semibold font-sans text-white '>we're here to support you every step of the way.</p>
      <div className=' flex gap-10 justify-center items-center mt-14'>
      <button className=' bg-white text-purple-500 py-2 px-4 rounded-full text-xl font-bold '>Get Started</button>
      <div className=' flex flex-col'>
      <div className=' flex justify-center items-center'>
      <button className=' text-white text-xl font-bold'>Know More</button>
      <MdArrowOutward className=' text-2xl text-white'/>
      </div>
      <div className=' w-[7rem] h-[0.3rem] bg-white'></div>
      </div>
      </div>
      </section>

      <section className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border shadow-xl cur p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Question 1: What is your app about?</h3>
            <p className="text-gray-700">Answer: Our app is a one-on-one student expert doubt-solving platform that provides features like screen sharing, messaging, whiteboard, code editor, and video call to help students get expert guidance right at their fingertips.</p>
          </div>
          <div className="border p-4 shadow-xl rounded-lg">
            <h3 className="text-xl font-bold mb-4">Question 2: How can I get started?</h3>
            <p className="text-gray-700">Answer: To get started, simply sign up for an account on our website. Once you're logged in, you can start asking your doubts and get expert guidance from our community of experts.</p>
          </div>
          <div className="border p-4 shadow-xl rounded-lg">
            <h3 className="text-xl font-bold mb-4">Question 3: How does screen sharing help in doubt solving?</h3>
            <p className="text-gray-700">Answer: Screen sharing allows experts to visually demonstrate concepts, provide step-by-step guidance, and offer immediate feedback, thereby enhancing understanding and problem-solving capabilities.</p>
          </div>
          <div className="border p-4 shadow-xl rounded-lg">
            <h3 className="text-xl font-bold mb-4">Question 4: How does messaging help in doubt solving?</h3>
            <p className="text-gray-700">Answer: Messaging provides a convenient and asynchronous communication channel, allowing students to ask questions, share doubts, and receive expert guidance at their own pace, fostering continuous learning and doubt resolution.</p>
          </div>
          <div className="border p-4 shadow-xl rounded-lg">
            <h3 className="text-xl font-bold mb-4">Question 5: How does the code editor help in doubt solving?</h3>
            <p className="text-gray-700">Answer: The code editor provides a dedicated environment for students to write, test, and debug code, enabling them to receive real-time feedback and guidance from experts, leading to improved coding skills and effective doubt resolution.</p>
          </div>
          <div className="border p-4 shadow-xl rounded-lg">
            <h3 className="text-xl font-bold mb-4">Question 6: How does the whiteboard help in doubt solving?</h3>
            <p className="text-gray-700">Answer: The whiteboard allows experts to visually explain concepts, draw diagrams, and illustrate solutions, making it easier for students to understand complex topics and solve problems.</p>
          </div>
        </div>
      </div>
    </section>

    <footer className=" w-full bg-gray-800 text-white p-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Footer Section 1 */}
        <div>
          <div className='flex flex-row'>
         
            <span className='ml-1 text-[1.5rem] inline font-sans font-semibold'>Doubt Buster</span>
            </div>
          <div className='p-3'>Empowering Students, One Doubt at a Time: Your Personalized Path to Mastery</div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Company</h3>
          <ul>
          <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Footer Section 2 */}
        <div>
          <h3 className="text-xl font-bold mb-4">Services</h3>
          <ul>
            <li>Student LogIn</li>
            <li>Expert LogIn</li>
            <li>Interactive Platform</li>
          </ul>
        </div>

       {/* Footer Section 3 */}
        <div>
          <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>
   <div className='w-[screen] h-[1px] bg-white m-6'></div>
      <div className="mt-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Doubt Buster. All rights reserved.
        </p>
      </div>
    </footer>

    </div>
  );
};

export default Page;
