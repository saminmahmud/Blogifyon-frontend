import React from 'react'
import { useGetSavedPostsQuery } from '../features/post/postSlice';
import Loading from '../components/Loading';
import PostCard from '../components/post/PostCard';

const PostSaved = () => {
    const {data:savedPost, isLoading:getSaveLoading, refetch } = useGetSavedPostsQuery(localStorage.getItem("user_id"));

    if(getSaveLoading) return <Loading />

  return (
    <div>
        <h1 className='text-2xl font-bold text-center'>Saved Posts</h1>
      {
        savedPost && savedPost.length > 0 ? (
            <div className="space-y-5">
                {savedPost.map((post) => (
                <PostCard key={post.id} post={post.post_details} />
                ))}
            </div>
        ) : (
            <p className='text-lg font-semibold pt-4'>No saved post :(</p>
        )
      }
    </div>
  )
}

export default PostSaved
