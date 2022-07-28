import * as React from "react";
import toast from "react-hot-toast";
import { XIcon } from "@heroicons/react/solid";

const CustomNotification = () => {
    toast.custom((t) => (
        <div
            className={`${
                t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="ml-3 flex-1">
                        <p className="text-lg font-medium text-[#3D3D3D]">
                            New Connection is live only on Testnets!
                        </p>
                        <p className="text-lg text-[#6858CB]">
                            Please Switch Network to Mumbai, Fuji or Gorelic Testnets
                        </p>
                        {/* <button
                            className="bg-[#6858CB] text-white w-full mt-5 my-2 py-3 rounded-md hover:bg-[#5446af] hover:text-white active:bg-[#403684]"
                            onClick={() => null}
                        ></button> */}
                    </div>
                </div>
                <button
                    className="absolute top-[18px] right-4 rounded hover:bg-neutral-200"
                    onClick={() => toast.dismiss(t.id)}
                >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    ));
};

export default CustomNotification;
