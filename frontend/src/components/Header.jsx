import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { io } from 'socket.io-client';

function Header() {
    const user = localStorage.getItem("userName");
    const status = localStorage.getItem("loginStatus");
    const accessToken = localStorage.getItem("accessToken");
    const senderID = localStorage.getItem("userID");

    const [state, setState] = useState(status); //to show the navbar items like chat,hello user after logged in
    const [isOpen, setIsOpen] = useState(false); //to open the users dropdown whom we want to chat with
    const [users, setUsers] = useState([]);//to map all the users
    const [chatModal, setChatModal] = useState(false);// to open the chat modal
    const [userId, setUserId] = useState(''); // to store the userId I am chatting with
    const [messages, setMessages] = useState([]); // to map all the chats between the users
    const [messageInput, setMessageInput] = useState("");// for inputing current chats to users
    const [flag, setFlag] = useState(false); //to trigger the getAll chats function when send button is clicked

    const navigate = useNavigate();
    const socketRef = useRef(null); // to store the reference of socket ID
    const bottomRef = useRef(null); // Ref for scrolling to bottom

    // Setup socket only once
    useEffect(() => {
        const socket = io("http://localhost:8001", {
            extraHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        socketRef.current = socket; //to store the reference of socket ID

        //to recieve the message send by the user
        socket.on("message", (data) => {
            console.log("Received message", data);
            setMessages((prev) => [
                ...prev,
                {
                    sender: data.senderId,
                    receiver: data.receiverId,
                    content: data.message,
                }
            ]);
        });

        return () => {
            socket.disconnect();
        };
    }, [accessToken]);


    //to open the modal where all users are mapped for chat
    const toggleDropdown = async () => {
        try {
            setIsOpen((prev) => !prev);
            const res = await axios.get('http://localhost:8001/user/getAll', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setUsers(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.delete('http://localhost:8001/user/logout', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setState(false);
            localStorage.clear();
            toast.success("User Logged Out Successfully");
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    //to open the chat modal for specific user
    const toggleModal = (u) => {
        setChatModal(true);
        setUserId(u._id);
        setIsOpen(false);
    };

    //to fetch all gthe chats between 2 users
    const getAllChats = async () => {
        try {
            if (chatModal && userId) {
                const res = await axios.post("http://localhost:8001/chat/getChat", {
                    senderId: senderID,
                    receiverId: userId,
                });
                setMessages(res.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllChats();
    }, [userId, flag]);


    //to send the message to the particular user
    const sendMessage = () => {
        if (!messageInput.trim()) return;

        const messageData = {
            senderId: senderID,
            receiverId: userId,
            message: messageInput,
        };

        //to trigger the send message action from backend
        socketRef.current.emit("send_message", messageData);

        // Optimistically add message
        setMessages((prev) => [
            ...prev,
            {
                sender: senderID,
                receiver: userId,
                content: messageInput,
            }
        ]);
        setMessageInput("");
        setFlag(!flag); // trigger refetch
    };

    // Scroll to bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <nav className='flex justify-between bg-gray-100 p-2 lg:p-3'>
                <div className='flex gap-2'>
                    <h1 className='self-center text-3xl cursor-pointer'>Notes App</h1>
                </div>
                {state ? (
                    <div className='flex gap-5 items-center capitalize'>
                        <div className="relative inline-block">
                            <button onClick={toggleDropdown}>Chat</button>
                            {isOpen && (
                                <div className="absolute left-0  bg-gray-200 border border-gray-500 rounded shadow-lg mt-1">
                                    {users.map((u, index) => (
                                        <button
                                            key={index}
                                            className="block w-[180px] text-left py-2 px-4 hover:bg-gray-300 rounded"
                                            onClick={() => toggleModal(u)}
                                        >
                                            {u.userName}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p>Hello, {user}</p>
                        <div
                            className="self-center text-xl font-serif px-3 py-1 border border-gray-700 rounded-md transition-all hover:border-[#8B0000] hover:text-[#8B0000] cursor-pointer"
                            onClick={handleLogout}
                        >
                            Logout &rarr;
                        </div>
                    </div>
                ) : (
                    <div
                        className="self-center text-xl font-serif px-3 py-1 border border-gray-700 rounded-md transition-all hover:border-[#8B0000] hover:text-[#8B0000] cursor-pointer"
                        onClick={handleLogin}
                    >
                        Login &rarr;
                    </div>
                )}
            </nav>

            {chatModal && (
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden flex flex-col h-[550px] bottom-10 right-2 absolute">
                    <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                        <div>
                            <h1 className="font-bold text-lg">Simple Chat</h1>
                            <p className="text-xs text-blue-100">Online</p>
                        </div>
                        <RxCross2 size={30} className='cursor-pointer' onClick={() => setChatModal(false)} />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((item, index) => (
                            <p
                                key={index}
                                className={`p-2 rounded-lg mb-1 ${item.sender === userId
                                    ? "bg-blue-100 self-start text-left w-[400px]"
                                    : "bg-green-100 self-end ml-auto text-right w-[400px]"
                                    }`}
                            >
                                {item.content}
                            </p>
                        ))}
                        <div ref={bottomRef} /> {/*Scroll bottom to latest chat*/}
                    </div>
                    <div className="border-t border-gray-200 p-4 flex items-center">
                        <input
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            type="text"
                            placeholder="Type your message here..."
                            className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none "
                        />
                        <button
                            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Header;
