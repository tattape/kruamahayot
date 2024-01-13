import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";

type Props = {
    Open: boolean;
    CloseModal: any;
    TrackingNo: string;
    Express: string;
}

function TrackingModal({ Open, CloseModal, TrackingNo, Express }: Props) {
    const [copySuccess, setCopySuccess] = useState('คัดลอกหมายเลขพัสดุ');

    const copyToClipboard = () => {
        navigator.clipboard.writeText(TrackingNo).then(() => {
            setCopySuccess('คัดลอกสำเร็จ!');
        }, () => {
            setCopySuccess('คัดลอกไม่สำเร็จ!');
        });
    };

    const checkStatus = () => {
        if (Express === 'flash') {
            window.open('https://www.flashexpress.co.th/fle/tracking', '_blank')
        }
    };

    useEffect(() => {
        setCopySuccess('คัดลอกหมายเลขพัสดุ');
    }, [Open])


    return (
        <>
            <Transition appear show={Open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={CloseModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-xl font-medium leading-6 text-gray-900 flex justify-between"
                                    >
                                        <p>ข้อมูลเลขพัสดุ</p>
                                        <IoClose onClick={CloseModal} className='text-gray-600 font-semibold cursor-pointer text-2xl' />
                                    </Dialog.Title>
                                    <div className="mt-2 flex flex-col gap-2">
                                        <input className='border bg-slate-50 outline-none rounded-lg p-3 text-md text-center font-bold' readOnly type="text" value={TrackingNo} />
                                        <button
                                            type="button"
                                            className="font-semibold inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm text-blue-900 hover:bg-blue-200 outline-none transition-all"
                                            onClick={copyToClipboard}
                                        >
                                            {copySuccess}
                                        </button>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="w-full font-semibold inline-flex justify-center rounded-md border border-transparent bg-orange-200 px-4 py-2 text-sm text-orange-900 hover:bg-orange-300 outline-none transition-all"
                                            onClick={checkStatus}
                                        >
                                            เช็คสถานะพัสดุ
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default TrackingModal