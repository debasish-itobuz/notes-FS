import img from '../assets/notes.jpg'
import Footer from '../components/Footer'
import Header from '../components/Header'

function Cover() {
    return (
        <div className='min-h-screen flex flex-col'>
            <Header />
            <div className="flex-grow relative overflow-hidden">
                <img src={img} className="absolute w-full h-full object-cover"></img>
            </div>
            <Footer />
        </div>
    )
}

export default Cover
