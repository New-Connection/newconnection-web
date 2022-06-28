import { FileUploader } from "react-drag-drop-files";
import ImageIcon from "../../assets/ImageIcon.png";
import Image from "next/image";

import { IDragAndDrop } from "./types";

const fileTypes = ["JPEG", "PNG", "JPG"];

export const DragAndDropImage = ({
    label,
    name,
    className,
    multipleFiles = false,
    hoverTitle,
    handlerChange,
    ...props
}: IDragAndDrop) => {
    return (
        <div className={className}>
            <span className="input-label">{label}</span>
            <FileUploader
                hoverTitle={hoverTitle}
                multiple={multipleFiles}
                handleChange={handlerChange}
                name={name}
                types={fileTypes}
                {...props}
            >
                <div
                    className="flex flex-col text-center py-6 px-3 mt-[5px] border-dashed
                               rounded-md border-2 border-slate-300
                               bg-slate-800 bg-[#fdfdfda6] hover:border-slate-800 items-center h-[200px]"
                >
                    <Image src={ImageIcon} width={"50"} height={"50"} />
                    <p className="text-slate-500 mt-5">PNG, JPEG and JPG accept. Max 1mb.</p>
                    {/* <p className='text-slate-400'>{file ? `File name: ${file?.name} ✅` : "PNG, JPEG and JPG accept. Max 1mb."}</p> */}
                </div>
            </FileUploader>
        </div>
    );
};
