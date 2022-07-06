import { FileUploader } from "react-drag-drop-files";
import ImageIcon from "assets/ImageIcon.png";
import Image from "next/image";
import { IDragAndDropProps } from "./types";
import { useState } from "react";

const fileTypes = ["JPEG", "PNG", "JPG"];

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

    const onTypeError = (err = 1) => {
        setErrorMessages(err.toString());
        setError(true);
    };
    const onSizeError = (err = 1) => {
        setErrorMessages(err.toString());
        setError(true);
    };
    const localHandleChange = (file: File) => {
        setError(false);
        setFile(file);
    };
    return (
        <div className={className}>
            <div className="input-label">{label}</div>
            <FileUploader
                hoverTitle={hoverTitle}
                multiple={multipleFiles}
                handleChange={(file: File) => {
                    localHandleChange(file), handleChange(file);
                }}
                name={name}
                maxSize={1}
                types={fileTypes}
                onSizeError={onSizeError}
                onTypeError={onTypeError}
                {...props}
            >
                <div
                    className="flex flex-col justify-center text-center border-dashed
                               rounded-md border-2 border-[#1bdbad]
                               bg-slate-800 bg-[#fdfdfda6] hover:border-slate-800 items-center h-40"
                >
                    {error ? (
                        <p className="text-slate-500 mt-1">Error: {errorMessages}</p>
                    ) : (
                        <>
                            {file ? (
                                <p className="text-slate-500 mt-1">
                                    File is accepted. File name: {file?.name} ✅
                                </p>
                            ) : (
                                <>
                                    <Image src={ImageIcon} width={"50"} height={"50"} />
                                    <p className="text-slate-500 mt-1">
                                        PNG, JPEG and JPG accept. Max 1mb.
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </div>
            </FileUploader>
        </div>
    );
};
