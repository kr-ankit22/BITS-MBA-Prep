
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

// --- Recommendations (Mock Data for SaaS Upgrade) ---

import { Recommendation, RecommendationSubject } from '../types';



export const fetchRecommendations = async (): Promise<Recommendation[]> => {
    const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }

    if (!data) return [];

    return data.map((rec: any) => ({
        id: rec.id,
        facultyName: rec.faculty_name,
        date: new Date(rec.created_at).toLocaleDateString(),
        title: rec.title,
        url: rec.url,
        description: rec.description,
        subject: rec.subject as RecommendationSubject,
        goal: rec.goal,
        expectedLearning: rec.expected_learning,
        remarks: rec.remarks,
        timeToComplete: rec.time_to_complete
    }));
};

export const addRecommendation = async (rec: Recommendation): Promise<Recommendation | null> => {
    const dbRec = {
        faculty_name: rec.facultyName,
        title: rec.title,
        url: rec.url,
        description: rec.description,
        subject: rec.subject,
        goal: rec.goal,
        expected_learning: rec.expectedLearning,
        remarks: rec.remarks,
        time_to_complete: rec.timeToComplete
    };

    const { data, error } = await supabase
        .from('recommendations')
        .insert([dbRec])
        .select()
        .single();

    if (error) {
        console.error('Error adding recommendation:', error);
        return null;
    }

    return {
        id: data.id,
        facultyName: data.faculty_name,
        date: new Date(data.created_at).toLocaleDateString(),
        title: data.title,
        url: data.url,
        description: data.description,
        subject: data.subject as RecommendationSubject,
        goal: data.goal,
        expectedLearning: data.expected_learning,
        remarks: data.remarks,
        timeToComplete: data.time_to_complete
    };
};

// --- Interview Experiences (V2 Community Upgrade) ---

import { InterviewExperience } from '../types';

export const fetchExperiences = async (status: 'approved' | 'pending' | 'rejected' | 'all' = 'approved'): Promise<InterviewExperience[]> => {
    let query = supabase
        .from('interview_experiences')
        .select('*')
        .order('created_at', { ascending: false });

    if (status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching experiences:', error);
        return [];
    }

    if (!data) return [];

    return data.map((exp: any) => ({
        id: exp.id,
        companyId: exp.company_id,
        companyName: exp.company_name, // Denormalized or joined
        studentName: exp.student_name,
        role: exp.role,
        date: new Date(exp.created_at).toLocaleDateString(),
        difficulty: exp.difficulty as Difficulty,
        outcome: exp.outcome,
        overallExperience: exp.overall_experience,
        questions: [], // Legacy format not used here usually
        roundsSnapshot: exp.rounds_snapshot, // V2 JSON
        status: exp.status,
        contributorId: exp.contributor_id
    }));
};

export const fetchContributorExperiences = async (contributorId: string): Promise<InterviewExperience[]> => {
    const { data, error } = await supabase
        .from('interview_experiences')
        .select('*')
        .eq('contributor_id', contributorId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching contributor experiences:', error);
        return [];
    }

    if (!data) return [];

    return data.map((exp: any) => ({
        id: exp.id,
        companyId: exp.company_id,
        companyName: exp.company_name,
        studentName: exp.student_name,
        role: exp.role,
        date: new Date(exp.created_at).toLocaleDateString(),
        difficulty: exp.difficulty as Difficulty,
        outcome: exp.outcome,
        overallExperience: exp.overall_experience,
        questions: [],
        roundsSnapshot: exp.rounds_snapshot,
        status: exp.status,
        contributorId: exp.contributor_id
    }));
};

export const addExperience = async (exp: Omit<InterviewExperience, 'id'>): Promise<InterviewExperience | null> => {
    const dbExp = {
        company_id: exp.companyId,
        company_name: exp.companyName,
        student_name: exp.studentName,
        role: exp.role,
        difficulty: exp.difficulty,
        outcome: exp.outcome,
        overall_experience: exp.overallExperience,
        rounds_snapshot: exp.roundsSnapshot, // Save the JSON structure
        status: exp.status || 'pending',
        contributor_id: exp.contributorId
    };

    const { data, error } = await supabase
        .from('interview_experiences')
        .insert([dbExp])
        .select()
        .single();

    if (error) {
        console.error('Error adding experience:', error);
        return null;
    }

    return {
        id: data.id,
        companyId: data.company_id,
        companyName: data.company_name,
        studentName: data.student_name,
        role: data.role,
        date: new Date(data.created_at).toLocaleDateString(),
        difficulty: data.difficulty as Difficulty,
        outcome: data.outcome,
        overallExperience: data.overall_experience,
        questions: [],
        roundsSnapshot: data.rounds_snapshot,
        status: data.status,
        contributorId: data.contributor_id
    };
};
