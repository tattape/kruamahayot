// pages/index.js
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Logo from '../images/logo.png';

function HomePage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [data, setData] = useState(null);
    const [isFound, setIsFound] = useState(true); // เพิ่มสถานะการพบข้อมูล
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
    const db = getFirestore(app);
    // const analytics = getAnalytics(app);

    const handleSearch = async (e: any) => {
        e.preventDefault();
        setIsFound(true); // รีเซ็ตสถานะการพบข้อมูล
        if (phoneNumber === '') {
            //ไม่ได้กรอกเบอร์โทรศัพท์มา
            setData(null)
            return
        }
        const q = query(collection(db, 'trackingitems'), where('phone', '==', phoneNumber), orderBy('date', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            // พบข้อมูล
            querySnapshot.forEach((doc: any) => {
                setData(doc.data());
            });
            return
        }
        // ไม่พบข้อมูล
        setData(null);
        setIsFound(false);
    };

    return (
        <div className='flex justify-center'>
            <div className='container'>
                <div className="flex flex-col justify-center items-center py-20 text-gray-800">
                    <Image src={Logo} width={200} height={200} alt='logo-kruamahayot' />
                    <div className='font-bold text-3xl md:text-5xl text-center'>ติดตามเลขพัสดุ</div>
                </div>
                <div className='flex flex-col justify-center items-center gap-4 text-gray-800'>
                    <div className='font-bold text-xl md:text-3xl'>กรุณาใส่เบอร์โทรศัพท์ของคุณ</div>
                    <form onSubmit={handleSearch} className='flex justify-center'>
                        <input className='transition-all rounded-s-lg focus:outline-none bg-slate-200 text-xl md:text-2xl p-2' type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                        <button className='bg-blue-900 hover:bg-blue-950 transition-all active:text-gray-300 rounded-e-lg px-4 text-white font-medium text-lg md:text-xl' type='submit' onClick={handleSearch}>ค้นหา</button>
                    </form>
                    {!isFound ?
                        <div>ไม่พบข้อมูล</div> :
                        data &&
                        <div>{JSON.stringify(data)}</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default HomePage;
