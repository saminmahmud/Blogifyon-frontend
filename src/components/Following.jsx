import React, { useEffect, useState } from "react";
import { RiUserFollowFill } from "react-icons/ri";
import { useUpdateAuthorMutation } from "../features/author/authorSlice";
import { toast } from "react-toastify";

const Following = ({ authorInfo, refetch }) => {
    const user_id = localStorage.getItem("user_id");
    const [isFollowing, setIsFollowing] = useState(false);

    const [updateAuthor] = useUpdateAuthorMutation();

    useEffect(() => {
        setIsFollowing(authorInfo.followers.includes(Number(user_id)));
    }, [authorInfo, user_id]);

    const handleFollowing = () => {
        let updatedFollowers = [];

        if (isFollowing) {
            updatedFollowers = authorInfo.followers.filter(
                (follower) => follower !== Number(user_id)
            );
        } else {
            updatedFollowers = [...authorInfo.followers, Number(user_id)];
        }

        const data = {
            id: authorInfo.id,
            profile_picture_url: authorInfo.profile_picture_url,
            bio: authorInfo.bio,
            address: authorInfo.address,
            twitter: authorInfo.twitter,
            facebook: authorInfo.facebook,
            linkedin: authorInfo.linkedin,
            join_date: authorInfo.join_date,
            post_count: authorInfo.post_count,
            user: authorInfo.user.id,
            followers: updatedFollowers,
        };

        try {
            updateAuthor({ id: authorInfo.id, data });
            setIsFollowing(!isFollowing);
            refetch();
        } catch (error) {
            // console.error("Error updating followers:", error);
            toast.error("Error updating followers", {
                position: "top-right",
            });
            
        }
    };

    return (
        <RiUserFollowFill
            onClick={handleFollowing}
            className={`text-xl cursor-pointer ${
                isFollowing ? "text-blue-400" : "text-blue-100"
            }`}
        />
    );
};

export default Following;
