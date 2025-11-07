import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '../services/firebaseService';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange((user) => {
            setUser(user);
            setLoading(false);
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { user, loading };
};
