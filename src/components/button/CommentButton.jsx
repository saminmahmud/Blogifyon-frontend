import React, { useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { useAddCommentMutation, useAddReplyMutation, useGetCommentsQuery } from "../../features/comment/commentSlice";
import CommentItem from "../CommentItem";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";


const CommentButton = ({ post_id }) => {
    const { data: comment_reply, isLoading: c_rLoading, refetch } = useGetCommentsQuery(post_id);
    const [addComment, {isLoading:addCommentLoading}] = useAddCommentMutation();
    const [addReply, {isLoading:addReplyLoading}] = useAddReplyMutation();

    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [isTextFieldOpen, setIsTextFieldOpen] = useState({
        id: null,
        commentReply: false,
        agaiReply: false,
    });


    // Handle opening and closing the modal
    const toggleModal = () => {
        refetch();
        setIsCommentModalOpen(!isCommentModalOpen);
    }

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if(isTextFieldOpen.id == null){
            try{
                await addComment({
                    post: post_id,
                    content: comment,
                    author: localStorage.getItem('user_id')
                })
            }catch(err){
                // console.log(err);
                // toast.error("Error adding comment. Try again.", {
                //     position: "top-right",
                // });
            }
        }
        else if(isTextFieldOpen.commentReply){
            try{
                await addReply({
                    comment: isTextFieldOpen.id,
                    reply_comment: null,
                    post: post_id,
                    author: localStorage.getItem('user_id'),
                    content: comment,
                })
            }catch(err){
                // console.log(err);
            }
        }
        else if(isTextFieldOpen.agaiReply){
            try{
                await addReply({
                    comment: null,
                    reply_comment: isTextFieldOpen.id,
                    post: post_id,
                    author: localStorage.getItem('user_id'),
                    content: comment,
                })
            }catch(err){
                // console.log(err);
            }
        }
        refetch();
        setComment('');
        setIsTextFieldOpen({ id: null, reply: false, againReply: false, commentId: null });
    };


    return (
        <>
            <button
                onClick={toggleModal}
                className="px-4 py-2 flex items-center justify-center border-2 rounded-md bg-slate-50"
            >
                <FaRegComment className="text-xl font-bold text-blue-500 " />
            </button>

            {/* Comment Modal */}
            {isCommentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-slate-800 border rounded-md w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 p-6">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>

                        {/* Existing comments */}
                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                            {comment_reply?.map((data, index) => (
                                <>
                                    <CommentItem 
                                    // key={data.id}
                                    key={`${data.id}-${index}`}
                                    comment={data} 
                                    isTextFieldOpen={isTextFieldOpen}
                                    setIsTextFieldOpen={setIsTextFieldOpen}
                                    />
                                </>
                            ))}
                            
                        </div>

                        {/* Input for new comment */}
                        <form onSubmit={handleCommentSubmit}>
                        {
                            (isTextFieldOpen.commentReply || isTextFieldOpen.agaiReply) && (
                                <div className="inline-block  rounded-lg px-1 mb-1 border border-gray-500"
                                    >
                                    <div className="flex items-center space-x-1">
                                        <RxCross2 className="cursor-pointer" onClick={() => setIsTextFieldOpen({ id: null, commentReply: false, agaiReply: false})} />
                                        <span className="font-bold text-sm text-gray-200"> Replying...</span>
                                    </div>
                                </div>
                            )
                        }
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full h-12 p-2 border rounded-md text-black"
                                placeholder="Add your comment..."
                                rows="3"
                            />
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={toggleModal}
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-md ${comment === '' ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"}`}
                                    disabled={comment === '' || addCommentLoading || addReplyLoading}  
                                >
                                    {addCommentLoading || addReplyLoading ? "Submitting..." : "Submit"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CommentButton;



// import React, { useState } from "react";
// import { FaRegComment } from "react-icons/fa";
// import { useGetCommentsQuery } from "../../features/comment/commentSlice";

// const CommentButton = ({post_id}) => {
//     const {data:comment_reply, isLoading:c_rLoading} = useGetCommentsQuery(post_id);
    
    
//         const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
//         // State for managing the comment input
//         const [comment, setComment] = useState('');
    
    
//         // Handle opening and closing the modal
//         const toggleModal = () => setIsCommentModalOpen(!isCommentModalOpen);
    
//         // Handle comment submission
//         const handleCommentSubmit = (e) => {
//             e.preventDefault();
//             if (comment.trim()) {
//                 setComment(''); // Clear the input after submitting
//             }
//         };

//         console.log(post_id, comment_reply);

//     return (
//         <>
//             <button
//                 onClick={toggleModal}
//                 className="px-4 py-2 flex items-center justify-center border-2 rounded-md bg-slate-50"
//             >
//                 <FaRegComment className="text-xl font-bold text-blue-500 " />
//             </button>


//             {/* Comment Modal */}
//             {isCommentModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
//                     <div className="bg-slate-800 border rounded-md w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 p-6">
//                         <h2 className="text-2xl font-bold mb-4">Comments</h2>

//                         {/* Existing comments */}
//                         <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
//                             {comment_reply.map((data) => (
//                                 <div key={data.id} className="border-b pb-2">
//                                     <h1 className="font-bold text-gray-200">{data.author_username}</h1>
//                                     <p className="text-gray-300">{data.content}</p>
//                                     <p className="hover:underline text-end cursor-pointer text-gray-400">Reply</p>
//                                     {
//                                         data.replies.map((reply) => (
//                                             <div key={reply.id} className="border-l pl-2 ml-2">
//                                                 <h1 className="font-bold text-gray-200">{reply.author_username}</h1>
//                                                 <p className="text-gray-300">{reply.content}</p>
//                                             </div>
//                                         ))
//                                     }
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Input for new comment */}
//                         <form onSubmit={handleCommentSubmit}>
//                             <textarea
//                                 value={comment}
//                                 onChange={(e) => setComment(e.target.value)}
//                                 className="w-full h-12 p-2 border rounded-md text-black"
//                                 placeholder="Add your comment..."
//                                 rows="3"
//                             />
//                             <div className="mt-4 flex justify-end space-x-2">
//                                 <button
//                                     onClick={toggleModal}
//                                     type="button"
//                                     className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
//                                 >
//                                     Close
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-md"
//                                 >
//                                     Submit
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </>


//     );
// };

// export default CommentButton;
