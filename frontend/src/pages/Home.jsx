import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Home = () => {
    const accessToken = localStorage.getItem("accessToken")
    const [notes, setNotes] = useState([])
    const [text, setText] = useState("")
    const [sortField, setSortField] = useState("title")
    const [sortOrder, setSortOrder] = useState("asc")
    const [debounce, setDebounce] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    useEffect(() => {
        const timer = setTimeout(() => {
            // console.log("my text", text);

            setDebounce(text)
        }, 500)
        return () => clearTimeout(timer)
    }, [text])


    const getAll = async (page = 1) => {
        try {
            const res = await axios.get(`http://localhost:8001/note/searchSortPaginateNote?sortField=${sortField}&sortOrder=${sortOrder}&searchText=${debounce}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log("res", res)

            setNotes(res.data.notes)
            setCurrentPage(res.data.pagination.currentPage)
            setTotalPage(Math.max(1, res.data.pagination.totalPages));

        } catch (error) {
            toast.error(error.reponse.data.message)
        }
    }

    const handleSortChange = (e) => {
        const [field, order] = e.target.value.split("-");
        console.log(field, order)
        setSortField(field)
        setSortOrder(order)
    }

    const handlePageChange = (page) => {
        // console.log("page val", page);

        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page)
            getAll(page)
        }
    }



    useEffect(() => {
        getAll(currentPage);
    }, [sortField, sortOrder, debounce, currentPage])


    return (<>

        <Header />
        <div className='flex items-center justify-center'>

            {/* Modal button to add new note */}
            <Link to="/createNote">
                <button className="block text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-5" type="submit">Add New Note</button>
            </Link>
            <div className="p-4 text-gray-600 dark:text-gray-300 outline-none focus:outline-none">
                <div className="relative flex">
                    <select className="bg-white text-gray-600  h-10 px-8 rounded-l-full text-sm focus:outline-none outline-none border-2 border-gray-500 dark:border-gray-600 border-r-1 cursor-pointer max-h-10 overflow-y-hidden" onChange={handleSortChange}>
                        <option className="font-medium cursor-pointer" value="filter" >
                            Select
                        </option>
                        <option className="font-medium cursor-pointer" value="title-asc">
                            title-asc
                        </option>
                        <option className="font-medium cursor-pointer" value="title-desc">
                            title-desc
                        </option>

                    </select>
                    <input
                        type="search"
                        name="search"
                        placeholder="Search"
                        className="bg-white text-black h-10 flex px-5 w-full rounded-r-full text-sm focus:outline-none border-2 border-l-0 border-gray-500 dark:border-gray-600"
                        autoComplete="off"
                        spellCheck="false"
                        required=""
                        step="any"
                        autoCapitalize="none"
                        onChange={(e) => { setText(e.target.value) }}
                        value={text}
                    />

                </div>
            </div>

        </div>


        <div className='flex justify-center items-center flex-wrap gap-6 mt-20 w-[80%] mx-auto'>
            {
                notes.map((item, index) => {
                    return <Card key={index} title={item.title} content={item.content} noteId={item._id} getAll={getAll} />
                })
            }
        </div>

        <div className="flex justify-center mt-10 gap-1">
            <button
                type="button"
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none rounded-lg text-center disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            <span className="px-3 py-1 md:px-4 md:py-2">
                Page {currentPage} of {totalPage}
                {/* Page 1 of 1 */}
            </span>

            <button
                type="button"
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none rounded-lg text-center disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPage}
            >
                Next
            </button>
        </div>


        <Footer />
    </>
    )
}

export default Home