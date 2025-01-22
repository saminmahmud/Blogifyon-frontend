import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useGetAuthorDetailsQuery } from "../features/author/authorSlice";
import Loading from "../components/Loading";

const AddPost = () => {
  const [post, setPost] = useState({
    post_image_url: "",
    title: "",
    content: "",
    author: "",
    categories: [],
  });

  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const { data: authorData, refetch } = useGetAuthorDetailsQuery(localStorage.getItem("user_id"));

  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      try {
        const response = await fetch("https://blogifyon-backend.onrender.com/category/", {
          method: 'GET',  
          headers: {
                  Authorization: `Token ${localStorage.getItem("token")}`, 
          },
        });
        const data = await response.json();
        setCategories(data); 
      } catch (err) {
        // console.error("Failed to fetch categories", err);
        toast.error("Failed to fetch categories",{
          position: "top-right",
        });
      }
      setCatLoading(false);
    };

    fetchCategories();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, (option) => option.value);
    setPost((prevPost) => ({
      ...prevPost,
      categories: selectedCategories,
    }));
  };


const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPost((prevPost) => ({
      ...prevPost,
      post_image_url: file, 
    }));
  };


  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", post.post_image_url);
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

    setPost((prevPost) => ({
        ...prevPost,
        author: localStorage.getItem("user_id"),
      }));

    setIsLoading(true);
    setError(null);

    // Construct the data payload
    const imageUrl = await uploadImage();
    // console.log("IMGURL: ",imageUrl)
    const postData = {
      post_image_url: imageUrl,
      title: post.title,
      content: post.content,
      author: post.author,
      categories: post.categories,
    };

    try {
      const response = await fetch("https://blogifyon-backend.onrender.com/post/create_post/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("token")}`, 
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        // throw new Error("Failed to create post.");
        toast.error("Failed to create post.",{
          position: "top-right",
        });
      }

      const data = await response.json();
      setIsLoading(false);
      toast.success("Post created successfully!",{
        position: "top-right",
      });

      refetch();

      setPost({
        post_image_url: "",
        title: "",
        content: "",
        author: "",
        categories: [],
      });

      fileInputRef.current.value = "";
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  // console.log(post)
  
  if(catLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg mt-6 ">
      <h2 className="text-2xl font-semibold text-center mb-6">Add Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="post_image_url"
            className="block text-sm font-medium text-gray-300"
          >
            Image
          </label>
          <input name="post_image_url" id="post_image_url" ref={fileInputRef} className="w-full p-3 border bg-slate-100 text-black border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" type="file" onChange={handleImageChange} required  />
        </div>

        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-slate-100 text-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter post title"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-300"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleInputChange}
            required
            className="w-full p-3 bg-slate-100 text-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter post content"
            rows="6"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="categories"
            className="block text-sm font-medium text-gray-300"
          >
            Categories
          </label>
          <select
            id="categories"
            name="categories"
            multiple
            value={post.categories}
            onChange={handleCategoryChange}
            className="w-full p-3 bg- bg-slate-100 text-black border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Show loading state */}
        {isLoading && (
          <div className="text-center text-gray-500">
            <p>Loading...</p>
          </div>
        )}

        {/* Show error message */}
        {error && (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
