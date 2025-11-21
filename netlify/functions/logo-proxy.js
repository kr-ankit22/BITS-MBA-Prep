export async function handler(event) {
    const domain = event.queryStringParameters?.domain;

    if (!domain) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Domain parameter is required' })
        };
    }

    try {
        const logoUrl = `https://logo.clearbit.com/${domain}`;
        const response = await fetch(logoUrl);

        if (!response.ok) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Logo not found' })
            };
        }

        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const contentType = response.headers.get('content-type') || 'image/png';

        return {
            statusCode: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
            },
            body: base64Image,
            isBase64Encoded: true
        };
    } catch (error) {
        console.error('Error fetching logo:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch logo' })
        };
    }
}
