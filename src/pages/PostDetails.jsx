import React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useGetPostDetailsQuery } from "../features/post/postSlice";
import LikeButton from "../components/button/LikeButton";
import CommentButton from "../components/button/CommentButton";
import Loading from "../components/Loading";
import SavePost from "../components/SavePost";
import ErrorPage from "../components/ErrorPage";

const PostDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: post,
        isLoading,
        isError,
        error,
        isSuccess,
    } = useGetPostDetailsQuery(id);

    return (
        <div className="mt-5">
            {isLoading && <Loading />}

            {isError && <ErrorPage />}

            {isSuccess && (
                <div className="max-w-full md:max-w-[80%] mx-auto ">
                    <button onClick={() => navigate(-1)} className="mb-5  mt-2">
                        <IoMdArrowRoundBack className="text-2xl" />{" "}
                    </button>

                    <br />

                    <div className="space-y-4">
                        {post.post_image_url && (
                            <img
                                className="w-full h-72 object-cover rounded-lg mb-5"
                                src={post.post_image_url}
                                alt=""
                            />
                        )}

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="mt-2 text-sm text-gray-400 text-end">
                                    <span className="font-bold">Author: </span>
                                    <Link
                                        className=" text-blue-500"
                                        to={`/user/${post.author.user.id}`}
                                    >
                                        {post.author.user.username}
                                    </Link>
                                </p>
                            </div>

                            <div className="flex justify-end items-end  space-x-4 p-2">
                                <p className="mt-1 text-sm text-gray-400">
                                    <span className="font-semibold">
                                        Likes:
                                    </span>{" "}
                                    {post.likes}
                                </p>
                                <SavePost post_id={post.id} />
                            </div>
                        </div>

                        <h1 className="text-2xl font-semibold text-gray-200">
                            {post.title}
                        </h1>

                        <p className="text-lg text-gray-300">{post.content}</p>

                        <div className="mt-4 text-sm text-gray-400">
                            <span className="font-bold">Category: </span>
                            {post.categories.map((category, index) => (
                                <span key={category.id}>
                                    {category.name}
                                    {index < post.categories.length - 1
                                        ? ", "
                                        : ""}
                                </span>
                            ))}
                        </div>

                        <p className="mt-2 text-xs text-gray-400 text-end">
                            <span className="font-bold">Created at:</span>{" "}
                            {new Date(post.created_at).toLocaleString()}
                        </p>

                        <div className="p-4 border-t border-gray-200">
                            <div className="flex justify-center items-center space-x-2 sm:space-x-4">
                                <LikeButton post={post} />
                                <CommentButton post_id={post.id} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
