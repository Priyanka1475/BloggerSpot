import Footer from "../components/footer";
import HomePosts from "../components/homeposts";
import Navbar from "../components/navbar";
import axios from "axios";
import { URL } from "../url";
import {useContext, useEffect, useState } from "react";
import { Link , useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { UserContext } from "../context/userContext"
const Home = () => {
  const { search } = useLocation();
  console.log({ search });

  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(true);
  const {user}= useContext(UserContext)

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${URL}/api/posts${search}`);
      setPosts(res.data);

      if (res.data.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false); // Ensure loader is turned off even on error
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  return (
    
    <>
    <Navbar/>
<div className="px-8 md:px-[200px] min-h-[80vh]">
        {loader?<div className="h-[40vh] flex justify-center items-center"><Loader/></div>:!noResults?
        posts.map((post)=>(
          <>
          <Link to={user?`/posts/post/${post._id}`:"/login"}>
          <HomePosts key={post._id} post={post}/>
          </Link>
          </>
          
        )):<h3 className="text-center font-bold mt-16">No posts available</h3>}
    </div>
    <Footer/>
    </>
    
  )
}

export default Home