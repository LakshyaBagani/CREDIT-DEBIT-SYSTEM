import React, { useState } from 'react'

function Login() {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

  return (
    <div>
        <div>
            <h1>Login</h1>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            <button>Login</button>
        </div>
    </div>
  )
}

export default Login