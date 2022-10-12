import { FileUploader } from "react-drag-drop-files";
import ASSETS from "assets/index";
import Image from "next/image";
import { IDragAndDropProps } from "./types";
import { useState } from "react";

const fileTypes = ["JPEG", "PNG", "JPG"];

// Maybe change the next time: https://react-dropzone.js.org/
// Tutorial: https://blog.openreplay.com/create-a-drag-and-drop-zone-in-react-with-react-dropzone
export const DragAndDropImage = ({
    label,
    name,
    className,
    multipleFiles = false,
    hoverTitle = "Drag and drop file here",
    handleChange,
    ...props
}: IDragAndDropProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [errorMessages, setErrorMessages] = useState<string | undefined>();
    const [preview, setPreview] = useState("");

    const onTypeError = (err = 1) => {
        setErrorMessages(err.toString());
        setError(true);
    };
    const onSizeError = (err = 1) => {
        setErrorMessages(err.toString());
        setError(true);
    };
    const localHandleChange = (file: File) => {
        setFile(file);
        setError(false);
        setPreview(() => URL.createObjectURL(file));
    };
    return (
        <div className={className}>
            <div className="input-label">{label}</div>
            <FileUploader
                hoverTitle={hoverTitle}
                multiple={multipleFiles}
                handleChange={(file: File) => {
                    localHandleChange(file);
                    handleChange(file);
                }}
                name={name}
                disabled={false}
                maxSize={1}
                types={fileTypes}
                onSizeError={onSizeError}
                onTypeError={onTypeError}
                {...props}
            >
                <div
                    className="flex flex-col 
                    justify-center content-center items-center text-center
                    h-60 
                    border-dashed rounded-md border-2 
                    border-[#F2F4F4] hover:border-[#6858CB] focus:text-white"
                >
                    {error ? (
                        <p className="text-red mt-1">Error: {errorMessages}</p>
                    ) : (
                        <>
                            {file ? (
                                <div className={"flex flex-col h-full justify-between w-full p-3"}>
                                    <div className={"w-full h-full overflow-hidden relative"}>
                                        <Image src={preview} layout={"fill"} /></div>
                                    <div>
                                        <p className="text-purple mt-1">File is accepted ✅</p>
                                        <p className={" truncate"}>File name: {file?.name}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Image src={ASSETS.imageIcon} width={"50"} height={"50"} />
                                    <p className="text-gray2 mt-6 text-sm px-4">PNG, JPEG and JPG accept. Max 1mb.</p>
                                </>
                            )}
                        </>
                    )}
                </div>
            </FileUploader>
        </div>
    );
};
