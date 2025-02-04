import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { ImCross } from 'react-icons/im';
import { useContext, useState } from 'react';
import { UserContext } from '../context/userContext';
import { URL } from '../url';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const { user } = useContext(UserContext);
    const [cat, setCat] = useState('');
    const [cats, setCats] = useState([]);

    const navigate = useNavigate();

    // Handle category addition
    const addCategory = () => {
        if (cat.trim()) {
            setCats([...cats, cat]);
            setCat('');
        }
    };

    // Handle category deletion
    const deleteCategory = (i) => {
        const updatedCats = [...cats];
        updatedCats.splice(i, 1); // Fix: Remove only the selected category
        setCats(updatedCats);
    };

    // Handle file selection and preview
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const objectURL = URL.createObjectURL(selectedFile);
            setPreview(objectURL);
        }
    };

    // Handle post creation
    const handleCreate = async (e) => {
        e.preventDefault();

        if (!title.trim() || !desc.trim()) {
            alert('Title and Description are required!');
            return;
        }

        const post = {
            title,
            desc,
            username: user.username,
            userId: user._id,
            categories: cats
        };

        if (file) {
            const data = new FormData();
            data.append('file', file);

            try {
                const imgUpload = await axios.post(URL + '/api/uploads', data);
                if (imgUpload.data.imageUrl) {
                    post.photo = imgUpload.data.imageUrl;
                } else {
                    console.error('Image upload failed: No image URL returned');
                    return;
                }
            } catch (err) {
                console.error('Error uploading image:', err);
                return;
            }
        }

        try {
            const res = await axios.post(URL + '/api/posts/create', post, { withCredentials: true });
            navigate('/posts/post/' + res.data._id);
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="px-6 md:px-[200px] mt-8">
                <h1 className="font-bold md:text-2xl text-xl">Create a post</h1>
                <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Enter post title"
                        className="px-4 py-2 outline-none border rounded-md"
                    />

                    <input onChange={handleFileChange} type="file" className="px-4" />
                    {preview && (
                        <img src={preview} alt="Preview" className="mt-4 w-48 h-48 object-cover rounded-md" />
                    )}

                    <div className="flex flex-col">
                        <div className="flex items-center space-x-4 md:space-x-8">
                            <input
                                value={cat}
                                onChange={(e) => setCat(e.target.value)}
                                className="px-4 py-2 outline-none border rounded-md"
                                placeholder="Enter post category"
                                type="text"
                            />
                            <div
                                onClick={addCategory}
                                className="bg-black text-white px-4 py-2 font-semibold cursor-pointer rounded-md"
                            >
                                Add
                            </div>
                        </div>

                        {/* Categories Display */}
                        <div className="flex px-4 mt-3">
                            {cats?.map((c, i) => (
                                <div
                                    key={i}
                                    className="flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md"
                                >
                                    <p>{c}</p>
                                    <p
                                        onClick={() => deleteCategory(i)}
                                        className="text-white bg-black rounded-full cursor-pointer p-1 text-sm"
                                    >
                                        <ImCross />
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <textarea
                        onChange={(e) => setDesc(e.target.value)}
                        rows={15}
                        cols={30}
                        className="px-4 py-2 outline-none border rounded-md"
                        placeholder="Enter post description"
                    />

                    <button
                        onClick={handleCreate}
                        className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg rounded-md"
                    >
                        Create
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default CreatePost;
