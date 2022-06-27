import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import ImageIcon from "../../assets/ImageIcon.png"

import classNames from 'classnames';
import { IDragAndDrop } from './types';

export const DragAndDropImage = ({label, name, className, multiplefiles=false, hoverTitle, handlerChange, ...props}:IDragAndDrop) => {
  
  const fileTypes = ["JPEG", "PNG", "JPG"];
  
  return (
    <>
      <span className="input-label">{label}</span>
      <FileUploader
        hoverTitle={hoverTitle}
        multiple={multiplefiles}
        handleChange={handlerChange}
        name={name}
        types={fileTypes}
      >
        <div className="flex flex-row gap-x-3 py-14 px-3 border-dashed 
          rounded-md border-2 border-slate-300
          bg-slate-800 bg-[#fdfdfda6] hover:border-slate-800 items-center">
          <p className='text-slate-500'>PNG, JPEG and JPG accept. Max 1mb.</p>
          {/* <img src={ImageIcon.src} className='h-6 w-6'/> */}
          {/* <p className='text-slate-400'>{file ? `File name: ${file?.name} ✅` : "PNG, JPEG and JPG accept. Max 1mb."}</p> */}
        </div>
      </FileUploader>    
      
    </>
  );
}