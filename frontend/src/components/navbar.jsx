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
                <div className="fixed top-0 left-0 w-screen h-screen bg-green-600 z-50 text-white p-6 flex flex-col gap-6 transition-all overflow-y-auto">
                    <div className="m-9">
                        <Hamburger toggled={Menu} toggle={setMenu} color="white" />
                    </div>
                    <section className="font-medium font-mono font-stretch-50% flex flex-col gap-4 justify-around">
                        <a href="/" onClick={() => setMenu(false)}>Home</a>
                        <a href="/prayertime" onClick={() => setMenu(false)}>Prayer Time</a>
                        <a href="/calendar" onClick={() => setMenu(false)}>Calendar</a>
                        <a href="/volunteer" onClick={() => setMenu(false)}>Volunteer</a>
                        <a href="/leaderboard" onClick={() => setMenu(false)}>Leaderboard</a>
                        <a href="/donate" onClick={() => setMenu(false)}>Donate</a>
                        <a href="/about" onClick={() => setMenu(false)}>About Us</a>
                        <br /><br />
                        {!authUser ? (
                            <>
                                <a href="/login" onClick={() => setMenu(false)}>Login</a>
                                <a href="/signup" onClick={() => setMenu(false)}>Signup</a>
                            </>
                        ) : (
                            <>
                                <a href="/profile" onClick={() => setMenu(false)}>Profile ({authUser.username})</a>
                                {authUser.is_admin && (
                                    <a href="/admin" className="text-yellow-300 font-semibold" onClick={() => setMenu(false)}>
                                        Admin Dashboard
                                    </a>
                                )}
                            </>
                        )
                        }
                    </section>
                </div>
            )}
        </>
    )
}

export default NavBar