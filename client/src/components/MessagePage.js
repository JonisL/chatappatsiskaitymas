import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose, IoSend } from "react-icons/io5";
import Loading from './Loading';
import moment from 'moment';

const MessagePage = () => {
    const params = useParams();
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const user = useSelector(state => state?.user);
    const [dataUser, setDataUser] = useState({
        name: "",
        email: "",
        profile_pic: "",
        online: false,
        _id: ""
    });
    const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
    const [message, setMessage] = useState({
        text: "",
        imageUrl: "",
        videoUrl: ""
    });
    const [loading, setLoading] = useState(false);
    const [allMessage, setAllMessage] = useState([]);
    const currentMessage = useRef(null);

    useEffect(() => {
        if (currentMessage.current) {
            currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [allMessage]);

    const handleUploadImageVideoOpen = () => {
        setOpenImageVideoUpload(prev => !prev);
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];

        setLoading(true);
        const uploadPhoto = await uploadFile(file);
        setLoading(false);
        setOpenImageVideoUpload(false);

        setMessage(prev => ({
            ...prev,
            imageUrl: uploadPhoto.url
        }));
    };

    const handleClearUploadImage = () => {
        setMessage(prev => ({
            ...prev,
            imageUrl: ""
        }));
    };

    const handleUploadVideo = async (e) => {
        const file = e.target.files[0];

        setLoading(true);
        const uploadPhoto = await uploadFile(file);
        setLoading(false);
        setOpenImageVideoUpload(false);

        setMessage(prev => ({
            ...prev,
            videoUrl: uploadPhoto.url
        }));
    };

    const handleClearUploadVideo = () => {
        setMessage(prev => ({
            ...prev,
            videoUrl: ""
        }));
    };

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('message-page', params.userId);
            socketConnection.emit('seen', params.userId);

            socketConnection.on('message-user', (data) => {
                setDataUser(data);
            });

            socketConnection.on('message', (data) => {
                setAllMessage(data);
            });
        }
    }, [socketConnection, params?.userId, user]);

    const handleOnChange = (e) => {
        const { value } = e.target;

        setMessage(prev => ({
            ...prev,
            text: value
        }));
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (message.text || message.imageUrl || message.videoUrl) {
            if (socketConnection) {
                socketConnection.emit('new message', {
                    sender: user?._id,
                    receiver: params.userId,
                    text: message.text,
                    imageUrl: message.imageUrl,
                    videoUrl: message.videoUrl,
                    msgByUserId: user?._id
                });
                setMessage({
                    text: "",
                    imageUrl: "",
                    videoUrl: ""
                });
            }
        }
    };

    return (
        <div
            className="h-screen flex flex-col bg-gradient-to-br from-gray-100 to-blue-100"
        >
            {/* Header */}
            <header className="sticky top-0 h-16 bg-white shadow-md flex justify-between items-center px-4 z-10">
                <div className="flex items-center gap-4">
                    <Link to="/" className="lg:hidden text-gray-600">
                        <FaAngleLeft size={25} />
                    </Link>
                    <Avatar
                        width={50}
                        height={50}
                        imageUrl={dataUser?.profile_pic}
                        name={dataUser?.name}
                        userId={dataUser?._id}
                    />
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800 truncate">
                            {dataUser?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {dataUser.online ? (
                                <span className="text-green-500">Online</span>
                            ) : (
                                <span className="text-gray-400">Offline</span>
                            )}
                        </p>
                    </div>
                </div>
                <button className="text-gray-600 hover:text-indigo-500">
                    <HiDotsVertical size={25} />
                </button>
            </header>

            {/* Messages Section */}
            <section className="flex-grow overflow-y-auto p-4 bg-gray-50 bg-opacity-90">
                <div className="flex flex-col gap-3" ref={currentMessage}>
                    {allMessage.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg max-w-xs md:max-w-md ${
                                user._id === msg?.msgByUserId
                                    ? "ml-auto bg-indigo-200 text-gray-800"
                                    : "bg-white text-gray-800"
                            }`}
                        >
                            {msg?.imageUrl && (
                                <img
                                    src={msg?.imageUrl}
                                    alt={msg?.text ? msg.text : "User uploaded content"}
                                    className="rounded-lg mb-2 w-full h-auto max-h-64 object-cover"
                                />
                            )}
                            {msg?.videoUrl && (
                                <video
                                    src={msg.videoUrl}
                                    className="rounded-lg mb-2 w-full h-auto max-h-64 object-cover"
                                    controls
                                />
                            )}
                            <p>{msg.text}</p>
                            <p className="text-xs text-right text-gray-500 mt-1">
                                {moment(msg.createdAt).format('hh:mm A')}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Image Preview */}
                {message.imageUrl && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="relative bg-white p-4 rounded-lg">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                onClick={handleClearUploadImage}
                            >
                                <IoClose size={24} />
                            </button>
                            <img
                                src={message.imageUrl}
                                alt="Preview"
                                className="rounded-lg max-w-md w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                )}

                {/* Video Preview */}
                {message.videoUrl && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <div className="relative bg-white p-4 rounded-lg">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                onClick={handleClearUploadVideo}
                            >
                                <IoClose size={24} />
                            </button>
                            <video
                                src={message.videoUrl}
                                className="rounded-lg max-w-md w-full h-auto object-cover"
                                controls
                                autoPlay
                                muted
                            />
                        </div>
                    </div>
                )}

                {/* Loading Indicator */}
                {loading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                        <Loading />
                    </div>
                )}
            </section>

            {/* Input Section */}
            <section className="h-16 bg-white flex items-center px-4 border-t border-gray-200">
                <div className="relative">
                    <button
                        onClick={handleUploadImageVideoOpen}
                        className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600"
                    >
                        <FaPlus size={20} />
                    </button>
                    {openImageVideoUpload && (
                        <div className="absolute bottom-14 left-0 bg-white border rounded shadow-lg p-2 z-10">
                            <form>
                                <label
                                    htmlFor="uploadImage"
                                    className="flex items-center p-2 gap-3 hover:bg-gray-100 cursor-pointer rounded"
                                >
                                    <FaImage className="text-indigo-500" size={18} />
                                    <p className="text-gray-700">Image</p>
                                </label>
                                <label
                                    htmlFor="uploadVideo"
                                    className="flex items-center p-2 gap-3 hover:bg-gray-100 cursor-pointer rounded"
                                >
                                    <FaVideo className="text-purple-500" size={18} />
                                    <p className="text-gray-700">Video</p>
                                </label>
                                <input
                                    type="file"
                                    id="uploadImage"
                                    onChange={handleUploadImage}
                                    className="hidden"
                                />
                                <input
                                    type="file"
                                    id="uploadVideo"
                                    onChange={handleUploadVideo}
                                    className="hidden"
                                />
                            </form>
                        </div>
                    )}
                </div>
                <form className="flex-grow flex items-center gap-2" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-grow bg-gray-200 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={message.text}
                        onChange={handleOnChange}
                    />
                    <button
                        type="submit"
                        className="text-indigo-500 hover:text-indigo-700"
                    >
                        <IoSend size={28} />
                    </button>
                </form>
            </section>
        </div>
    );
};

export default MessagePage;
