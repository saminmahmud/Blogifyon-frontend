import React, { useContext } from "react";
import Category from "../category/Category";
import { Link, useLocation, useNavigate } from "react-router";
import LikeButton from "../button/LikeButton";
import SavePost from "../SavePost";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";


const PostCard = ({ post }) => {
    const { isLoggedIn } = useContext(AuthContext);

    const navigate = useNavigate();

    const location = useLocation();

    const isOnProfilePage = location.pathname.startsWith("/user/");

    return (
        <div className="relative flex flex-col md:flex-row w-full my-6 bg-neutral-900 shadow-sm border border-slate-600 rounded-lg">
            <div className="relative p-2.5 md:w-2/5 shrink-0 overflow-hidden">
                <img
                    src={post.post_image_url}
                    alt="card-image"
                    class="h-full w-full rounded-md md:rounded-lg object-cover"
                />
            </div>
            <div class="p-6">
                {
                    isLoggedIn && (
                        <div className="mb-1 flex justify-end items-end space-x-4">
                            <SavePost post_id={post.id} />
                        </div>
                    )
                }
                <h4 className="mb-2 text-slate-300 text-xl font-semibold">
                    {post.title}
                </h4>
                <p className="mb-3 text-slate-400 leading-normal font-light">
                    {post.content.slice(0, 70)}...
                </p>

                <div className="mt-4 text-sm text-gray-400">
                    <span className="font-semibold">Category: </span>
                    {post.categories.map((category, index) => (
                        <span key={category.id}>
                            {category.name}
                            {index < post.categories.length - 1 ? ", " : ""}
                        </span>
                    ))}
                </div>

                <p className="mt-1 text-sm text-gray-400">
                    <span className="font-semibold">Likes:</span> {post.likes}
                </p>
                {/*  */}
                <p className="mt-2 text-sm text-gray-400 text-end">
                    <span className="font-semibold">Author: </span>

                    {isOnProfilePage ? (
                        <span>{post.author.user.username}</span>
                    ) : (
                       isLoggedIn ? 
                       <Link
                            className="text-blue-500"
                            to={`/user/${post.author.user.id}`}
                        >
                            {post.author.user.username}
                        </Link>
                       :
                          <span>{post.author.user.username}</span>
                    )}
                </p>

                <p className="my-2 text-xs text-gray-400 text-end">
                    <span className="font-semibold">Created at:</span>{" "}
                    {new Date(post.created_at).toLocaleString()}
                </p>

                <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-center items-center space-x-2 sm:space-x-4">
                        <LikeButton post={post} />

                        <button
                            onClick={() => {
                                if(isLoggedIn){
                                    navigate(`/post/details/${post.id}`);
                                }else{
                                    toast.error("You need to login to see details",{
                                        position: "top-right",
                                    });
                                }
                            }}
                            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200 text-center"
                        >
                            See Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
