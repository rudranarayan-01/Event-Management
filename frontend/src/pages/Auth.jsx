import { SignIn, SignUp, useSignIn } from "@clerk/clerk-react";
import React, { useState } from 'react';

export const AuthPage = async ({ mode }) => {
    const [isLogin, setIsLogin] = useState(false)
    const [password, setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [code, setCode] = useState("")
    const [sucessfulCreation, setSuccefulCreation] = useState(false)
    const [error, setError] = useState()

    const { signIn, setSignIn, setActive, isLoaded } = useSignIn()
    if (!isLoaded) return null;


    await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
    })

    const createResetToken =async(e) =>{
        e.preventDefault();
        try {
            await signIn.create({
                strategy:"reset_password_email_code",
                identifier:email
            });
            setSuccessfullCreation(true)
        } catch (error) {
            console.log(error)
        }
    }

    const resetPassword = async(code, newPassword)=>{
        try {
            const result = await signIn.attemptFirstFactor({
            strategy:"reset_password_email_code",
            code:code,
            password:password
        })
        if(result.status === "complete"){
            await setActive({session:result.createdSessionId})
            NavigationHistoryEntry("/dashboard")
        }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <form action="">
                
            </form>
        </div>
    );
};