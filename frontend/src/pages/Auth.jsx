import { SignIn, SignUp } from "@clerk/clerk-react";
import React from 'react';

export const AuthPage = ({ mode }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {mode === "signin" ? (
                <SignIn routing="path" path="/auth/signin" signUpUrl="/auth/signup" />
            ) : (
                <SignUp routing="path" path="/auth/signup" signInUrl="/auth/signin" />
            )}
        </div>
    );
};