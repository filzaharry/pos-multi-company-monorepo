export const BACKEND_URL = process.env.API_URL || 'http://localhost:8080/api/v1';

export const apiHandler = async <T>(serviceCall: (baseUrl: string) => Promise<Response>): Promise<T> => {
    try {
        const response = await serviceCall(BACKEND_URL);

        // Handle non-2xx responses
        if (!response.ok) {
            throw new Error(`Backend Error: ${response.status} ${response.statusText}`);
        }

        // Handle case where backend returns empty or non-JSON response safely
        const text = await response.text();
        if (!text) {
            return {} as T;
        }

        try {
            return JSON.parse(text) as T;
        } catch (e) {
            throw new Error('Invalid JSON response from backend');
        }
    } catch (error: unknown) {
        console.error('API Service Error:', error);
        throw error; // Let the Next.js Route Handler catch and format it
    }
};
