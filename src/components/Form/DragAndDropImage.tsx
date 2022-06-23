import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import ImageIcon from "../../assets/ImageIcon.png"

const fileTypes = ["JPEG", "PNG", "GIF"];

export function DragAndDropImage() {
  const [file, setFile] = useState<any | null>(null);
  const handleChange = (file) => {
    setFile(file);
  };
  return (
    <>
      <span className="input-label">File</span>
      <FileUploader
        hoverTitle='Drop here'
        multiple={false}
        handleChange={handleChange}
        label='Max 3 MB.'
        name="file"
        types={fileTypes}
      >
        <div className="flex flex-row gap-x-3 p-14 border-dashed 
          rounded-md border-2 border-slate-800
          bg-slate-800 hover:border-slate-300">
          <img src={ImageIcon.src} className='h-6 w-6'/>
          <p className='text-slate-400'>PNG, JPEG and JPG accept. Max 1mb.</p>
        </div>
      </FileUploader>    
      <p>{file ? `File name: ${file?.name}` : "no files uploaded yet"}</p>
    </>
  );
}