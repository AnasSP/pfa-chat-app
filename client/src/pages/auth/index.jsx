import React, { useState } from 'react'

import Victory from '@/assets/victory.svg'
import Background from '@/assets/login2.png'
import { Tabs, TabsContent, TabsList } from '../../components/ui/tabs'
import { TabsTrigger } from '@radix-ui/react-tabs'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
<<<<<<< HEAD
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client.js'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store'

const Auth = () => {

    const navigate = useNavigate()

    const { setUserInfo } = useAppStore();

=======

const Auth = () => {

>>>>>>> d8b3514 (1st: --> 1:16:31)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

<<<<<<< HEAD

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required")
            return false
        }
        if(!password.length){
            toast.error("Password is required")
            return false
        }
        return true
    }


    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required")
            return false
        }
        if(!password.length){
            toast.error("Password is required")
            return false
        }
        if(password.length < 6){
            toast.error("Password must be at least 6 characters long")
            return false
        }
        if(password !== confirmPassword){
            toast.error("Passwords do not match")
            return false
        }
        return true
    }

    const handleLogin = async () => {
        if (validateLogin()) {
            try {
                const res = await apiClient.post(
                    LOGIN_ROUTE,
                    { email, password },
                    { withCredentials: true }
                );
    
                if (res.data?.user?._id) {
                    setUserInfo(res.data.user);
                    if (res.data.user.profileSetup) {
                        navigate("/chat");
                        toast.success("Logged in successfully");
                    } else {
                        navigate("/profile");
                        toast.info("Please complete your profile");
                    }
                } else {
                    toast.error("Login not allowed: Invalid user data received.");
                }
    
                console.log("🚀 ~ handleLogin ~ res:", res);
            } catch (error) {
                toast.error( "Invalid credentials");
                console.error("Login error:", error);
            }
        }
    };

    const handleSignup = async () => {
    if (validateSignup()) {
        try {
            const res = await apiClient.post(
                SIGNUP_ROUTE,
                { email, password },
                { withCredentials: true }
            );

            if (res.status === 201 && res.data?.user?._id) {
                setUserInfo(res.data.user);
                navigate("/profile");
                toast.info("Please complete your profile.");
            } else {
                toast.error("Signup failed: Invalid user data received.");
            }

            console.log("🚀 ~ handleSignup ~ res:", res);
        } catch (error) {
            toast.error("Signup failed: Something went wrong.");
            console.error("Signup error:", error);
        }
    }
};
=======
    const handleLogin = async () => {}

    const handleSignup = async () => {}
>>>>>>> d8b3514 (1st: --> 1:16:31)


  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
        <div className='h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 '>

            <div className='flex flex-col gap-10 items-center justify-center'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-center'>
                        <h1 className='text-5xl font-bold md:text-6xl'>
                            Welcome 
                        </h1>
                        <img src={Victory} alt="Victory emoji" className='h-[100px] ' />
                    </div>
                    <p className='font-medium text-center '>Get started with us</p>
                </div>
                <div className="flex items-center justify-center w-full "> 
<<<<<<< HEAD
                    <Tabs className='w-3/4' defaultValue='login' >
=======
                    <Tabs className='w-3/4'>
>>>>>>> d8b3514 (1st: --> 1:16:31)
                        <TabsList className='bg-transparent rounded-none w-full'>

                            <TabsTrigger value='login' className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 cursor-pointer '>Login</TabsTrigger>


                            <TabsTrigger value='signup' className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 cursor-pointer '>Signup</TabsTrigger>

                        </TabsList>


                        <TabsContent value='login' className='flex flex-col mt-10 gap-5 ' >

                            <Input placeholder='Email' type='email' className='rounded-full p-6' value={email} onChange={(e)=> setEmail(e.target.value)} />
                            
                            <Input placeholder='Password' type='password' className='rounded-full p-6' value={password} onChange={(e)=> setPassword(e.target.value)} />

                            <Button className="rounded-full  p-6" onClick={handleLogin} >Login</Button>


                        </TabsContent>

                        <TabsContent value='signup' className='flex flex-col mt-10 gap-5 ' >

                            <Input placeholder='Email' type='email'     className='rounded-full p-6' value={email}  onChange={(e)=> setEmail(e.target.value)} />
                            
                            <Input placeholder='Password' type='password' className='rounded-full p-6' value={password} onChange={(e)=> setPassword(e.target.value)} />

                            <Input placeholder='Confirm Password'   type='password' className='rounded-full p-6'  value={confirmPassword} onChange={(e)=>  setConfirmPassword(e.target.value)} />

                            <Button className="rounded-full  p-6" onClick={handleSignup} >Signup</Button>

                        </TabsContent>

                    </Tabs>

                </div>
            </div>

            <div className='hidden xl:flex justify-center items-center' >
                <img src={Background} alt="backgroud login image" className='h-[700px] ' />
            </div>

        </div>
    </div>
  )
}

export default Auth