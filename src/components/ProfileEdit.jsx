import React, { useRef, useState } from 'react'
import { FiEdit } from "react-icons/fi";
import { useUpdateAuthorMutation } from '../features/author/authorSlice';
import { toast } from 'react-toastify';

const ProfileEdit = ({authorInfo, refetch}) => {
  const [profileModel, setProfileModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState(authorInfo.profile_picture_url);
  const [bio, setBio] = useState(authorInfo.bio);
  const [address, setAddress] = useState(authorInfo.address);
  const [twitter, setTwitter] = useState(authorInfo.twitter);
  const [facebook, setFacebook] = useState(authorInfo.facebook);
  const [linkedin, setLinkedin] = useState(authorInfo.linkedin);

  const fileInputRef = useRef(null);

  const [updateAuthor, {isLoading}] = useUpdateAuthorMutation();

  const handleProfileEdit = () => {
    setProfileModal(!profileModel);
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile(file);
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", profile);
    data.append("upload_preset", "Blog website react+django");
    data.append("cloud_name", "dedwheqpz");

    const res = await fetch("https://api.cloudinary.com/v1_1/dedwheqpz/image/upload", {
      method: "post",
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = profile;
    if(authorInfo.profile_picture_url != profile){
      imageUrl = await uploadImage();
    }

    const data = {
      id: authorInfo.id,
      profile_picture_url: imageUrl,
      bio: bio,
      address: address,
      twitter: twitter,
      facebook: facebook,
      linkedin: linkedin,
      join_date: authorInfo.join_date,
      post_count: authorInfo.post_count,
      user: authorInfo.user.id,
      followers: authorInfo.followers,
    };

    try {
      await updateAuthor({ id: authorInfo.id, data });
      refetch();
      setProfileModal(false);
      toast.success("Profile updated successfully!", {
        position: "top-right",
      });
      // console.log("update: ",data);
      
  } catch (error) {
      // console.error("Error updating followers:", error);
      toast.error("Failed to update profile", {
        position: "top-right",
      });
  }
    setLoading(false);

  }

  return (
    <>
       <FiEdit onClick={()=> handleProfileEdit()} className='text-xl text-blue-100 cursor-pointer' />


       {/* Edit Profile Modal */}
       {profileModel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-slate-800 border rounded-md w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 p-6">
                        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

                        {/* Input for mail */}
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="profile-pic">Profile picture</label>
                            <input
                                type="file"
                                id="profile-pic"
                                // value={profile}
                                ref={fileInputRef} 
                                onChange={handleImageChange}
                                className="w-full p-2 border rounded-md text-black bg-slate-50"
                                placeholder="Add your profile picture..."
                            />
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full h-12 p-2 border rounded-md text-black"
                                placeholder="Add your bio..."
                                rows="3"
                            />
                            <label htmlFor="address">Address</label>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full p-2 border rounded-md text-black"
                                placeholder="Add your address..."
                            />
                            <label htmlFor="twitter">Twitter</label>
                            <input
                                value={twitter}
                                onChange={(e) => setTwitter(e.target.value)}
                                className="w-full p-2 border rounded-md text-black"
                                placeholder="Add your twitter..."
                            />
                            <label htmlFor="facebook">Facebook</label>
                            <input
                                value={facebook}
                                onChange={(e) => setFacebook(e.target.value)}
                                className="w-full p-2 border rounded-md text-black"
                                placeholder="Add your facebook..."
                            />
                            <label htmlFor="linkedin">Linkedin</label>
                            <input
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="w-full p-2 border rounded-md text-black"
                                placeholder="Add your linkedin..."
                            />

                            
                            
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={()=>setProfileModal(!profileModel)}
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

export default ProfileEdit
