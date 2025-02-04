import { useContext, useEffect, useState } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ProfilePosts from "../components/profileposts";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const param = useParams().id; // Fetch param from the URL
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(""); // Error state to display user-friendly messages

  // Fetch the profile of the current user or user specified by param
  const fetchProfile = async () => {
    if (!user?._id && !param) {
      setError("User not found");
      return;
    }

    try {
      const res = await axios.get(`${URL}/api/user/${param || user._id}`);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password); // Password should ideally not be shown here
    } catch (err) {
      setError("Error fetching user profile");
      console.log(err);
    }
  };

  // Handle updating user profile
  const handleUserUpdate = async () => {
    if (!username || !email) {
      setError("Username and email are required");
      return;
    }
    setUpdated(false);
    try {
      await axios.put(
        `${URL}/api/user/${user._id}`,
        { username, email, password },
        { withCredentials: true }
      );
      setUpdated(true);
    } catch (err) {
      setError("Error updating user profile");
      setUpdated(false);
      console.log(err);
    }
  };

  // Handle deleting the user account
  const handleUserDelete = async () => {
    try {
      await axios.delete(`${URL}/api/user/${user._id}`, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
    } catch (err) {
      setError("Error deleting user account");
      console.log(err);
    }
  };

  // Fetch the posts of the user
  const fetchUserPosts = async () => {
    if (!user?._id && !param) {
      setError("User not found");
      return;
    }

    try {
      const res = await axios.get(`${URL}/api/posts/user/${user._id}`);
      setPosts(res.data);
    } catch (err) {
      setError("Error fetching user posts");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile(); // Fetch profile based on param or current user
  }, [param, user]);

  useEffect(() => {
    if (user?._id || param) {
      fetchUserPosts(); // Fetch user posts
    }
  }, [param, user]);

  return (
    <div>
      <Navbar />
      <div className="min-h-[80vh] px-8 md:px-[200px] mt-8 flex md:flex-row flex-col-reverse md:items-start items-start">
        <div className="flex flex-col md:w-[70%] w-full mt-8 md:mt-0">
          <h1 className="text-xl font-bold mb-4">Your posts:</h1>
          {posts?.map((p) => (
            <ProfilePosts key={p._id} p={p} />
          ))}
        </div>
        <div className="md:sticky md:top-12 flex justify-start md:justify-end items-start md:w-[30%] w-full md:items-end">
          <div className="flex flex-col space-y-4 items-start">
            <h1 className="text-xl font-bold mb-4">Profile</h1>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="outline-none px-4 py-2 text-gray-500"
              placeholder="Your username"
              type="text"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="outline-none px-4 py-2 text-gray-500"
              placeholder="Your email"
              type="email"
            />
            {/* If you want to allow password updates, uncomment the following */} 
            {/* <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="outline-none px-4 py-2 text-gray-500"
              placeholder="Your password"
              type="password"
            /> */}
            <div className="flex items-center space-x-4 mt-8">
              <button
                onClick={handleUserUpdate}
                className="text-white font-semibold bg-black px-4 py-2 hover:text-black hover:bg-gray-400"
              >
                Update
              </button>
              <button
                onClick={handleUserDelete}
                className="text-white font-semibold bg-black px-4 py-2 hover:text-black hover:bg-gray-400"
              >
                Delete
              </button>
            </div>
            {updated && (
              <h3 className="text-green-500 text-sm text-center mt-4">
                User updated successfully!
              </h3>
            )}
            {error && (
              <h3 className="text-red-500 text-sm text-center mt-4">
                {error}
              </h3>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
