
/**
 * LogoService: Handles fetching company logos via logo.dev
 * Replaces the deprecated Clearbit integration with a Search-First strategy.
 */

const API_KEY = 'pk_UWOqpPygSO-A2Tpc-uUYpg'; // User provided 2025-12-20

export const LogoService = {
    /**
     * Tries to find a logo for a company name.
     * 1. Search logo.dev API for the best matching domain.
     * 2. If search fails, fall back to intelligent guessing.
     * 3. Construct the image URL.
     */
    async getLogoUrl(companyName: string): Promise<string> {
        try {
            // 1. Try Search API (Best Accuracy)
            const searchDomain = await this.searchDomain(companyName);
            if (searchDomain) {
                return `https://img.logo.dev/${searchDomain}?token=${API_KEY}`;
            }

            // 2. Fallback: Naive Guessing
            const cleanName = companyName.toLowerCase().trim();
            const domain = `${cleanName.replace(/[^a-z0-9]/g, '')}.com`;

            // 3. Robust Fallback: Unavatar (if we wanted a 3rd layer, but logo.dev is preferred)
            // For now, we return the guessed logo.dev url.
            return `https://img.logo.dev/${domain}?token=${API_KEY}`;

        } catch (e) {
            console.error('Error in LogoService:', e);
            // Fallback to Unavatar if total failure
            return `https://unavatar.io/${encodeURIComponent(companyName)}`;
        }
    },

    /**
     * Queries Logo.dev Search API to find the correct domain.
     * Returns the domain string if found, null otherwise.
     */
    async searchDomain(query: string): Promise<string | null> {
        try {
            // Logo.dev Search API
            // Note: We use the public key. If the API requires a secret key for search and fails,
            // we will catch the error and fallback.
            const response = await fetch(`https://api.logo.dev/search?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });

            if (!response.ok) {
                // console.warn(`Logo Search failed: ${response.status}`);
                return null;
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                // Return the first (best) match's domain
                return data[0].domain;
            }
            return null;
        } catch (error) {
            return null;
        }
    },

    /**
     * Legacy Fallback URL helper
     */
    getFallbackUrl(companyName: string): string {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random&color=fff`;
    }
};
