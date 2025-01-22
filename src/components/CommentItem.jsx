import React from 'react'

const CommentItem = ({ comment, isTextFieldOpen, setIsTextFieldOpen }) => {
    return (
        <div key={comment.id} className="pb-2">
            <h1 className="font-bold text-gray-200">{comment.author_username}</h1>
            <p className="text-gray-300">{comment.content}</p>
            <p 
            onClick={()=>{
                if(!comment.comment && !comment.reply_comment){
                    console.log("comment- ",comment);
                    // comment
                    setIsTextFieldOpen({ id: comment.id, commentReply: true, agaiReply: false});
                }
                else{
                    console.log("reply of reply- ",comment);
                    // reply of first reply
                    setIsTextFieldOpen({ id: comment.id, commentReply: false, agaiReply: true});
                }
            }} 
            className="hover:underline text-end cursor-pointer text-gray-400 pb-1 pr-2">Reply</p>

            {/* If the comment has replies, render them recursively */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="pl-1 ml-2 border-l">
                    {comment.replies.map((reply, index) => (
                        <CommentItem key={`${reply.id}+${index}`} comment={reply} 
                            isTextFieldOpen={isTextFieldOpen}
                            setIsTextFieldOpen={setIsTextFieldOpen}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem
