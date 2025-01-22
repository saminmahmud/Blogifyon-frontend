import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useLogoutMutation } from "../features/user/userSlice";
import { AuthContext } from "../context/AuthContext";
import { isAuthenticated } from "../auth/auth";
import { useGetAuthorDetailsQuery } from "../features/author/authorSlice";
import { useSearchNotificationQuery } from "../features/notification/notificationSlice";
import { IoMdNotifications } from "react-icons/io";
import { GoChevronDown, GoDotFill } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { useGetAllCommentsQuery, useGetAllRepliesQuery } from "../features/comment/commentSlice";

const token = localStorage.getItem("token");
// const WEBSOCKET_URL = `ws://127.0.0.1:8000/ws/notifications/?token=${token}`;
const WEBSOCKET_URL = `wss://blogifyon-backend.onrender.com/ws/notifications/?token=${token}`;

const Nav = () => {
    const {
        data: notifications,
        error: notificationError,
        isLoading: notificationIsLoading,
        refetch,
    } = useSearchNotificationQuery(localStorage.getItem("user_id"));

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [socket, setSocket] = useState(null);
    const [localNotifications, setLocalNotifications] = useState(
        notifications || []
    );

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const {
        data: authorinfo,
        error,
        isLoading,
        refetch: refetchAuthor,
    } = useGetAuthorDetailsQuery(localStorage.getItem("user_id"));

    const {data:allComments, refetch:allCommentRefetch} = useGetAllCommentsQuery();
    const {data:allReplies, refetch:allReplyRefetch} = useGetAllRepliesQuery();

    const [logout] = useLogoutMutation();

    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const closeSearch = (event) => {
        if (
            !event.target.closest("#searchButton") &&
            !event.target.closest("#searchInput")
        ) {
            setIsSearchOpen(false);
        }
    };

    const closeDropdown = (event) => {
        if (!event.target.closest("#profileButton")) {
            setIsDropdownOpen(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search/?q=${searchQuery}`);
            setSearchQuery("");
        }
    };

    const handleLogout = async () => {
        await logout().unwrap();
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        setIsLoggedIn(isAuthenticated());
        navigate("/login");
    };

    useEffect(() => {
        window.addEventListener("click", closeDropdown);
        window.addEventListener("click", closeSearch);
        return () => {
            window.removeEventListener("click", closeDropdown);
            window.removeEventListener("click", closeSearch);
        };
    }, []);

    const handleNotification = async () => {
        setIsNotificationModalOpen(!isNotificationModalOpen);

        const notificationNotSeen = notifications.filter(
            (notification) => notification.is_read === false
        );
        // console.log("NotSeen", notificationNotSeen);

        for (const notification of notificationNotSeen) {
            // console.log(`Updating notification ID: ${notification.id}`);
            try {
                const res = await fetch(
                    `https://blogifyon-backend.onrender.com/notification/${notification.id}/`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Token ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json", 
                        },
                        body: JSON.stringify({
                            is_read: true,
                            id: notification.id,
                            user: notification.user,
                            post: notification.post,
                            content: notification.content,
                        }),
                    }
                );

                if (res.ok) {
                    refetch();
                    refetchAuthor();
                    allCommentRefetch();
                    allReplyRefetch();
                }
            } catch (error) {
                // console.error("Error updating notification:", error);
            }
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            const socket = new WebSocket(WEBSOCKET_URL);
            // const socket = new WebSocket(`wss://blogifyon-backend.onrender.com/ws/notifications/?token=${token}`);
            // console.log("Connecting to WebSocket:", socket);

            socket.onopen = () => {
                // console.log("WebSocket connected");
                setLocalNotifications(notifications);
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // console.log("Received notification:", data);

                if (data && data.notification) {
                    const newNotification = data.notification;
                    if (newNotification && newNotification.content) {
                        // console.log("New Notification", newNotification);
                        setLocalNotifications((prevNotifications) => {
                            return [newNotification, ...prevNotifications]; 
                        });
                        refetch(); 
                    } else {
                        // console.error("Received invalid notification:", data);
                    }
                } else {
                    // console.error("Invalid WebSocket message received:", data);
                }
            };

            socket.onclose = () => {
                // console.log("WebSocket disconnected");
                if (event.code !== 1000) { 
                    // console.log("Reconnecting to WebSocket...");
                    setTimeout(() => {
                        setSocket(new WebSocket(`wss://blogifyon-backend.onrender.com/ws/notifications/?token=${token}`));
                    }, 1000); 
                }
            };

            setSocket(socket);

            return () => {
                socket.close();
            };
        }
    }, [isLoggedIn, notifications]);


    const unreadNotificationsCount = localNotifications?.filter(
        (notification) => notification.is_read === false
    ).length;

 

    return (
        <nav className="bg-transparent p-2 border-b fixed top-0 left-0 right-0 z-10 shadow-md backdrop-blur-md ">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo and Hamburger Menu */}
                <div className="flex justify-center items-center space-x-4">
                    {/* Hamburger Menu (Mobile) */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    <Link
                        to="/"
                        className="text-white text-xl font-semibold hidden md:flex"
                    >
                        Blogifyon
                    </Link>
                </div>

                <Link
                    to="/"
                    className={`text-white text-xl font-semibold sm:block md:hidden ${
                        isSearchOpen ? "hidden" : "block"
                    }`}
                >
                    Blogifyon
                </Link>

                {/* Navbar Links */}
                <div
                    className="hidden md:flex space-x-4"
                >
                    <Link
                        to="/"
                        className="text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Home
                    </Link>

                    {isLoggedIn && (
                        <Link
                            to="/add-post"
                            className="text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Add Post
                        </Link>
                    )}
                    <Link
                        to="/about"
                        className="text-white hover:bg-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        About
                    </Link>

                    {!isLoggedIn && (
                        <>
                            <Link
                                to="/login"
                                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Profile Dropdown (Right Side) */}
                {isLoggedIn && (
                    <div className="relative">
                        <div className=" flex justify-center items-center space-x-4">
                            {/*  */}
                            <div className="flex items-center justify-center">
                                {/* Search Icon */}
                                <button
                                    id="searchButton"
                                    onClick={toggleSearch}
                                    className="text-white"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 0l6 6"
                                        />
                                    </svg>
                                </button>

                                {/* Search Box */}
                                {isSearchOpen && (
                                    <form
                                        action=""
                                        onSubmit={handleSearchSubmit}
                                    >
                                        <input
                                            id="searchInput"
                                            type="search"
                                            className="ml-2 px-2 py-1 w-28 sm:w-full rounded-md text-black"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                        />
                                    </form>
                                )}
                            </div>

                            {/* Notification Icon */}
                            
                            <div className="relative" onClick={() => handleNotification()}>
                                <IoMdNotifications  className="text-white text-2xl cursor-pointer" />
                                <span className="bg-red-500 text-xs font-bold text-white rounded-full w-4 h-4 flex items-center justify-center absolute top-0 right-0 translate-x-1 -translate-y-1 cursor-pointer">
                                    {unreadNotificationsCount}
                                </span>
                            </div>

                            {/*  */}

                            <button
                                id="profileButton"
                                onClick={toggleDropdown}
                                className="relative flex items-center text-white"
                            >
                                <img
                                    src={authorinfo?.profile_picture_url}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full"
                                />
                                <GoChevronDown
                                    className="absolute bottom-0 right-0 translate-x-1 translate-y-1 text-white bg-black rounded-full bg-opacity-50"
                                />
                            </button>
                        </div>

                        {/* Dropdown Menu */}
                        <div
                            id="profileDropdown"
                            className={`z-10 absolute right-0 mt-2 w-48 bg-white text-black border border-gray-200 rounded-lg shadow-lg ${
                                isDropdownOpen ? "block" : "hidden"
                            }`}
                        >
                            <button
                                onClick={() =>
                                    navigate(
                                        `/user/${localStorage.getItem(
                                            "user_id"
                                        )}`
                                    )
                                }
                                className="block px-4 py-2 text-sm hover:underline"
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => handleLogout()}
                                className="block px-4 py-2 text-sm hover:underline"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu (Hidden by default, shown on click) bg-gray-800 bg-opacity-85 */}
            <div
                className={`lg:hidden h-screen fixed inset-0 bg-gray-950 bg-opacity-85 z-50 ${
                    isMobileMenuOpen ? "block" : "hidden"
                }`}
            >
                <div className="flex justify-end p-4">
                    <button onClick={toggleMobileMenu} className="text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col items-center">
                    <Link to="/" className="text-white py-2 hover:underline">
                        Home
                    </Link>
                    <Link to="/add-post" className="text-white py-2 hover:underline">
                        Add Post
                    </Link>
                    <Link to="/about" className="text-white py-2 hover:underline">
                        About
                    </Link>
                    {!isLoggedIn && (
                        <>
                            <Link
                                to="/login"
                                className="text-white py-2 hover:underline"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-white py-2 hover:underline"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Modal for Notifications */}
            {isNotificationModalOpen && (
                <div className="h-screen fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                Notifications
                            </h2>

                            <RxCross2 onClick={() =>
                                    setIsNotificationModalOpen(
                                        !isNotificationModalOpen
                                    )
                                }
                                className="text-gray-500 hover:text-gray-700 cursor-pointer text-2xl"
                            />
                        </div>

                        <div className="mt-4 max-h-64 overflow-y-auto">
                            {localNotifications?.length > 0 ? (
                                <ul>
                                    {localNotifications.map((notification) => (
                                        <li
                                            onClick={() =>
                                                setIsNotificationModalOpen(
                                                    !isNotificationModalOpen
                                                )
                                            }
                                            key={notification.id}
                                            className="border-b py-2"
                                        >
                                            {notification.post ? (
                                                <Link
                                                    to={`/post/details/${notification.post}`}
                                                    className="hover:underline hover:underline-offset-2"
                                                >
                                                    {notification.content}
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/user/${notification.user}`}
                                                    className="hover:underline hover:underline-offset-2"
                                                >
                                                    {notification.content}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    No notifications yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Nav;
