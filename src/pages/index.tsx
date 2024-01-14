// pages/index.js
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Logo from '../images/logo.png';
import moment from 'moment-timezone';
import TrackingModal from '@/components/TrackingModal';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoClose } from "react-icons/io5";
import Sidebar from '@/components/sidebar/Sidebar';

function HomePage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [data, setData] = useState([]);
    const [isFound, setIsFound] = useState(true); // เพิ่มสถานะการพบข้อมูล

    //modal
    const [isOpen, setIsOpen] = useState(false);
    const [Express, setExpress] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const handleSearch = async (e: any) => {
        e.preventDefault();
        setIsFound(true); // รีเซ็ตสถานะการพบข้อมูล
        if (phoneNumber === '') {
            //ไม่ได้กรอกเบอร์โทรศัพท์มา
            setData([])
            return
        }
        const q = query(collection(db, 'trackingitems'), where('phone', '==', phoneNumber), orderBy('date', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            // พบข้อมูล
            let Tracking: any = []
            querySnapshot.forEach((doc: any) => {
                Tracking.push(doc.data())
            });
            setData(Tracking);
            return
        }
        // ไม่พบข้อมูล
        setData([]);
        setIsFound(false);
    };

    const TrackingRedirect = (express: string, trackingNo: string) => {
        setTrackingNumber(trackingNo);
        setExpress(express);
        setIsOpen(true)
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className='flex flex-col items-center'>
            <div className="flex justify-end w-full">
                <button onClick={toggleSidebar} className="fixed top-5 right-5 z-50 text-gray-700">
                    {!sidebarOpen ? <AiOutlineMenu size="24" /> : <IoClose size="34" />}
                </button>
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
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
                        data.length != 0 &&
                        <div className='flex flex-col items-center gap-5 w-full pb-10 md:pb-14'>
                            {data.map((info: any, idx: number) => {
                                const date = moment.unix(info.date.seconds).tz('Asia/Bangkok');
                                const formattedDate = date.format('DD/MM/') + (date.year() + 543);
                                return (
                                    <div
                                        onClick={() => { TrackingRedirect(info.express, info.tracking) }}
                                        key={idx}
                                        className="text-gray-900 flex flex-col w-3/4 md:w-1/2 bg-white bg-opacity-30 rounded-xl shadow-lg overflow-hidden backdrop-filter backdrop-blur-lg p-5 cursor-pointer hover:shadow-xl transition-all"
                                    >
                                        <div className='bg-gradient-to-r from-[#8198ff] to-[#efa6ff] rounded-md w-fit px-2 mb-2'>
                                            <p className='font-bold text-lg text-slate-600 hover:text-slate-300 transition-all'>
                                                {info.tracking}
                                            </p>
                                        </div>
                                        <p className='font-bold text-lg'>
                                            {info.name}
                                        </p>
                                        <p className=''>
                                            {info.phone}
                                        </p>
                                        <div className="flex justify-end pt-4">
                                            <p className='text-gray-700'>
                                                {formattedDate}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
            {/* modal */}
            <TrackingModal Open={isOpen} CloseModal={() => { setIsOpen(false) }} TrackingNo={trackingNumber} Express={Express} />
        </div>
    );
}

export default HomePage;
