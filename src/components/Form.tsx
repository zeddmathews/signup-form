import { useState } from "react";
import TextField from "./TextField";

export default function Form() {
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [verifyError, setVerifyError] = useState('');
    const [postError, setPostError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(email);
        try {
            const res = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username, email, password
                }),
            });

            const data = await res.json();
            if (!res.ok){
                setPostError(data.message ? data.message : "some shit broke");
                throw new Error(data.message || 'some shit broke');
            }
        } catch (error: unknown) {
            console.log(error.message);
            
        }
    };

    const validateUsername = () => {
        const usernameRegex = /^[a-zA-Z0-9]*$/;
        if (username.length < 4)
            setUsernameError('Username too short');
        else if (!usernameRegex.test(username))
            setUsernameError('No special characters allowed');
        else
            setUsernameError('');
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const validatePassword = () => {
        let error = '';
        const specialCharsRegex = /[!-/:-@[-`{-~]/;
        if (password.length < 8) {
            error = 'Password must be at least 8 characters long';
        } else if (password.length > 20) {
            error = 'Password must be no more than 20 characters long';
        } else if (!/[a-z]/.test(password)) {
            error = 'Password must include at least one lowercase letter';
        } else if (!/[A-Z]/.test(password)) {
            error = 'Password must include at least one uppercase letter';
        } else if (!/\d/.test(password)) {
            error = 'Password must include at least one number';
        } else if (!specialCharsRegex.test(password)) {
            error = 'Password must include at least one special character';
        } else {
            error = '';
        }

        setPasswordError(error);
    };

    const validateVerifyPassword = () => {
        if (password !== verifyPassword)
            setVerifyError('Passwords do not match');
        else
            setVerifyError('');
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.type === 'email') 
            validateEmail();
        else if (event.target.type === 'text')
            validateUsername();
        else if (event.target.type === 'password') {
            validatePassword();
            validateVerifyPassword();
        }
    };

    return (
        <div className="container mx-auto p-4 dark:bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="form-group mb-4">
                    <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">Username:</label>
                    <TextField
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={handleBlur}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    {usernameError && <div className="error text-red-600 dark:text-red-400 mt-1">{usernameError}</div>}
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email:</label>
                    <TextField
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleBlur}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    {emailError && <div className="error text-red-600 dark:text-red-400 mt-1">{emailError}</div>}
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">Password:</label>
                    <TextField
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={handleBlur}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    {passwordError && <div className="error text-red-600 dark:text-red-400 mt-1">{passwordError}</div>}
                </div>
                <div className="form-group mb-4">
                    <label htmlFor="verify-password" className="block text-gray-700 dark:text-gray-300 mb-2">Verify Password:</label>
                    <TextField
                        type="password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        onBlur={handleBlur}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    {verifyError && <div className="error text-red-600 dark:text-red-400 mt-1">{verifyError}</div>}
                </div>
                {postError && <div className="error text-red-600 dark:text-red-400 mt-1">{postError}</div>}
                <button type="submit" className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-lg mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
}
