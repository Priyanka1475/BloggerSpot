import { useContext, useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { ImCross } from 'react-icons/im';
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";

const EditPost = () => {
  const postId = useParams().id;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null); // Holds File object
  const [photoUrl, setPhotoUrl] = useState(""); // Holds URL
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);

  // Fetch the post data
  const fetchPost = async () => {
    try {
      const res = await axios.get(`${URL}/api/posts/${postId}`);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setPhotoUrl(res.data.photo); // Store existing image URL
      setCats(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch post data on load
  useEffect(() => {
    fetchPost();
  }, [postId]);

  // Update post
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title || !desc) {
      alert("Title and Description are required.");
      return;
    }

    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats,
      photo: photoUrl, // Use existing photo unless replaced
    };

    // Handle file upload only if a new file is selected
    if (file instanceof File) {
      const data = new FormData();
      data.append("file", file);
      try {
        const imgUpload = await axios.post(URL + "/api/uploads", data);
        if (imgUpload.data.imageUrl) {
          post.photo = imgUpload.data.imageUrl;
        }
      } catch (err) {
        console.log("Error uploading image:", err);
      }
    }

    // Update the post
    try {
      const res = await axios.put(`${URL}/api/posts/${postId}`, post, { withCredentials: true });
      navigate(`/posts/post/${res.data._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  // Delete category
  const deleteCategory = (i) => {
    setCats(cats.filter((_, index) => index !== i));
  };

  // Add category
  const addCategory = () => {
    if (cat && !cats.includes(cat)) {
      setCats([...cats, cat]);
      setCat("");
    }
  };

  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-[200px] mt-8'>
        <h1 className='font-bold md:text-2xl text-xl '>Update a post</h1>
        <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>

          {/* Title Input */}
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder='Enter post title'
            className='px-4 py-2 outline-none'
          />

          {/* File Input */}
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            className='px-4'
          />

          {/* Show current image if exists */}
          {photoUrl && !file && (
            <div className="mt-2">
              <p className="text-gray-600">Current Image:</p>
              <img src={photoUrl} alt="Current Post" className="w-32 h-32 object-cover mt-1" />
            </div>
          )}

          {/* Categories Input */}
          <div className='flex flex-col'>
            <div className='flex items-center space-x-4 md:space-x-8'>
              <input
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className='px-4 py-2 outline-none'
                placeholder='Enter post category'
                type="text"
              />
              <div
                onClick={addCategory}
                className='bg-black text-white px-4 py-2 font-semibold cursor-pointer'
              >
                Add
              </div>
            </div>

            {/* Display categories */}
            <div className='flex px-4 mt-3'>
              {cats.map((c, i) => (
                <div
                  key={i}
                  className='flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md'
                >
                  <p>{c}</p>
                  <p
                    onClick={() => deleteCategory(i)}
                    className='text-white bg-black rounded-full cursor-pointer p-1 text-sm'
                  >
                    <ImCross />
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            rows={15}
            cols={30}
            className='px-4 py-2 outline-none'
            placeholder='Enter post description'
          />

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg'
          >
            Update
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditPost;
