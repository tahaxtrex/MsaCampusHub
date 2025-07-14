import { Link } from "react-router-dom";
import logo from "../assets/msapng.png"

const NavBar = () => {

    const navproperties = 'p-4 hover:text-shadow-2xs'
    return (
        <>

            <nav className="sticky top-6 z-50 mx-32 justify-center mt-6 backdrop-blur-md bg-white/5 shadow-xl rounded-4xl border border-white/10">
                <div className="px-6 py-4 flex justify-between max-w-7x items-center text-gray-900">
                    <div className=" flex flex-row items-center ">
                        <div className="mx-4">
                            <Link to={"/"}><img src={logo} className=" max-h-10 ml-2"/></Link>
                        </div>
                        <div>
                            <Link to={"/"} className="p-4 hover:text-shadow-2xs">Home</Link>
                        </div>
                        <div>
                            <Link to={"/prayerpage"} className={navproperties}>Prayer time</Link>
                        </div>
                        <div>
                            <Link to={"/"}className={navproperties}>Calendar</Link>
                        </div>
                        <div>
                            <Link to={"/"}className={navproperties}>Donate</Link>
                        </div>
                        <div>
                            <Link to={"/"}className={navproperties}>About us</Link>
                        </div>
                    </div>
                    <div>

                    </div>
                    
                </div>
            </nav>



        </>
    )
}

export default NavBar