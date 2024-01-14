import React, { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

function AdminPage() {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [ErrorLogin, setErrorLogin] = useState('');

    const router = useRouter();
    // Firebase configuration
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const Login = async (e: any) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, Email, Password);
            setErrorLogin('');
            router.push('/admin/trackingmanager');
        } catch (error) {
            setErrorLogin('Email หรือ รหัสผ่านไม่ถูกต้อง');
            console.error("Error logging in:", error);
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/admin/trackingmanager');
                return
            }
        });
    }, [])


    return (
        <div className="flex justify-center">
            <form onSubmit={Login} className="flex flex-col h-screen justify-center items-center gap-5">
                <p className="text-bold text-2xl font-bold text-gray-800">เข้าสู่ระบบ ADMIN</p>
                <input
                    onChange={(e: any) => { setEmail(e.target.value) }}
                    placeholder='Email'
                    type="email"
                    className="text-xl outline-none rounded-md p-2"
                    required />
                <input
                    onChange={(e: any) => { setPassword(e.target.value) }}
                    placeholder='Password'
                    type="password"
                    className="text-xl outline-none rounded-md p-2"
                    required />
                <button
                    type='submit'
                    className="hover:text-white active:text-gray-500 hover:bg-gradient-to-r hover:from-[#7d95ff] hover:to-[#718bfe] transition-all bg-gradient-to-r from-[#7d95ff] to-[#eb9cfc] p-2 w-full rounded-md font-semibold text-slate-700">เข้าสู่ระบบ</button>
                <p className="text-center text-red-500 font-bold">{ErrorLogin}</p>
            </form>
        </div>
    )
}

export default AdminPage