import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import img from "../assets/notes.jpg";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import loginSchema from "../validators/loginSchema.js";


const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState, reset } = useForm({
        resolver: yupResolver(loginSchema),
    });
    const [toggle, setToggle] = useState(false);
    const onSubmit = async (data) => {
        try {
            const res = await axios.post("http://localhost:8001/user/login", data);
            if (res.data.success) {
                // console.log(res.data)
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                localStorage.setItem("userName", res.data.data.userName);
                localStorage.setItem("loginStatus", "true");
                toast.success("Logged In successfully");
                navigate("/home");
            } else {
                toast.error(res.data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unauthorized access detected, verify your credentials"
            );
            console.log(error)
        }
        reset();
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <>
            <div className="min-h-screen bg-purple-200">
                <Header />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-center mt-20 md:mt-30 w-full px-5 sm:px-0 ">
                        <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
                            <div className="hidden lg:block lg:w-1/2 bg-cover object-contain self-center p-5">
                                <img src={img}></img>

                            </div>
                            <div className="w-full p-8 lg:w-1/2 bg-sky-100">
                                <p className="text-xl text-gray-600 text-center">
                                    Welcome Back!
                                </p>
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none"
                                        type="email"
                                        {...register("email")}
                                        required
                                    />
                                    <p className="text-xs text-red-600 font-semibold h-6">
                                        {formState.errors.email?.message}
                                    </p>

                                    <label className="text-gray-700 text-sm font-bold mb-2">
                                        Password
                                    </label>
                                    {!toggle ? (
                                        <div className="relative">
                                            <input
                                                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none mt-2"
                                                type="password"
                                                {...register("password")}
                                                required
                                            />
                                            <FaEyeSlash
                                                className="absolute inset-y-3 right-2"
                                                onClick={() => setToggle(true)}
                                            />
                                        </div>
                                    ) : (<div className="relative">
                                        <input
                                            className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-none mt-2"
                                            type="text"
                                            {...register("password")}
                                            required
                                        />
                                        <FaEye
                                            className="absolute inset-y-3 right-2"
                                            onClick={() => setToggle(false)}
                                        />
                                    </div>)}
                                    <p className="text-xs text-red-600 font-semibold h-6">
                                        {formState.errors.password?.message}
                                    </p>
                                </div>

                                <div className="mt-8">
                                    <button className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                                        Login
                                    </button>
                                </div>

                                <div className="mt-4 flex items-center w-full text-center">
                                    <Link
                                        to={"/register"}
                                        className="text-xs text-gray-500 capitalize text-center w-full"
                                    >
                                        Don&apos;t have any account yet?
                                        <span className="text-blue-700" onClick={handleRegister}>
                                            {" "}
                                            Sign Up
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <Footer />
            </div>
        </>
    );
};

export default Login;

