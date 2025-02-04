import axios from "axios";
import { MdDelete } from "react-icons/md";
import { URL } from "../url";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import PropTypes from "prop-types";

const Comment = ({ c, updateComments = () => {} }) => {
  const { user } = useContext(UserContext);

  const deleteComment = async (id) => {
    if (!id) return console.log("Invalid comment ID.");

    try {
      await axios.delete(`${URL}/api/comment/${id}`, { withCredentials: true });
      updateComments(id);
    } catch (err) {
      console.log("Error deleting comment:", err);
    }
  };

  return (
    <div className="px-4 py-3 bg-gray-100 rounded-lg my-2 shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">@{c?.author || "Unknown Author"}</h3>
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          {user?._id === c?.userId && (
            <button className="text-red-500 hover:text-red-700" onClick={() => deleteComment(c._id)}>
              <MdDelete size={18} />
            </button>
          )}
        </div>
      </div>
      <p className="px-4 mt-2 text-gray-800">{c?.comment || "No comment provided."}</p>
    </div>
  );
};

// PropTypes validation
Comment.propTypes = {
  c: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.string,
    comment: PropTypes.string,
    updatedAt: PropTypes.string,
    userId: PropTypes.string,
  }).isRequired,
  updateComments: PropTypes.func,
};

export default Comment;
