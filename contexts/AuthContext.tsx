
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

        // 1. Fetch Role from DB (Whitelist Check)
        try {
            const normalizedEmail = email.toLowerCase().trim();
            console.log(`[AuthDebug] Checking role for: ${normalizedEmail} (Provider: ${provider})`);

            const { data, error } = await supabase
                .from('user_roles')
                .select('role, auth_provider')
                .ilike('email', normalizedEmail)
                .maybeSingle();

            console.log('[AuthDebug] Raw DB Response:', { data, error });

            // 2. Assign Role (Default to 'student' if not in whitelist)
            const isWhitelisted = data && !error;
            if (!isWhitelisted) {
                console.log('[AuthDebug] Normal user (non-whitelist), defaulting to student');
                setRole('student');
                return;
            }

            console.log('[AuthDebug] Authorized role:', data.role);
            setRole(data.role as UserRole);

        } catch (err) {
            console.error('[AuthDebug] Exception:', err);
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
