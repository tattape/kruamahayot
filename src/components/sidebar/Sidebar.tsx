import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

type Props = {
    isOpen: boolean;
    toggleSidebar: any;
}

function Sidebar({ isOpen, toggleSidebar }: Props) {
    const router = useRouter();
    const [IsAuthen, setIsAuthen] = useState(false);

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

    const Logout = () => {
        signOut(auth)
            .then(() => {
                console.log('Logged out successfully');
                toggleSidebar();
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthen(true)
                return
            }
            setIsAuthen(false)
        });
    }, [])

    return (
        <div className={`fixed text-gray-800 text-xl pt-20 px-5 top-0 right-0 w-64 h-full bg-white bg-opacity-30 shadow-md overflow-hidden backdrop-filter backdrop-blur-lg transform ease-in-out transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-center border-b py-2">
                <button onClick={() => { router.push('/'); toggleSidebar() }} className='font-semibold hover:text-white transition-all active:text-gray-500'>หน้าแรก</button>
            </div>
            <div className="flex justify-center border-b py-2">
                <button onClick={() => { router.push('/admin'); toggleSidebar() }} className='font-semibold hover:text-white transition-all active:text-gray-500'>Admin</button>
            </div>
            {IsAuthen &&
                <div className="flex justify-center py-2">
                    <button onClick={Logout} className='font-semibold hover:text-white transition-all active:text-gray-500'>ออกจากระบบ</button>
                </div>
            }
        </div>
    );
}

export default Sidebar