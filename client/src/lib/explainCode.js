const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function explainCode(payload) {
    const endpoint = baseUrl ? `${baseUrl}/api/explain` : '/api/explain';

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || 'Failed to explain code.');
    }

    return data;
}