
import PropTypes from "prop-types";
import { IF } from "../url";

const HomePosts = ({ post }) => {
  // Check if photo exists and handle fallback
  const imageUrl = post.photo ? (post.photo.startsWith("http") ? post.photo : IF + post.photo) : null;

  return (
    <div className="w-full flex mt-8 space-x-4">
      {/* Left - Image */}
      <div className="w-[35%] h-[200px] flex justify-center items-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-200">
            <p>No Image Available</p>
          </div>
        )}
      </div>

      {/* Right - Text Content */}
      <div className="flex flex-col w-[65%]">
        <h1 className="text-xl font-bold md:mb-2 mb-1 md:text-2xl">{post.title}</h1>

        <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
          <p>@{post.username}</p>
          <div className="flex space-x-2 text-sm">
            <p>{new Date(post.updatedAt).toLocaleDateString()}</p>
            <p>{new Date(post.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <p className="text-sm md:text-lg">
          {post.desc.slice(0, 200) + " ...Read more"}
        </p>
      </div>
    </div>
  );
};

HomePosts.propTypes = {
  post: PropTypes.shape({
    username: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    photo: PropTypes.string, // Change to optional prop
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default HomePosts;
