import { useState } from "react";

function Footer() {
    const [time, setTime] = useState(new Date().toLocaleString())
    setTimeout(() => {
        setTime(new Date().toLocaleString())
    }, 1000);

    return (
        <footer className="footer bg-gray-100 fixed bottom-0 left-0 w-full">
            <hr className="border-gray-200 sm:mx-auto" />
            <p className="text-center text-sm py-2  font-mono ">
                © <span>{time}</span> NotesApp. All rights reserved.
            </p>
        </footer>
    )
}

export default Footer
