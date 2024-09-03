import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import io from 'socket.io-client';

const Home = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    console.log('user', user);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
                const response = await axios({
                    url: URL,
                    withCredentials: true,
                });

                dispatch(setUser(response.data.data));

                if (response.data.data.logout) {
                    dispatch(logout());
                    navigate('/email');
                }
                console.log('current user Details', response);
            } catch (error) {
                console.log('error', error);
            }
        };

        fetchUserDetails();
    }, [dispatch, navigate]);

    /***socket connection */
    useEffect(() => {
        const socketConnection = io(process.env.REACT_APP_BACKEND_URL, {
            auth: {
                token: localStorage.getItem('token'),
            },
        });

        socketConnection.on('onlineUser', (data) => {
            console.log(data);
            dispatch(setOnlineUser(data));
        });

        dispatch(setSocketConnection(socketConnection));

        return () => {
            socketConnection.disconnect();
        };
    }, [dispatch]);

    const basePath = location.pathname === '/';
    return (
        <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen bg-gray-100">
            <section className={`bg-white shadow-lg ${!basePath && 'hidden'} lg:block`}>
                <Sidebar />
            </section>

            {/**message component**/}
            <section className={`${basePath && 'hidden'} bg-white shadow-md`}>
                <Outlet />
            </section>

            <div
                className={`justify-center items-center flex-col gap-4 hidden ${
                    !basePath ? 'hidden' : 'lg:flex'
                } bg-gradient-to-r from-green-400 to-blue-500 text-white`}
            >
                <div>
                    <h1 className="text-4xl font-bold">Chat App</h1>
                </div>
                <p className="text-xl mt-2">Select a user to start messaging</p>
            </div>
        </div>
    );
};

export default Home;
