import toast, { ToastBar, Toaster } from "react-hot-toast";
import React from "react";

export const CustomToast = () => {
    return (
        <Toaster
            toastOptions={{
                success: {
                    style: {
                        background: "#D7A1F9",
                        color: "white",
                    },
                },
                error: {
                    style: {
                        background: "#f27575",
                        color: "white",
                    },
                },
                loading: {
                    style: {
                        background: "#84a8ed",
                        color: "white",
                    },
                },
                custom: {
                    position: "top-right",
                    duration: 10000,
                },
            }}
        >
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <button onClick={() => toast.dismiss(t.id)}>
                            <div className={"flex"}>
                                {icon}
                                {message}
                            </div>
                        </button>
                    )}
                </ToastBar>
            )}
        </Toaster>
    );
};
