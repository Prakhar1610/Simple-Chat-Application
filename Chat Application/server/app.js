import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 3000;
const secretKeyJWT = "asadsadffdsgfdg";

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        method: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST"],
    credentials: true
})); //middleware b/w client and server

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/login", (req, res) => {
    const token = jwt.sign({_id:"adasfsfdsgdgssdg"}, secretKeyJWT);

    res
      .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
      .json({
        message: "Login Success",
    });
});

// middleware
// authentication
const user = false;
io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
        if(err) return next(err)

            const token = socket.request.cookies.token;

            if(!token) return next(new Error("Authentication Error"))
            
            const decode = jwt.verify(token, secretKeyJWT);
            // if we are connected to database there here database work is done
            next();
    });
    if(user) next();
});

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);

    socket.on("message", ({ room, message }) => {
        console.log({ room, message });
        io.to(room).emit("recieved-message", message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room ${room}`);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
    // socket.emit("welcome", "Welcome to the server");
    // socket.broadcast.emit("welcome", `${socket.id} joined the server`);
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});