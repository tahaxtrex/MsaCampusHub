import { SlSocialInstagram } from "react-icons/sl";
import { FaWhatsapp } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { Link } from "react-router";
import { MdOutlineMailOutline } from "react-icons/md";


const Footer1 = ()=>{
    const size = ' h-8 w-8'
    return (
        <>
            <footer className="justify-center items-center mt-6 backdrop-blur-md shadow-inner bg-white/15 h-52">
                <section className=" max-w-screen-xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-center bg-amber-400">
                    <div className="flex items-center space-x-3">
                        <Link to={"https://www.instagram.com/muslimsofcub/"}>
                            <SlSocialInstagram className="h-8 w-8 mx-2 hover:scale-110 transition-transform duration-300"></SlSocialInstagram>
                        </Link>
                        <Link to={"https://chat.whatsapp.com/Izg7UIoa3QN2fEqqUJUMx8"}>
                            <FaWhatsapp className="h-9 w-9 mx-2 hover:scale-110 transition-transform duration-300"></FaWhatsapp>
                        </Link>
                        <Link to={'https://www.linkedin.com/in/taha-hbirri-84a524311/'}>
                            <CiLinkedin className="h-10 w-10 mx-2 hover:scale-110 transition-transform duration-300"></CiLinkedin>
                        </Link>
                        <Link>
                            <MdOutlineMailOutline className="h-10 w-10 mx-2 hover:scale-110 transition-transform duration-300"/>
                        </Link>
                    </div>
                    <div>

                    </div>
                    <div>

                    </div>
                </section>

            </footer>
        </>
    )
}

export default Footer1;