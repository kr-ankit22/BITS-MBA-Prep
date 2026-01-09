# Bug Fixes & Troubleshooting Guide

**Last Updated:** Jan 9, 2026
**Topic:** Authentication & Role-Based Access Control (RBAC)

---

## 1. Critical Bug: The "Student Loop" (Jan 9, 2026)

### Issue Description
Users with `admin` role in the database were persistently seeing the `student` role in the application, even after successful login.

### Root Cause: Infinite Recursion (`42P17`)
The Row Level Security (RLS) policy for Admins was defined recursively:
> *"Allow user to read `user_roles` IF they are an `admin` in `user_roles`."*

When the database tried to check if the user was an admin, it had to query `user_roles`, which triggered the policy again, creating an infinite loop. The database effectively "crashed" the query securely, returning no data, which the frontend interpreted as "User has no role -> Default to Student".

### The Fix
We implemented a **Security Definer Function** to break the loop.
*   **Function:** `is_admin()`
*   **Mechanism:** This function runs with `superuser` privileges (bypassing RLS), so it can check the role validation without triggering the policy recursion.

### SQL Implementation
```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 2. Troubleshooting Guide: Role Errors

If a user complains "I am an Admin but I see Student views", follow this protocol:

### Step 1: Check Data Integrity
**Goal:** Confirm the user *actually* has the Admin role in the DB.
*   **Action:** Check the `user_roles` table.
*   **SQL:** `SELECT * FROM user_roles WHERE email = 'user@email.com';`
*   **Check:** Does `role` = 'admin'? Does `id` match the `auth.users.id`?

### Step 2: Casing Mismatch
**Goal:** Ensure email casing isn't causing lookup failures.
**Context:** Google SSO might return `User@Gmail.com` while DB has `user@gmail.com`.
The current system (Jan 3 Version) expects **EXACT MATCH** for IDs, so email casing matters less for the backend logic (since we match by ID), but matters for the initial data entry.

### Step 3: The "Admin Access" Test (Backend Probe)
**Goal:** Determine if the Application is blocked by RLS.
**Action:** Use the `debug_access_local.ts` script.
1.  Temporarily change the script credentials to the affected user (or a test admin).
2.  Run `npx ts-node debug_access_local.ts`.
3.  **Result Analysis:**
    *   **"READ SUCCESS"**: The backend is fine. Issue is in Frontend Cache (Clear Cache).
    *   **"Infinite recursion"**: RLS Policies are broken (See Fix above).
    *   **"Empty Data"**: The row doesn't exist or ID mismatch.

### Step 4: Emergency Reset
If all else fails, the **Nuclear Option** is to use the Local Admin account to delete and re-add the user.
*   **Login:** `admin@local.com`
*   **Action:** Delete the malfunctioning user from the Admin Dashboard.
*   **Result:** This forces a fresh Auth-to-DB sync on next login.

---

## 3. Deployment Notes
*   **Service:** Netlify
*   **Branch:** `saas-v3`
*   **Critical Env Vars:**
    *   `VITE_SUPABASE_URL`
    *   `VITE_SUPABASE_ANON_KEY`
