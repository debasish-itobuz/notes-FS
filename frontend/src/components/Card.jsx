import React, { useContext, useState } from 'react'
import { SlNote } from "react-icons/sl";
import { FiTrash } from "react-icons/fi";
import { myContext } from "../context/myContext.jsx";
import { useNavigate } from 'react-router-dom';
import DeleteNoteModal from './DeleteNoteModal.jsx';

const Card = ({ title, content, noteId, getAll }) => {

    const { setId } = useContext(myContext)
    const [openDelModal, setOpenDelModal] = useState(false)
    const navigate = useNavigate()
    return (
        <div className='flex p-3'>
            <div className="w-[300px] rounded overflow-hidden shadow-lg flex justify-between">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 w-[170px] overflow-x-scroll no-scrollbar">{title}</div>
                    <p className="text-gray-700 text-base">{content}</p>
                </div>
                <div className='flex px-6 py-4 gap-5'>
                    <SlNote className="size=5 cursor-pointer" onClick={() => { setId(noteId); navigate("/editNote") }} />
                    <FiTrash className="size=5 cursor-pointer" onClick={() => { setId(noteId); setOpenDelModal(true) }} />
                </div>
            </div>
            {openDelModal && <DeleteNoteModal openDelModal={openDelModal} setOpenDelModal={setOpenDelModal} getAll={getAll} />}
        </div>
    )
}

export default Card
