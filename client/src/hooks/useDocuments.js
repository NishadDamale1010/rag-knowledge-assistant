import { useEffect, useState } from "react";
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
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (id) => {
        try {
            await api.delete(`/documents/${id}`);

            setDocuments((prev) =>
                prev.filter((doc) => doc._id !== id)
            );
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return {
        documents,
        loading,
        fetchDocuments,
        deleteDocument,
    };
}

export default useDocuments;