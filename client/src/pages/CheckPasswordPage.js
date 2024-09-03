import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

const CheckPasswordPage = () => {
  const [data,setData] = useState({
    password : "",
    userId : ""
  })
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!location?.state?.name){
      navigate('/email')
    }
  },[location?.state?.name, navigate])

  const handleOnChange = (e)=>{
    const { name, value} = e.target

    setData((preve)=>{
      return{
          ...preve,
          [name] : value
      }
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

    try {
        const response = await axios({
          method :'post',
          url : URL,
          data : {
            userId : location?.state?._id,
            password : data.password
          },
          withCredentials : true
        })

        toast.success(response.data.message)

        if(response.data.success){
            dispatch(setToken(response?.data?.token))
            localStorage.setItem('token',response?.data?.token)

            setData({
              password : "",
            })
            navigate('/')
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden p-8 mx-4">
                <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
                    <Avatar
                        width={80}
                        height={80}
                        name={location?.state?.name}
                        imageUrl={location?.state?.profile_pic}
                    />
                    <h2 className="font-semibold text-2xl mt-2 text-gray-800">{location?.state?.name}</h2>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                            Password:
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                            value={data.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-lg px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    <Link to="/forgot-password" className="text-green-500 font-semibold hover:underline">
                        Forgot password?
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CheckPasswordPage

