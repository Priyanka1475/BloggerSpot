import { useParams, useNavigate } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { URL, IF } from "../url";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../context/userContext";
import Loader from "../components/Loader";
import Comment from "../components/Comment";

const PostDetails = () => {
  const { id: postId } = useParams();
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [loader, setLoader] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  
  const fetchPost = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/posts/${postId}`);
      setPost(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  // Fetch the post comments
  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/comment/post/${postId}`, {
        withCredentials: true, // Ensure credentials are sent with the request
      });
      setComments(res.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("Session expired. Please log in again.");
        navigate("/login"); // Redirect to login page on session expiration
      } else {
        console.log(err);
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchPostComments();
  }, [postId]);

  // Delete post handler
  const handleDeletePost = async () => {
    try {
      await axios.delete(`${URL}/api/posts/${postId}`, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  // Post comment handler
  const postComment = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      await axios.post(
        `${URL}/api/comment/create`,
        {
          comment: comment,
          author: user.username,
          postId: postId,
          userId: user._id,
        },
        { withCredentials: true }
      );
      setComment("");
      fetchPostComments(); // Refresh comments after posting
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("Session expired. Please log in again.");
        navigate("/login"); // Redirect to login page if token expired
      } else {
        console.log(err);
      }
    }
  };

  // Update comments after deletion
  const updateComments = (id) => {
    setComments((prevComments) => prevComments.filter((comment) => comment._id !== id));
  };

    
    

  return (
    <div>
      <Navbar />
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="px-8 md:px-[200px] mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black md:text-3xl">{post.title}</h1>
            {user?._id === post?.userId && (
              <div className="flex items-center justify-center space-x-2">
                <p className="cursor-pointer" onClick={() => navigate(`/edit/${postId}`)}>
                  <BiEdit />
                </p>
                <p className="cursor-pointer" onClick={handleDeletePost}>
                  <MdDelete />
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 md:mt-4">
            <p>@{post.username}</p>
            <div className="flex space-x-2">
              <p>{new Date(post.updatedAt).toLocaleDateString()}</p>
              <p>{new Date(post.updatedAt).toLocaleTimeString()}</p>
            </div>
          </div>
          <img src={IF + post.photo} className="w-full mx-auto mt-8" alt="Post" />
          <p className="mx-auto mt-8">{post.desc}</p>
          <div className="flex items-center mt-8 space-x-4 font-semibold">
            <p>Categories:</p>
            <div className="flex justify-center items-center space-x-2">
              {post.categories?.map((c, i) => (
                <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">{c}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
            {comments?.map((c) => (
              <Comment key={c._id} c={c} post={post} updateComments={updateComments} />
            ))}
          </div>
          <div className="w-full flex flex-col mt-4 md:flex-row">
            <input
              onChange={(e) => setComment(e.target.value)}
              type="text"
              placeholder="Write a comment"
              value={comment}
              className="md:w-[80%] outline-none py-2 px-4 mt-4 md:mt-0"
            />
            <button
              onClick={postComment}
              className="bg-black text-sm text-white px-2 py-2 md:w-[20%] mt-4 md:mt-0"
            >
              Add Comment
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PostDetails;
