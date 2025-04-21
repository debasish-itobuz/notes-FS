import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';

function Header() {
    const user = localStorage.getItem("userName");
    // console.log("user", user)
    let status = localStorage.getItem("loginStatus");
    const [state, setState] = useState(status);
    const accessToken = localStorage.getItem("accessToken")
    // console.log("at", accessToken)

    const [isOpen, setIsOpen] = useState(false)
    const [users, setUsers] = useState([])
    const [openModal, setOpenModal] = useState(false)
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

    return (
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
                                    return <button key={index} className="block w-[200px] text-left py-2 px-4 hover:bg-gray-200" onClick={() => toggleModal(users)}>{users.userName}</button>
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
    )
}

export default Header
