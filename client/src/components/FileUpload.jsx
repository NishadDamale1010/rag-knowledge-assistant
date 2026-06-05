import { useRef, useState } from "react";
import api from "../api/axios";

function FileUpload({ onUploadSuccess }) {
    const fileInputRef = useRef(null);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadFile = async (file) => {
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed");
            return;
        }

        try {
            setUploading(true);
            setProgress(0);

            const formData = new FormData();
            formData.append("pdf", file);

            const response = await api.post(
                "/documents/upload",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },

                    onUploadProgress: (event) => {
                        const percent = Math.round(
                            (event.loaded * 100) /
                            event.total
                        );

                        setProgress(percent);
                    },
                }
            );

            if (onUploadSuccess) {
                onUploadSuccess(response.data);
            }

            alert("PDF uploaded successfully");
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Upload failed"
            );
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        uploadFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];

        uploadFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="w-full">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-white hover:border-blue-500 transition"
            >
                <h2 className="text-lg font-semibold">
                    Upload PDF
                </h2>

                <p className="text-gray-500 mt-2">
                    Drag & drop your PDF here
                </p>

                <p className="text-gray-400 my-3">
                    or
                </p>

                <button
                    onClick={() =>
                        fileInputRef.current.click()
                    }
                    disabled={uploading}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    Select PDF
                </button>

                <input
                    type="file"
                    accept=".pdf"
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                {uploading && (
                    <div className="mt-6">
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                                className="bg-blue-600 h-3 rounded-full transition-all"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />
                        </div>

                        <p className="mt-2 text-sm text-gray-600">
                            Uploading... {progress}%
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileUpload;