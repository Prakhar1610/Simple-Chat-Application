import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { io } from "socket.io-client"
//import { Container } from "@mui/material"

const App = () => {
  const socket = useMemo(() =>io("http://localhost:3000", {withCredentials: true,}), []);

  // variables
  const [message,setMessage] = useState("");
  const [room,setRoom] = useState("");
  const [socketID,setsocketID] = useState("");
  const [messages,setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();  // preventing the page refresh after we hit send button
    socket.emit("message", {message, room});
    setMessage("");
  };

  // handling join room event
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room', roomName);
    setRoomName("");
  }

  // Managing Event
  useEffect(() => {
    socket.on("connect", () => {
      setsocketID(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("recieved-message", (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    })

    socket.on("welcome", (s) => {
      console.log(s);
    })

    return () => {
      socket.disconnect();
    }
  }, []);
  return (
    <Container maxWidth="sm">
    <Box sx={{ height: 200 }}/>
    <Typography variant='h3' component="div" gutterBottom>
      Welcome to Socket.io
    </Typography>

    <Typography variant="h6" component="div" gutterBottom>
      {socketID}
    </Typography>

    <form onSubmit={joinRoomHandler}>
    <h5>Join Room</h5>
    <TextField 
      value={roomName} 
      onChange={e => setRoomName(e.target.value)} 
      id="outlined-basic" 
      label="Room Name" 
      variant="outlined"/>

    <Button type='submit' variant='contained' color='primary'>Join</Button>
    </form>

    <form onSubmit={handleSubmit}>
      <TextField 
      value={message} 
      onChange={e => setMessage(e.target.value)} 
      id="outlined-basic" 
      label="Message" 
      variant="outlined"/>

      <TextField 
      value={room} 
      onChange={e => setRoom(e.target.value)} 
      id="outlined-basic" 
      label="Room" 
      variant="outlined"/>

      <Button type='submit' variant='contained' color='primary'>Send</Button>
    </form>

    <Stack>
      {messages.map((m, i) => (
        <Typography key={i} variant="h6" component="div" gutterBottom>
          {m}
        </Typography>
      ))}
    </Stack>
  </Container>
  )
}

export default App










// import React, { useEffect } from 'react';
// import { io } from "socket.io-client";

// const App = () => {
//   useEffect(() => {
//     const socket = io("http://localhost:3000");

//     socket.on("connect", () => {
//       console.log("Connected to server");
//       console.log("Socket ID:", socket.id); // Log socket ID here
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return <div>App</div>;
// };

// export default App;
