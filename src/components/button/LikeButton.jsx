import React, { useContext, useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import {
    useCreateLikesMutation,
    useDeleteLikesMutation,
    useGetPostLikesQuery,
    useUpdatePostMutation,
} from "../../features/post/postSlice";
import Loading from "../Loading";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const LikeButton = ({ post }) => {
    const [isAlreadyLiked, setIsAlreadyLiked] = useState(false);

    const { isLoggedIn } = useContext(AuthContext);

    const {
        data: likePosts,
        isLoading,
        isError,
        error,
        isSuccess,
        refetch
    } = useGetPostLikesQuery(post.id);

    
    const [updatePost] = useUpdatePostMutation();
    const [createLikes] = useCreateLikesMutation();
    const [deleteLikes] = useDeleteLikesMutation();
    
    useEffect(() => {
        // Check if the current user already liked the post
        if (likePosts) {
            const likedByUser = likePosts.some(
                (likePost) => likePost.user == localStorage.getItem("user_id")
            );
            // console.log("like by user : " , likedByUser)
            setIsAlreadyLiked(likedByUser);
        }
    }, [likePosts]); 

    // if (isLoading) return <div>Loading...</div>;
    if (isLoading) return <Loading />;
    // console.log("post: ", post.id, "liked: ", likePosts);


    const handlePostUpdate = async () => {

        if (isAlreadyLiked) {
            // Unlike the post
            const updatedData = {
                ...post,
                likes: Number(post.likes) - 1,
            };
            try {
                await updatePost({ id: post.id, data: updatedData });
                const userLike = likePosts.find(likePost => likePost.user == localStorage.getItem("user_id"));
                if (userLike) {
                    await deleteLikes(userLike.id);
                }
                // console.log("Post unliked successfully");
            } catch (error) {
                // console.error('Error updating post:', error);
            }
        } else {
            // Like the post
            const updatedData = {
                ...post,
                likes: Number(post.likes) + 1,
            };
            try {
                await updatePost({ id: post.id, data: updatedData });
                await createLikes({ post: post.id, user: localStorage.getItem("user_id") });
            } catch (error) {
                // console.error('Error updating post:', error);
            }
        }
        refetch();
    };

    const handleLikeBtn = () => {
        if (isLoggedIn) {
            handlePostUpdate();
        } else{
            toast.error("You need to login to like the post",{
                position: "top-right",
            });
        }
    };

    return (
        <button onClick={()=>handleLikeBtn()} className="px-4 py-2 flex items-center justify-center border-2 rounded-md bg-slate-50" >
            <AiFillLike className={`text-xl font-bold ${isAlreadyLiked ? "text-blue-500" : "text-gray-500"}`} />
        </button>
    );
};

export default LikeButton;
