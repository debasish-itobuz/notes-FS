import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";

function Header() {
    const user = localStorage.getItem("userName");
    let status = localStorage.getItem("loginStatus");
    const [state, setState] = useState(status);
    const accessToken = localStorage.getItem("accessToken")

    const [isOpen, setIsOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [openModal, setOpenModal] = useState(false)

    const [chatModal, setChatModal] = useState(false)


    const navigate = useNavigate();

    const toggleDropdown = async () => {
        try {

            setIsOpen((prev) => !prev)
            const res = await axios.get('http://localhost:8001/user/getAll', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })

            console.log("All user", res)
            setUsers(res.data.data)
        } catch (error) {
            console.log(error)

        }
    }

    const toggleModal = (u) => {
        setOpenModal(!openModal)
        console.log(u)
    }

    const handleLogout = async () => {
        try {

            const res = await axios.delete('http://localhost:8001/user/logout', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log(res)
            setState(false);
            navigate("/login")
            toast.success("User Logged Out Successfully")
            localStorage.clear();

        } catch (error) {
            console.log(error);
        }
    }

    const handleLogin = () => {
        navigate("/login");
    }

    return (<>
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
                                {users?.map((users, index) => {
                                    return <button key={index} className="block w-[200px] text-left py-2 px-4 hover:bg-gray-200" onClick={() => { toggleModal(users), setChatModal(true), setIsOpen(false) }}>{users.userName}</button>
                                })}
                            </div>
                        )}
                    </div>

                    <p>Hello, {user}</p><div className="self-center text-xl font-serif px-3 py-1 border border-gray-700 rounded-md transition-all hover:border-[#8B0000] hover:text-[#8B0000] cursor-pointer" onClick={handleLogout}> Logout &rarr;</div>
                </div>
            ) : (<div className="self-center text-xl font-serif px-3 py-1 border border-gray-700 rounded-md transition-all hover:border-[#8B0000] hover:text-[#8B0000] cursor-pointer" onClick={handleLogin}>Login &rarr;</div>
            )
            }

        </nav >

        {chatModal &&
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden flex flex-col h-[550px] bottom-10 right-2 absolute">
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-bold text-lg">Simple Chatbot</h1>
                        <p className="text-xs text-blue-100">Online</p>
                    </div>
                    <RxCross2 size={30} className=' cursor-pointer' onClick={() => setChatModal(false)} />

                </div>
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Pesan Bot Pertama (Statis) */}
                    <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 text-gray-800 rounded-bl-none">
                            <div className="flex items-center mb-1">
                                <i data-lucide="bot" className="mr-1 w-4 h-4" />
                                <span className="text-xs font-medium">Chatbot</span>
                                <span className="text-xs ml-2 opacity-75">10:00</span>
                            </div>
                            <p>Hello! I'm your friendly chatbot. How can I help you today?</p>
                        </div>
                    </div>
                    {/* Contoh Pesan User (Statis) */}
                    <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-lg p-3 bg-blue-600 text-white rounded-br-none">
                            <div className="flex items-center mb-1">
                                <i data-lucide="user" className="mr-1 w-4 h-4" />
                                <span className="text-xs font-medium">You</span>
                                <span className="text-xs ml-2 opacity-75">10:01</span>
                            </div>
                            <p>Hi! Can you tell me more about this?</p>
                        </div>
                    </div>
                    {/* Contoh Pesan Bot Kedua (Statis) */}
                    <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-200 text-gray-800 rounded-bl-none">
                            <div className="flex items-center mb-1">
                                <i data-lucide="bot" className="mr-1 w-4 h-4" />
                                <span className="text-xs font-medium">Chatbot</span>
                                <span className="text-xs ml-2 opacity-75">10:02</span>
                            </div>
                            <p>I'm here to help! What would you like to know?</p>
                        </div>
                    </div>
                </div>
                {/* Input Area */}
                <div className="border-t border-gray-200 p-4 flex items-center">
                    <input
                        type="text"
                        placeholder="Type your message here..."
                        className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Send
                    </button>
                </div>
            </div>
        }
    </>


    )
}

export default Header
