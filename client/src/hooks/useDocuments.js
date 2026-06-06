import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

function useDocuments() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await api.get("/documents");
            setDocuments(res.data.documents || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id) => {
        try {
            await api.delete(`/documents/${id}`);
            setDocuments((prev) => prev.filter((doc) => doc._id !== id));
            toast.success("Document deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete document");
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return { documents, loading, fetchDocuments, deleteDocument };
}

export default useDocuments;
