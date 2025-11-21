
import { supabase } from './supabaseClient';
import { Question, Company, Resource, Topic, Difficulty } from '../types';

// --- Questions ---

export const fetchQuestions = async (): Promise<Question[]> => {
    const { data, error } = await supabase
        .from('questions')
        .select('*, companies(name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching questions:', error);
        return [];
    }

    if (!data) return [];

    return data.map((q: any) => ({
        id: String(q.id),
        companyId: String(q.companyId),
        companyName: q.companies?.name || 'Unknown',
        text: q.question, // Mapped from DB 'question'
        topic: q.topic as Topic,
        difficulty: q.difficulty as Difficulty,
        idealApproach: q.ideal_approach,
        frequency: 0, // Not in DB schema provided, defaulting
        askedInBITS: q.askedAtBITS,
        role: q.role,
        domain: 'General', // Not in DB schema provided, defaulting
    }));
};

export const addQuestion = async (question: Omit<Question, 'id'>): Promise<Question | null> => {
    const dbQuestion = {
        companyId: question.companyId,
        // company_name removed, handled by relation
        question: question.text, // Mapped to DB 'question'
        topic: question.topic,
        difficulty: question.difficulty,
        ideal_approach: question.idealApproach,
        // frequency: question.frequency, // Not in DB schema
        askedAtBITS: question.askedInBITS,
        role: question.role,
        // domain: question.domain, // Not in DB schema
    };

    const { data, error } = await supabase
        .from('questions')
        .upsert([dbQuestion], { onConflict: 'question, companyId' })
        .select('*, companies(name)')
        .single();

    if (error) {
        console.error('Error adding question:', error);
        return null;
    }

    return {
        id: String(data.id),
        companyId: String(data.companyId),
        companyName: data.companies?.name || 'Unknown',
        text: data.question,
        topic: data.topic as Topic,
        difficulty: data.difficulty as Difficulty,
        idealApproach: data.ideal_approach,
        frequency: 0,
        askedInBITS: data.askedAtBITS,
        role: data.role,
        domain: 'General',
    };
};

// --- Companies ---

export const fetchCompanies = async (): Promise<Company[]> => {
    const { data, error } = await supabase
        .from('companies')
        .select('*');

    if (error) {
        console.error('Error fetching companies:', error);
        return [];
    }

    if (!data) return [];

    return data.map((c: any) => ({
        id: String(c.id),
        name: c.name,
        sector: c.sector,
        logo: c.logo,
        description: c.description,
        roles: c.roles || [],
    }));
};

export const addCompany = async (company: Omit<Company, 'id'>): Promise<Company | null> => {
    // Explicitly remove id if it exists at runtime to avoid 22P02 error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...companyData } = company as any;

    const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

    if (error) {
        console.error('Error adding company:', error);
        return null;
    }

    return {
        ...data,
        id: String(data.id)
    } as Company;
};

// --- Resources ---

export const fetchResources = async (): Promise<Resource[]> => {
    const { data, error } = await supabase
        .from('resources')
        .select('*');

    if (error) {
        console.error('Error fetching resources:', error);
        return [];
    }

    if (!data) return [];

    return data.map((r: any) => ({
        ...r,
        id: String(r.id)
    })) as Resource[];
};

export const addResource = async (resource: Omit<Resource, 'id'>): Promise<Resource | null> => {
    // Explicitly remove id if it exists at runtime
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...resourceData } = resource as any;

    const { data, error } = await supabase
        .from('resources')
        .insert([resourceData])
        .select()
        .single();

    if (error) {
        console.error('Error adding resource:', error);
        return null;
    }

    return {
        ...data,
        id: String(data.id)
    } as Resource;
};
