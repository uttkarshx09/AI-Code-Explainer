import { explainCode } from '../lib/explainCode';

export async function explainCodeAction(previousState, formData) {
    const code = String(formData.get('code') || '');
    const language = String(formData.get('language') || '');

    if (!code.trim()) {
        return {
            ...previousState,
            status: 'error',
            error: 'Paste a code snippet before explaining it.',
            result: null,
        };
    }

    try {
        const result = await explainCode({ code, language });

        return {
            status: 'success',
            error: '',
            result,
        };
    } catch (error) {
        return {
            ...previousState,
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to explain code.',
        };
    }
}