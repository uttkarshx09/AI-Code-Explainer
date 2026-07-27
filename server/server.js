import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const port = Number(process.env.PORT || 3001);
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
const apiBaseUrl = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");

app.use(helmet());
app.use(
    cors({
        origin: allowedOrigin,
        credentials: true,
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes.",
});

app.use(limiter);
app.use(express.json({ limit: "10mb" }));

const demoResponse = (code, language) => {
    const trimmedCode = code.trim();
    const keywordHints = [];

    if (/async|await|fetch\(/i.test(trimmedCode)) keywordHints.push("It handles an async operation and waits for a result before continuing.");
    if (/for\s*\(|\.map\(|\.filter\(|\.reduce\(/.test(trimmedCode)) keywordHints.push("It loops through data and transforms it into a new shape.");
    if (/if\s*\(|switch\s*\(/.test(trimmedCode)) keywordHints.push("It uses branching logic to choose different paths.");
    if (/function\s|=>/.test(trimmedCode)) keywordHints.push("It groups reusable behavior into a function.");
    if (/class\s/.test(trimmedCode)) keywordHints.push("It defines a class, which bundles data and behavior together.");

    return {
        summary: `This is a ${language || "code"} snippet with ${trimmedCode.split(/\n/).length} line(s).`,
        explanation:
            "The server is in demo mode because no LLM key is configured. Add OPENAI_API_KEY to enable live explanations. " +
            "The snippet is being treated as a sequence of steps that can be described in simple terms for beginners.",
        keyPoints: keywordHints.length > 0 ? keywordHints : ["It has a clear input/output flow.", "It can be explained step by step."],
        complexity: "Beginner friendly",
        improvementIdeas: ["Add comments for the most important steps.", "Break large functions into smaller pieces."],
        mode: "demo",
    };
};

const parseModelResponse = (content, code, language) => {
    if (!content) {
        return demoResponse(code, language);
    }

    try {
        const parsed = JSON.parse(content);

        return {
            summary: parsed.summary || "Code explanation",
            explanation: parsed.explanation || content,
            keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
            complexity: parsed.complexity || "Unknown",
            improvementIdeas: Array.isArray(parsed.improvementIdeas) ? parsed.improvementIdeas : [],
            mode: "llm",
        };
    } catch {
        return {
            summary: "Code explanation",
            explanation: content,
            keyPoints: [],
            complexity: "Unknown",
            improvementIdeas: [],
            mode: "llm",
        };
    }
};

const buildPrompt = (code, language) => `
You are an expert programming tutor.
Explain the following ${language || "code"} snippet for a beginner.
Return ONLY valid JSON with these keys:
- summary: short 1 sentence overview
- explanation: friendly paragraph in plain English
- keyPoints: array of 3 to 5 short bullet-like strings
- complexity: one of "Beginner friendly", "Intermediate", or "Advanced"
- improvementIdeas: array of practical suggestions

Code:
${code}
`;

app.get("/api/health", (request, response) => {
    response.json({ ok: true, service: "ai-code-explainer-api" });
});

app.post("/api/explain", async (request, response, next) => {
    try {
        const { code = "", language = "", tone = "beginner-friendly" } = request.body || {};

        if (typeof code !== "string" || code.trim().length === 0) {
            return response.status(400).json({ message: "Code is required." });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return response.json(demoResponse(code, language));
        }

        const completionResponse = await fetch(`${apiBaseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: modelName,
                temperature: 0.2,
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a patient senior engineer who explains code clearly to beginners. " +
                            "Be concise, accurate, and practical.",
                    },
                    {
                        role: "user",
                        content: buildPrompt(code, `${language}${tone ? ` (${tone})` : ""}`),
                    },
                ],
            }),
        });

        if (!completionResponse.ok) {
            const errorText = await completionResponse.text();
            throw new Error(`LLM request failed with status ${completionResponse.status}: ${errorText}`);
        }

        const payload = await completionResponse.json();
        const content = payload?.choices?.[0]?.message?.content || "";

        response.json(parseModelResponse(content, code, language));
    } catch (error) {
        next(error);
    }
});

app.use((error, request, response, next) => {
    if (response.headersSent) {
        return next(error);
    }

    console.error(error);
    response.status(500).json({
        message: "Failed to explain code.",
        detail: error instanceof Error ? error.message : "Unknown server error",
    });
});

app.listen(port, () => {
    console.log(`AI Code Explainer API running on http://localhost:${port}`);
});
