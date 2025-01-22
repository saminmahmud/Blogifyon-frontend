import React, { useEffect, useState } from 'react'
import { FaBookmark } from "react-icons/fa";
import { useCreateSavePostMutation, useDeleteSavePostMutation, useGetSavedPostsQuery } from '../features/post/postSlice';
import Loading from './Loading';

const SavePost = ({post_id}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const {data:savedPost, isLoading:getSaveLoading, refetch } = useGetSavedPostsQuery(localStorage.getItem("user_id"));
  const [deleteSavePost, {isLoading:deleteSaveLoading}]= useDeleteSavePostMutation();
  const [createSavePost, {isLoading:createSavePostLoading}] = useCreateSavePostMutation();

  useEffect(() => {
    if(savedPost){
      savedPost.map((post)=>{
        if(post.user == localStorage.getItem("user_id") && post.post == post_id){
          setIsSaved(true);
          setSavedId(post.id);
        }
      })
    }
  },[savedPost]);

  const handleSavePost = async () => {
    if(isSaved){
      await deleteSavePost(savedId); 
      refetch(); 
      setIsSaved(false);
    }else{
      const data = {
        user: localStorage.getItem("user_id"),
        post: post_id
      }
      await createSavePost(data);
      setIsSaved(true);
    }
  }
  
  if(getSaveLoading) return <Loading />

  return (
    <>
      <FaBookmark onClick={()=>handleSavePost()} className={`text-lg cursor-pointer ${ isSaved ? "text-blue-400" : "" } ${deleteSaveLoading || createSavePostLoading && "cursor-not-allowed" }`}  />
    </>
  )
}

export default SavePost
