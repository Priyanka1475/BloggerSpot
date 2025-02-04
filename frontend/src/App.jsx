
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import CreatePost from "./pages/createpost";
import PostDetails from "./pages/postdetails";
import EditPost from "./pages/editpost";
import Profile from "./pages/profile";
import MyBlogs from "./pages/myBlogs"
import { UserContextProvider } from "./context/userContext";

const App = () => {
  return (
    <div>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/write" element={<CreatePost />} />
          <Route path="/posts/post/:id" element={<PostDetails />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route exact path="/myblogs/:id" element={<MyBlogs/>}/>

        </Routes>
      </UserContextProvider>
    </div>
  );
};

export default App;
