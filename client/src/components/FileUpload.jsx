import { useRef, useState } from "react";
import { Upload, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";

function FileUpload({ onUploadSuccess }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragging, setDragging] = useState(false);

    const uploadFile = async (file) => {
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        try {
            setUploading(true);
            setProgress(0);

            const formData = new FormData();
            formData.append("pdf", file);

            const response = await api.post("/documents/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (event) => {
                    const percent = Math.round(
                        (event.loaded * 100) / event.total
                    );
                    setProgress(percent);
                },
            });

            if (onUploadSuccess) {
                onUploadSuccess(response.data);
            }

            toast.success("PDF uploaded and processed");
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const handleFileChange = (e) => {
        uploadFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        uploadFile(e.dataTransfer.files[0]);
    };

    return (
        <div className="w-full">
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 ${
                    dragging
                        ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                }`}
            >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
                    {uploading ? (
                        <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
                    ) : (
                        <Upload className="w-7 h-7 text-indigo-600" />
                    )}
                </div>

                <h2 className="text-xl font-semibold text-slate-800">
                    Upload a PDF
                </h2>
                <p className="text-slate-500 mt-2">
                    Drag and drop your file here, or browse from your device
                </p>

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="mt-6 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <FileText size={18} />
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
                    <div className="mt-8 max-w-sm mx-auto">
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                            Processing... {progress}%
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FileUpload;
