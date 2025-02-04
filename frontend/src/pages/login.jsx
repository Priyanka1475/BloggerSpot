import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import {URL} from "../url"
import axios from "axios";
import {UserContext} from "../context/userContext";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Email and Password are required.');
            return;
        }

        try {
            const res = await axios.post(`${URL}/api/auth/login`, { email, password }, {withCredentials:true});
            setUser(res.data);
            navigate("/"); // Update this if "home" is dynamic or not implemented
            setError('');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
            console.error(err);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
                <h1 className="text-lg font-extrabold md:text-xl">Login</h1>
                <div className="flex items-center space-x-2 md:space-x-4">
                    <h3><Link to="/register">Register</Link></h3>
                </div>
            </div>
            <div className="w-full flex justify-center items-center h-[80vh]">
                <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
                    <h1>Login to your account</h1>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="w-full px-4 py-2 border-2 border-black outline-0"
                        type="text"
                        placeholder="Enter your Email"
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className="w-full px-4 py-2 border-2 border-black outline-0"
                        type="password"
                        placeholder="Enter your Password"
                    />
                    <button
                        onClick={handleLogin}
                        className="w-full px-4 py-4 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-500 hover:text-black"
                    >
                        Login
                    </button>
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <div className="flex justify-center items-center space-x-3">
                        <p>New here?</p>
                        <p className="text-gray-500 hover:text-black">
                            <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
