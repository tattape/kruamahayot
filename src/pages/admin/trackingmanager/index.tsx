import Sidebar from '@/components/sidebar/Sidebar';
import React, { useEffect, useState } from 'react'
import { AiOutlineMenu } from 'react-icons/ai';
import { IoClose } from "react-icons/io5";
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

type Props = {}

function TrackingManagerPage({ }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [IsAuth, setIsAuth] = useState(false);
    const router = useRouter();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

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

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/admin')
                return
            }
            setIsAuth(true);
        });
    }, [])


    if (IsAuth) {
        return (
            <div className="flex justify-center">
                index
                <div className="flex justify-end w-full">
                    <button onClick={toggleSidebar} className="fixed top-5 right-5 z-50 text-gray-700">
                        {!sidebarOpen ? <AiOutlineMenu size="24" /> : <IoClose size="34" />}
                    </button>
                    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                </div>
            </div>
        )
    }
}

export default TrackingManagerPage