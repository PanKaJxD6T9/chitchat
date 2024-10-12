import Background from '@/assets/login2.png'
import Victory from '@/assets/victory.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import React, { useState } from 'react'

const Auth = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogin = async() => {};

  const handleRegister = async() => {};
  

  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
      <div className='h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
        <div className='flex flex-col gap-10 items-center justify-center'>
          <div className='flex items-center justify-center flex-col'>
            <div className='flex items-center justify-center'>
              <h1 className='text-5xl font-bold md:text-6xl'>
                Welcome
              </h1>
            </div>
            <p className='font-medium text-center'>Fill the details and get started</p>
          </div>
          <div className='flex items-center justify-center w-full '>
            <Tabs className='w-3/4'>
              <TabsList className='bg-transparent rounded-none w-full'>
                <TabsTrigger className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300' value='login' >Login</TabsTrigger>
                <TabsTrigger className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300' value='register' >Register</TabsTrigger>
              </TabsList>
              <TabsContent className='flex flex-col gap-5 mt-10' value='login' >
                <Input placeholder='Email' type='email' className='rounded-full p-6' value={email} onChange={(e)=>setEmail(e.target.value)} />
                <Input placeholder='Password' type='password' className='rounded-full p-6' value={password} onChange={(e)=>setPassword(e.target.value)} />
                <Button className='rounded-full p-6' type='submit' onSubmit={handleLogin} >Login</Button>
              </TabsContent>
              <TabsContent className='flex flex-col gap-5' value='register' >
                <Input placeholder='Email' type='email' className='rounded-full p-6' value={email} onChange={(e)=>setEmail(e.target.value)} />
                <Input placeholder='Password' type='password' className='rounded-full p-6' value={password} onChange={(e)=>setPassword(e.target.value)} />
                <Input placeholder='Confirm Password' type='password' className='rounded-full p-6' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                <Button className='rounded-full p-6' type='submit' onSubmit={handleRegister} >Register</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={'https://images.unsplash.com/photo-1566888596782-c7f41cc184c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80'} alt='Background' className='h-[700px] object-cover'/>
        </div>
      </div>
    </div>
  )
}

export default Auth