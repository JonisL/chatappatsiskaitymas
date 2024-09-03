import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';


const CheckEmailPage = () => {
  const [data,setData] = useState({
    email : "",
  })
  const navigate = useNavigate()

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
        const response = await axios.post(URL,data)

        toast.success(response.data.message)

        if(response.data.success){
            setData({
              email : "",
            })
            navigate('/password',{
              state : response?.data?.data
            })
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
  }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden p-8 mx-4">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Check Your Email</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="bg-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            value={data.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg px-4 py-2 rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Let's Go
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    New User?{' '}
                    <Link to="/register" className="text-blue-500 font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default CheckEmailPage
