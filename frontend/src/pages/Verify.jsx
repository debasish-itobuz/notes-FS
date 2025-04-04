import { useEffect, useState } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'

function Verify() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const params = useParams();
    const verifyToken = params.token;
    console.log("verifyToken", verifyToken)

    const VerifyMail = async () => {
        try {
            const res = await axios.get('http://localhost:8001/user/verify', {
                headers: {
                    Authorization: `Bearer ${verifyToken}`,
                }
            })
            console.log("verify", res)
            setMessage(res.data.message)
            setTimeout(() => navigate('/login'), 3000);

        } catch (error) {
            setMessage(error.response?.data?.message)
            console.log(error)
        }
    }

    useEffect(() => {
        VerifyMail()
    }, [])

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="bg-white p-5 rounded text-center">
                {message}
            </div>
        </div>
    )
}

export default Verify
