import React from 'react'
import { useGetPostsListQuery } from '../../features/post/postSlice'
import PostCard from './PostCard';
import Loading from '../Loading';
import ErrorPage from '../ErrorPage';

const PostList = () => {
   const { data, isLoading, isError, error, isSuccess } = useGetPostsListQuery();

  return (
    <div>
        {isLoading && <Loading />}

        {isError && <ErrorPage />}

        {isSuccess && (
          <div className="space-y-5">
            {data?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
    </div>
  )
}

export default PostList
