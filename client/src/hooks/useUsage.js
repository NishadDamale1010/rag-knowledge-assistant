import { useEffect, useState } from "react";
import api from "../api/axios";

function useUsage() {
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUsage = async () => {
        try {
            const res = await api.get("/auth/usage");
            setUsage(res.data.usage);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsage();
    }, []);

    return { usage, loading, fetchUsage, setUsage };
}

export default useUsage;
