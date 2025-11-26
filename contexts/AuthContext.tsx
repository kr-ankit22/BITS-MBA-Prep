
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { ADMIN_EMAILS, FACULTY_EMAILS } from '../constants';

type UserRole = 'admin' | 'faculty' | 'student' | null;

interface AuthContextType {
    session: Session | null;
    user: User | null;
    role: UserRole;
    loading: boolean;
    signOut: () => Promise<void>;
    mockLogin: (email: string, role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            fetchUserRole(session?.user?.email, session?.user?.app_metadata?.provider);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            fetchUserRole(session?.user?.email, session?.user?.app_metadata?.provider);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserRole = async (email: string | undefined, provider: string | undefined) => {
        if (!email) {
            setRole(null);
            return;
        }

        // 1. Domain Restriction for Google Login
        if (provider === 'google' && !email.endsWith('@pilani.bits-pilani.ac.in')) {
            await supabase.auth.signOut();
            alert('Access Denied: Please use your institutional email (@pilani.bits-pilani.ac.in).');
            return;
        }

        // 2. Fetch Role from DB (Whitelist Check)
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role, auth_provider')
                .eq('email', email)
                .single();

            if (error || !data) {
                console.warn('User not in whitelist:', email);
                // Optional: Sign out if strict whitelist is enforced
                // await supabase.auth.signOut(); 
                // setRole(null);
                // alert('Access Denied: You are not authorized to access this platform.');

                // For now, default to 'student' but maybe restrict access further?
                // Let's stick to the plan: If not in whitelist, they are just a student (or guest).
                // But for Admin/Faculty portals, the route protection will block them anyway.
                setRole('student');
                return;
            }

            // 3. Provider Mismatch Check (Optional but good for security)
            // If user logged in with Google but DB says 'local', we might want to block.
            // For now, we'll be lenient or strict based on preference. 
            // Let's just trust the email match for now to avoid locking people out during migration.

            setRole(data.role as UserRole);

        } catch (err) {
            console.error('Error fetching user role:', err);
            setRole('student');
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setRole(null);
        setUser(null);
        setSession(null);
    };

    const mockLogin = (email: string, role: UserRole) => {
        const mockUser: User = {
            id: 'mock-user-id',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            email: email,
            phone: '',
            role: 'authenticated',
            updated_at: new Date().toISOString()
        };

        setUser(mockUser);
        setRole(role);
        // We don't set a real session, but the app relies on 'user' and 'role' mostly.
    };

    return (
        <AuthContext.Provider value={{ session, user, role, loading, signOut, mockLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
