import { Toaster } from "react-hot-toast";
// Lib for alerts on React
// https://react-hot-toast.com/
// https://react-hot-toast.com/docs/styling

const CustomToast = () => {
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
        />
    );
};

export default CustomToast;
