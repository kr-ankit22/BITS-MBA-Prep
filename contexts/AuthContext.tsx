
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { ADMIN_EMAILS, FACULTY_EMAILS } from '../constants';

type UserRole = 'admin' | 'faculty' | 'student' | null;

interface AuthState {
    user: User | null;
    session: Session | null;
    role: UserRole;
    loading: boolean;
    initialized: boolean;
}

interface AuthContextType extends AuthState {
    signOut: () => Promise<void>;
    mockLogin: (email: string, role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        role: null,
        loading: true,
        initialized: false
    });

    const lastSessionId = React.useRef<string | null>(null);
    const fetchIdCounter = React.useRef(0);

    const checkRole = async (email: string, userId: string, retryCount = 0): Promise<UserRole> => {
        const fetchId = ++fetchIdCounter.current;
        const normalizedEmail = email.toLowerCase().trim();

        try {
            console.log(`[AuthDebug] Fetching role [Attempt:${retryCount + 1}] for: ${normalizedEmail}`);

            // Timeout Promise to prevent hanging indefinitely
            const dbPromise = supabase
                .from('user_roles')
                .select('role')
                .ilike('email', normalizedEmail)
                .maybeSingle();

            const timeoutPromise = new Promise<{ data: null, error: { message: string } }>((resolve) => {
                setTimeout(() => resolve({ data: null, error: { message: 'Request timed out' } }), 5000);
            });

            // Race the DB call against the 5s timer
            // @ts-ignore - Supabase types vs custom timeout type match
            const { data, error } = await Promise.race([dbPromise, timeoutPromise]);

            // Safety: If user changed or a new fetch started, abort
            if (userId !== lastSessionId.current || fetchId !== fetchIdCounter.current) {
                return null;
            }

            if (error) {
                console.error('[AuthDebug] DB Error:', error);
                return 'student';
            }

            if (!data) {
                // If we got null but we're pretty sure this user should have a role (like a BITS admin)
                // we retry once to handle JWT propagation delay
                if (retryCount < 1) {
                    await new Promise(r => setTimeout(r, 800));
                    return checkRole(email, userId, retryCount + 1);
                }
                return 'student';
            }

            return data.role as UserRole;
        } catch (err) {
            return 'student';
        }
    };

    useEffect(() => {
        let isMounted = true;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const userId = session?.user?.id || null;
            console.log(`[AuthDebug] Event: ${event} | User: ${userId}`);

            if (!isMounted) return;

            if (!session) {
                lastSessionId.current = null;
                setState(prev => ({ ...prev, user: null, session: null, role: null, loading: false, initialized: true }));
                return;
            }

            // If it's a new login or session refresh (ID change)
            if (userId !== lastSessionId.current) {
                lastSessionId.current = userId;
                setState(prev => ({ ...prev, user: session.user, session, loading: true }));

                const detectedRole = await checkRole(session.user.email!, userId);

                if (isMounted && userId === lastSessionId.current) {
                    setState(prev => ({ ...prev, role: detectedRole, loading: false, initialized: true }));
                }
            } else {
                // Just sync basic user data without re-fetching role
                setState(prev => ({ ...prev, user: session.user, session, loading: false, initialized: true }));
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setState({ user: null, session: null, role: null, loading: false, initialized: true });
        lastSessionId.current = null;
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
        setState({ user: mockUser, session: null, role, loading: false, initialized: true });
    };

    return (
        <AuthContext.Provider value={{ ...state, signOut, mockLogin }}>
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
