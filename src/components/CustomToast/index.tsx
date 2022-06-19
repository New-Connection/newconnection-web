import { Toaster } from 'react-hot-toast';
import React from 'react';
// Lib for alerts on React
// https://react-hot-toast.com/
// https://react-hot-toast.com/docs/styling

const CustomToast = () => {
  return (
    <Toaster
      toastOptions={{
        success: {
          style: {
            background: '#D7A1F9',
            color: 'white',
          },
        },
        error: {
          style: {
            background: '#FF0000',
            color: 'white',
          },
        },
        loading: {
          style: {
            background: '#0066ff',
            color: 'white',
          },
        },
      }}
    />
  );
};

export default CustomToast;
