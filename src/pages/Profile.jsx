import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useGetAuthorDetailsQuery } from "../features/author/authorSlice";
import { useAuthorPostQuery } from "../features/post/postSlice";
import PostCard from "../components/post/PostCard";
import Loading from "../components/Loading";
import SendMail from "../components/SendMail";
import ProfileEdit from "../components/ProfileEdit";
import Following from "../components/Following";
import {
    FaBookmark,
    FaFacebook,
    FaHouseUser,
    FaLinkedin,
    FaTwitter,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import ErrorPage from "../components/ErrorPage";

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: authorInfo,
        error,
        isLoading,
        refetch: authorRefetch,
    } = useGetAuthorDetailsQuery(id);

    const [ordered, setOrdered] = useState("-created_at");

    const username = authorInfo?.user?.username;

    const {
        data: authorPosts,
        isLoading: postsLoading,
        error: postsError,
        refetch,
    } = useAuthorPostQuery({ username: username, ordered: ordered });

    useEffect(() => {
        if (username && ordered) {
            refetch();
        }
    }, [username, ordered, refetch]);

    const handleOrderChange = (e) => {
        // console.log("changed : " + e.target.value);
        setOrdered(e.target.value);
        // refetch();
    };

    if (isLoading || postsLoading) return <Loading />;

    if (error || postsError) return <ErrorPage />;

    return (
        <div className="max-w-full md:max-w-[80%] mx-auto pb-5 md:pb-8 mt-5">
            <div className="space-y-4">
                <div className="relative flex flex-col justify-center items-center space-y-2 pb-2">
                    <div className="absolute top-4 right-0 space-y-5">
                        {localStorage.getItem("user_id") == id ? (
                            <>
                                <ProfileEdit
                                    authorInfo={authorInfo}
                                    refetch={authorRefetch}
                                />
                                <FaBookmark
                                    onClick={() => navigate(`/saved-post`)}
                                    className="text-lg text-cyan-500 cursor-pointer "
                                />
                            </>
                        ) : (
                            <>
                                <SendMail author={authorInfo.id} />
                                <Following
                                    authorInfo={authorInfo}
                                    refetch={authorRefetch}
                                />
                            </>
                        )}
                    </div>
                    <div className="">
                        <img
                            src={authorInfo?.profile_picture_url}
                            alt="Profile"
                            className="w-20 h-20 md:w-28 md:h-28 rounded-full"
                        />
                    </div>
                    <h1 className="text-xl font-bold ">
                        {authorInfo.user.username}
                    </h1>
                    {authorInfo.bio && (
                        <p className="font-bold">
                            Bio:{" "}
                            <span className="font-semibold">
                                {authorInfo.bio}
                            </span>{" "}
                        </p>
                    )}
                </div>

                <div className="space-y-1 pb-2 bg-zinc-950 shadow px-5 py-3 shadow-gray-700">
                    <div className="space-y-1">
                        <p className="font-bold flex items-center space-x-1">
                            <MdEmail className="inline-block text-lg text-yellow-200" />
                            <span className="font-semibold">
                                {authorInfo.user.email}
                            </span>
                        </p>
                        {authorInfo.facebook && (
                            <p className="font-bold flex items-center space-x-1">
                                <FaFacebook className="inline-block text-lg text-blue-400" />
                                <span className="font-semibold">
                                    {authorInfo.facebook}
                                </span>
                            </p>
                        )}
                        {authorInfo.linkedin && (
                            <p className="font-bold flex items-center space-x-1">
                                <FaLinkedin className="inline-block text-lg text-blue-500" />
                                <span className="font-semibold">
                                    {authorInfo.linkedin}
                                </span>{" "}
                            </p>
                        )}
                        {authorInfo.twitter && (
                            <p className="font-bold flex items-center space-x-1">
                                <FaTwitter className="inline-block text-lg text-blue-400" />
                                <span className="font-semibold">
                                    {authorInfo.twitter}
                                </span>
                            </p>
                        )}
                        {authorInfo.address && (
                            <p className="font-bold flex items-center space-x-1">
                                <FaHouseUser className="inline-block text-lg text-green-400" />
                                <span className="font-semibold">
                                    {authorInfo.address}
                                </span>
                            </p>
                        )}
                        <p className="font-bold">
                            Followers:{" "}
                            <span className="font-semibold">
                                {authorInfo.followers.length}
                            </span>{" "}
                        </p>
                        <p className="font-bold">
                            Following:{" "}
                            <span className="font-semibold">
                                {authorInfo.following.length}
                            </span>{" "}
                        </p>
                        <p className="font-bold">
                            Join Date:{" "}
                            <span className="font-semibold">
                                {new Date(
                                    authorInfo.join_date
                                ).toLocaleDateString()}
                            </span>{" "}
                        </p>
                    </div>
                </div>

                <div>
                    <div>
                        <div className="px-4 py-2 flex flex-col md:flex-row justify-between items-center border-b-2">
                            <h1 className="text-lg font-bold">
                                Total Posts:{" "}
                                <span className="font-semibold">
                                    {authorInfo.post_count}
                                </span>
                            </h1>

                            <div>
                                {/* sort posts */}
                                <label
                                    className="text-lg font-bold"
                                    htmlFor="sort"
                                >
                                    Sort Posts:{" "}
                                </label>
                                <select
                                    name="sort"
                                    id="sort"
                                    value={ordered}
                                    onChange={handleOrderChange}
                                    className="p-1 bg-slate-900 border border-gray-200 rounded-lg focus:outline-none "
                                >
                                    <option value="-created_at">Newest</option>
                                    <option value="created_at">Oldest</option>
                                    <option value="-likes">Most Liked</option>
                                    <option value="likes">Least Liked</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-5 pt-1">
                            {postsLoading ? (
                                <Loading />
                            ) : authorPosts.length > 0 ? (
                                authorPosts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))
                            ) : (
                                <div>No posts available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
