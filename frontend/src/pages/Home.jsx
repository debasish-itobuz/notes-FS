import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Home = () => {
    const [notes, setNotes] = useState([])
    const accessToken = localStorage.getItem("accessToken")
    const [selectedState, setSelectedState] = useState("")
    console.log(selectedState);


    const getAll = async () => {
        try {
            const res = await axios.get("http://localhost:8001/note/getAll", {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            // console.log("res", res)
            setNotes(res.data.data)

        } catch (error) {
            toast.error(error.reponse.data.message)
        }
    }

    useEffect(() => {
        getAll();
    }, [])


    return (<>

        <Header />
        <div className='flex items-center justify-center'>

            {/* Modal button to add new note */}
            <Link to="/createNote">
                <button className="block text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-5" type="submit">Add New Note</button>
            </Link>
            <div className="p-4 text-gray-600 dark:text-gray-300 outline-none focus:outline-none">
                <div className="relative flex">
                    <select className="bg-white text-gray-600  h-10 px-8 rounded-l-full text-sm focus:outline-none outline-none border-2 border-gray-500 dark:border-gray-600 border-r-1 cursor-pointer max-h-10 overflow-y-hidden" onChange={(e) => { setSelectedState(e.target.value); console.log("my select", e.target.value) }}>
                        <option className="font-medium cursor-pointer" value="filter" >
                            Select
                        </option>
                        <option className="font-medium cursor-pointer" value="asc">
                            filter by asc
                        </option>
                        <option className="font-medium cursor-pointer" value="desc">
                            filter by desc
                        </option>

                    </select>
                    <input
                        type="search"
                        name="search"
                        placeholder="Search"
                        className="bg-white h-10 flex px-5 w-full rounded-r-full text-sm focus:outline-none border-2 border-l-0 border-gray-500 dark:border-gray-600"
                        autoComplete="off"
                        spellCheck="false"
                        required=""
                        step="any"
                        autoCapitalize="none"
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 mr-2 flex items-center px-2"
                    >
                        <svg
                            className="h-4 w-4 fill-current dark:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 56.966 56.966"
                            xmlSpace="preserve"
                            width="512px"
                            height="512px"
                        >
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button>
                </div>
            </div>

        </div>


        <div className='flex flex-wrap gap-6 mt-20'>
            {
                notes.map((item, index) => {
                    return <Card key={index} title={item.title} content={item.content} noteId={item._id} getAll={getAll} />
                })
            }
        </div>
        <Footer />
    </>
    )
}

export default Home
