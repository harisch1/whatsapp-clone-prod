import React, { useEffect, useState } from "react";
import "./styles/Chat.css";
import { Avatar, IconButton } from "@mui/material";
import AttachFile from "@mui/icons-material/AttachFileOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import db from "../firebase";
import { useStateValue } from "../StateProvider";

function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (roomId) {
      const docRef = doc(db, `rooms/${roomId}`);
      const unSubRoom = onSnapshot(docRef, (snapshot) => {
        setRoomName(snapshot.data().name);
      });

      const colRef = collection(db, `rooms/${roomId}/messages`);
      const q = query(colRef, orderBy("timestamp", "asc"));
      const unSubChat = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });

      return () => {
        unSubRoom();
        unSubChat();
      };
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("Message: ", input);

    const newMessage = collection(db, `rooms/${roomId}/messages`);
    await addDoc(newMessage, {
      name: user.displayName,
      message: input,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            {`Last Seen at ${
              messages[messages.length - 1] &&
              new Date(
                messages[messages.length - 1].timestamp.toDate()
              ).toLocaleTimeString()
            }`}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              user.displayName === message.name && "chat__reciever"
            }`}
          >
            {user.displayName !== message.name && (
              <span className="chat__name">{message.name}</span>
            )}

            {message.message}
            <span className="chat__timestamp">
              {message.timestamp &&
                new Date(message.timestamp.toDate()).toLocaleString()}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            {" "}
            Send a message
          </button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
