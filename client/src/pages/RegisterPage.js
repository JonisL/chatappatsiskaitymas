import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: ""
    });
    const [uploadPhoto, setUploadPhoto] = useState("");
    const navigate = useNavigate();

    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0];

        const uploadPhoto = await uploadFile(file);

        setUploadPhoto(file);

        setData((prev) => ({
            ...prev,
            profile_pic: uploadPhoto?.url,
        }));
    };

    const handleClearUploadPhoto = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setUploadPhoto(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

        try {
            const response = await axios.post(URL, data);
            console.log("response", response);

            toast.success(response.data.message);

            if (response.data.success) {
                setData({
                    name: "",
                    email: "",
                    password: "",
                    profile_pic: ""
                });

                navigate('/email');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
        console.log('data', data);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 mx-4">
                <h3 className="text-2xl font-bold text-center text-gray-800">Welcome to Chat App!</h3>

                <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your name"
                            className="bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={data.name}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={data.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="profile_pic" className="text-sm font-semibold text-gray-700">
                            Profile Photo:
                            <div className="flex items-center justify-between bg-gray-100 px-4 py-2 mt-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                <p className="text-sm text-gray-600 truncate">
                                    {uploadPhoto?.name ? uploadPhoto.name : "Upload profile photo"}
                                </p>
                                {uploadPhoto?.name && (
                                    <button className="text-xl text-red-500 hover:text-red-700" onClick={handleClearUploadPhoto}>
                                        <IoClose />
                                    </button>
                                )}
                            </div>
                        </label>
                        <input
                            type="file"
                            id="profile_pic"
                            name="profile_pic"
                            className="hidden"
                            onChange={handleUploadPhoto}
                        />
                    </div>

                    <button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                        Register
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/email" className="text-indigo-600 font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
