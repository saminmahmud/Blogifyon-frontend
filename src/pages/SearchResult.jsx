import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import SearchResultNotFound from "../components/SearchResultNotFound";
import { useAuthorPostQuery } from "../features/post/postSlice";
import PostCard from "../components/post/PostCard";
import { useSearchAuthorQuery } from "../features/author/authorSlice";
import Loading from "../components/Loading";
import ErrorPage from "../components/ErrorPage";
// import { toast } from 'react-toastify';

const SearchResult = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("q");

    const [categoryPost, setCategoryPost] = useState([]);

    const {
        data: authorInfo,
        isLoading: authorInfoLoading,
        error: authorInfoError,
    } = useSearchAuthorQuery(query);

    // console.log("authorInfo: ",authorInfo);

    const ordered = "-created_at";
    const {
        data: authorPosts,
        isLoading: postsLoading,
        error: postsError,
        refetch,
    } = useAuthorPostQuery({ username: query, ordered: ordered });

    useEffect(() => {
        if (query) {
            refetch();
        }
    }, [query, refetch]);

    const fetchCategory = async () => {
        const response = await fetch(
            `https://blogifyon-backend.onrender.com/post/category_post/?ordering=${ordered}&search=${query}`,
            {
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`,
                },
            }
        );
        const data = await response.json();
        setCategoryPost(data);
    };

    useEffect(() => {
        fetchCategory();
    }, [authorPosts, authorInfo, query]);

    if (authorInfoLoading || postsLoading) return <Loading />;

    if (authorInfoError || postsError) return <ErrorPage />;

    // console.log("search: ", authorPosts);

    const combinedPosts = [
        ...authorPosts,
        ...categoryPost.filter(
            (post) =>
                !authorPosts.some((existingPost) => existingPost.id === post.id)
        ),
    ];

    // console.log("combinedPosts: ", combinedPosts);

    const showNoResults =
        (!authorInfo || authorInfo.length === 0) &&
        (!combinedPosts || combinedPosts.length === 0);

    if (showNoResults) {
        return <SearchResultNotFound />;
    }

    return (
        <div className="max-w-full md:max-w-[80%] mx-auto mt-2">
            <div className="space-y-3">
                <div className="text-center font-bold">
                    <h1 className="text-3xl ">Search Result</h1>
                </div>

                {/* profile */}
                {authorInfo && authorInfo.length > 0 ? (
                    <div className="shadow-md p-4 rounded-md flex flex-col space-y-3 ">
                        {authorInfo.map((author) => (
                            <div key={author.id} className="inline-block">
                                <Link
                                    to={`/user/${author.id}`}
                                    className="flex items-center space-x-4"
                                >
                                    <img
                                        // src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                        src={author.profile_picture_url}
                                        alt="Profile"
                                        className="w-14 h-14 rounded-full"
                                    />

                                    <h1 className="text-lg font-semibold hover:underline">
                                        {author.user.username}
                                    </h1>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : null}

                {/* posts */}
                {combinedPosts && combinedPosts.length > 0 ? (
                    <div className="shadow-md p-2 md:p-4 rounded-md">
                        <div className="border-b-2">
                            <h1 className="text-xl font-semibold">
                                Related Posts:
                            </h1>
                        </div>
                        <div className="space-y-5">
                            {combinedPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                ) : null}

                {/* {
                authorPosts && authorPosts.length > 0 ? (
                    <div className='shadow-md p-2 md:p-4 rounded-md'>
                        <div className='py-5'>
                            <h1 className='text-lg font-semibold'>Related Posts:</h1>
                        </div>
                        <div className="space-y-5">
                            {authorPosts.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>
                    </div>
                ) : null
            } */}
            </div>
        </div>
    );
};

export default SearchResult;
