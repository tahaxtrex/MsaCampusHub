import { Link } from "react-router-dom";
import logo from "../assets/msapng.png"
import { Sling as Hamburger } from 'hamburger-react'
import { useEffect, useState } from "react";
import TiltedCard from "./logo";
import { useAuthStore } from "../store/useAuthStore";

const NavBar = () => {

    const navproperties = 'p-4 hover:text-shadow-2xs items-center'
    const [Menu, setMenu] = useState(false)

    const { checkAuth, authUser } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);


    return (
        <>

            <nav className="hidden lg:flex sticky top-6 z-50 mx-32 mt-6 backdrop-blur-md bg-white/5 shadow-xl rounded-4xl border border-white/10">
                <div className="px-6 py-4 flex justify-between max-w-7x items-center text-gray-900 w-full">
                    <div className="hidden lg:flex flex-row items-center ">
                        <div className="mx-4">
                            <Link to={"/"}><img src={logo} className=" max-h-10 ml-2" /></Link>
                        </div>
                        <div>
                            <Link to={"/"} className="p-4 hover:text-shadow-2xs">Home</Link>
                        </div>
                        <div>
                            <Link to={"/prayertime"} className={navproperties}>Prayer time</Link>
                        </div>
                        <div>
                            <Link to={"/calendar"} className={navproperties}>Calendar</Link>
                        </div>
                        <div>
                            <Link to={"/volunteer"} className={navproperties}>Volunteer</Link>
                        </div>
                        <div>
                            <Link to={"/leaderboard"} className={navproperties}>Leaderboard</Link>
                        </div>
                        <div>
                            <Link to={"/donate"} className={navproperties}>Donate</Link>
                        </div>
                        <div>
                            <Link to={"/about"} className={navproperties}>About us</Link>
                        </div>
                        {authUser?.is_admin && (
                            <div>
                                <Link
                                    to={"/admin"}
                                    className="p-4 hover:text-shadow-2xs text-blue-600 font-medium"
                                >
                                    Admin
                                </Link>
                            </div>
                        )}
                    </div>
                    {!authUser ? (
                        <div className="hidden lg:flex flex-row items-end">
                            <Link to="/login" className={navproperties}>Login</Link>
                            <Link to="/signup" className={navproperties}>Signup</Link>
                        </div>
                    ) : (
                        <div className="hidden lg:flex flex-row items-end">
                            <Link to="/profile" className='p-4 hover:text-shadow-2xs items-center' >{authUser.username}</Link>
                            <Link to={'/profile'}><img src={authUser?.avatar_url || "/user/user.png"} alt="user avatar" className="h-10 w-10 rounded-full mb-1.5 object-cover" /></Link>
                        </div>
                    )}
                </div>
            </nav>
            <div className="lg:hidden m-7">
                <Hamburger toggled={Menu} toggle={setMenu} rounded color="green" />
                <div className="hidden lg:flex">
                    <TiltedCard
                        imageSrc={logo}
                        altText="msa logo"
                        captionText="hover me"
                        containerHeight="200px"
                        containerWidth="200px"
                        imageHeight="200px"
                        imageWidth="200px"
                        rotateAmplitude={18}
                        scaleOnHover={1.1}
                        showMobileWarning={false}
                        showTooltip={true}
                        displayOverlayContent={true}
                        overlayContent={
                            <p className="tilted-card-demo-text mr-10">
                            </p>
                        }
                    />
                </div>
            </div>
            {Menu && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-xl transition-all duration-300">
                    <div className="flex justify-end p-6">
                        <Hamburger toggled={Menu} toggle={setMenu} color="#166534" rounded />
                    </div>

                    <div className="flex flex-col items-center justify-center flex-1 gap-8 pb-20">
                        <div className="flex flex-col items-center gap-6 w-full px-8">
                            <Link to="/" onClick={() => setMenu(false)} className="text-2xl font-medium text-gray-800 hover:text-green-600 transition-colors">Home</Link>
                            <Link to="/prayertime" onClick={() => setMenu(false)} className="text-2xl font-medium text-gray-800 hover:text-green-600 transition-colors">Prayer Time</Link>
                            <Link to="/calendar" onClick={() => setMenu(false)} className="text-2xl font-medium text-gray-800 hover:text-green-600 transition-colors">Calendar</Link>
                            <Link to="/volunteer" onClick={() => setMenu(false)} className="text-2xl font-medium text-gray-800 hover:text-green-600 transition-colors">Volunteer</Link>
                            <Link to="/leaderboard" onClick={() => setMenu(false)} className="text-2xl font-medium text-gray-800 hover:text-green-600 transition-colors">Leaderboard</Link>
                            <Link to="/donate" onClick={() => setMenu(false)} className="text-2xl font-medium text-gray-800 hover:text-green-600 transition-colors">Donate</Link>
                            <Link to="/about" onClick={() => setMenu(false)} className="text-2xl font-medium text-gray-800 hover:text-green-600 transition-colors">About Us</Link>
                        </div>

                        <div className="w-16 h-1 bg-green-100 rounded-full"></div>

                        <div className="flex flex-col items-center gap-4">
                            {!authUser ? (
                                <>
                                    <Link to="/login" onClick={() => setMenu(false)} className="px-8 py-3 text-lg font-semibold text-green-700 bg-green-50 rounded-xl w-64 text-center">Login</Link>
                                    <Link to="/signup" onClick={() => setMenu(false)} className="px-8 py-3 text-lg font-semibold text-white bg-green-600 rounded-xl w-64 text-center shadow-lg shadow-green-200">Sign Up</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" onClick={() => setMenu(false)} className="flex items-center gap-3 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <img src={authUser?.avatar_url || "/user/user.png"} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-green-500" />
                                        <span className="text-lg font-semibold text-gray-800">{authUser.username}</span>
                                    </Link>
                                    {authUser.is_admin && (
                                        <Link to="/admin" onClick={() => setMenu(false)} className="text-yellow-600 font-semibold text-lg">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NavBar