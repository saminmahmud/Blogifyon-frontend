import React, { useState } from 'react'
import { RiMailSendLine } from "react-icons/ri";
import { toast } from 'react-toastify';

const SendMail = ({author}) => {
    const [mailModal, setMailModal] = useState(false);
    const [message, setmessage] = useState("");
    const [loading, setLoading] = useState(false);

    const sender = localStorage.getItem("user_id");

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        if (message.trim() === "") {
            toast.warning("Message content cannot be empty!", {
                position: "top-right",
            })
            return;
        }

        try{
            
            const response = fetch(`https://blogifyon-backend.onrender.com/author/send_email/`, {
                method: "POST",
                headers: {
                    Authorization: `Token ${localStorage.getItem("token")}`, 
                },
                body: JSON.stringify({
                    author_id: author,
                    sender_id: sender,
                    content: message,
                }),
            });
            if (response.ok) {
                toast.success("Email sent successfully!", {
                    position: "top-right",
                });
                
                setMailModal(!mailModal);
            } else {
                toast.error("Failed to send email!", {
                    position: "top-right",
                });
            }
        }catch (error) {
            // console.error("Error sending email:", error);
            toast.error("Failed to send email!", {
                position: "top-right",
            });
        }
        setLoading(false);
        setmessage("");
        setMailModal(!mailModal);
    }
  
    return (
    <>
      <RiMailSendLine onClick={()=>setMailModal(!mailModal)} className='text-xl text-blue-100 cursor-pointer' />

       {/* Mail Modal */}
       {mailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-slate-800 border rounded-md w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 p-6">
                        <h2 className="text-2xl font-bold mb-4">Send Mail</h2>

                        {/* Input for mail */}
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={message}
                                onChange={(e) => setmessage(e.target.value)}
                                className="w-full h-12 p-2 border rounded-md text-black"
                                placeholder="Add your message..."
                                rows="3"
                            />
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={()=>setMailModal(!mailModal)}
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-blue-500 text-white rounded-md ${ loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                    {
                                        loading ? "Sending..." : "Submit"
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    </>
  )
}

export default SendMail
