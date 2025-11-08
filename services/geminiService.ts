import { GoogleGenAI, Type, Chat } from "@google/genai";
import { IELTSLevel, VocabularyWord, Test, WordExplanation, SpeakingFeedback, TranscriptItem, LeaderboardEntry, PronunciationFeedback } from '../types';
import { placementTest } from '../data/staticData';
import { shuffle } from "../utils/array";

if (!process.env.API_KEY) {
  // In a real production app, you'd want to handle this more gracefully, 
  // perhaps disabling API-dependent features.
  throw new Error("API_KEY environment variable not set.");
}
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Static Functions (No API Call) ---

export const generatePlacementTest = async (): Promise<Test> => {
    return Promise.resolve(placementTest);
};

export const evaluatePlacementTest = async (test: Test, userAnswers: (string | null)[]): Promise<IELTSLevel> => {
    let score = 0;
    const allQuestions = [...test.mcqs, ...test.fillInTheBlanks];
    userAnswers.slice(0, allQuestions.length).forEach((answer, index) => {
        if (answer && answer.toLowerCase() === allQuestions[index].correctAnswer.toLowerCase()) {
            score++;
        }
    });
    
    const percentage = score / allQuestions.length;
    if (percentage <= 0.3) return 'Band 5.0-5.5';
    if (percentage <= 0.6) return 'Band 6.0-6.5';
    if (percentage <= 0.8) return 'Band 7.0-7.5';
    return 'Band 8.0+';
};


// --- API-Powered Functions ---

/**
 * Generates an image for a given prompt using Imagen 2.
 */
export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A clear, high-quality, educational illustration for the IELTS vocabulary concept: "${prompt}". Minimalist, symbolic, and focused on the word's meaning.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
        if (!imageBytes) {
            throw new Error("Image generation failed to return a valid image.");
        }
        return `data:image/jpeg;base64,${imageBytes}`;

    } catch (error) {
        console.error("Error generating image:", error);
        // Return a placeholder or throw a more specific error
        throw new Error(`Không thể tạo hình ảnh cho: "${prompt}".`);
    }
};

/**
 * Generates a list of suggested topics for a given IELTS level.
 */
export const fetchTopics = async (level: IELTSLevel): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a list of 5 diverse and interesting IELTS vocabulary topics suitable for a student at the ${level} level.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topics: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const responseText = response.text;
        if (responseText) {
            const result = JSON.parse(responseText);
            return result.topics || [];
        } else {
            throw new Error("API returned an empty response for topics.");
        }
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw new Error("Không thể tạo danh sách chủ đề. Vui lòng thử lại.");
    }
};

/**
 * Generates a vocabulary list for a given level and topic using the Gemini API.
 */
export const fetchVocabulary = async (level: IELTSLevel, topic: string): Promise<VocabularyWord[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a list of 10 essential IELTS vocabulary words for the topic "${topic}" suitable for a ${level} student. For each word, provide: word, phonetic (IPA), type (e.g., noun, verb), definition (in English), example (in English), definition_vi (a concise Vietnamese definition), and example_vi (a Vietnamese translation of the example).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        vocabulary: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    word: { type: Type.STRING },
                                    phonetic: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    definition: { type: Type.STRING },
                                    example: { type: Type.STRING },
                                    definition_vi: { type: Type.STRING },
                                    example_vi: { type: Type.STRING },
                                },
                                required: ["word", "phonetic", "type", "definition", "example", "definition_vi", "example_vi"]
                            }
                        }
                    }
                }
            }
        });
        const responseText = response.text;
        if (responseText) {
            const result = JSON.parse(responseText);
            if (!result.vocabulary || result.vocabulary.length === 0) {
                throw new Error("API returned no vocabulary.");
            }
            return result.vocabulary;
        } else {
            throw new Error("API returned an empty response for vocabulary.");
        }
    } catch (error) {
        console.error("Error fetching vocabulary:", error);
        throw new Error(`Không thể tạo từ vựng cho chủ đề "${topic}". Vui lòng thử lại.`);
    }
};

/**
 * Generates a test based on a provided vocabulary list using the Gemini API.
 */
export const generateTest = async (vocabulary: VocabularyWord[]): Promise<Test> => {
    if (vocabulary.length < 4) {
        throw new Error("Không đủ từ vựng để tạo bài test (cần ít nhất 4 từ).");
    }

    try {
        const wordList = vocabulary.map(v => v.word).join(', ');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based ONLY on the following vocabulary words: ${wordList}. Here is the full data: ${JSON.stringify(vocabulary)}.
            Create a test with exactly:
            1. Four (4) multiple-choice questions (mcqs). Each question uses a definition as the prompt and the correct word as the answer. Provide three other plausible but incorrect word options from the list.
            2. Four (4) fill-in-the-blank questions (fillInTheBlanks). Use the example sentence from the data and replace the word with '___'.
            3. Four (4) word-definition matching pairs (matchingPairs).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        mcqs: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    correctAnswer: { type: Type.STRING }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        },
                        fillInTheBlanks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    sentence: { type: Type.STRING },
                                    correctAnswer: { type: Type.STRING }
                                },
                                required: ["sentence", "correctAnswer"]
                            }
                        },
                        matchingPairs: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    word: { type: Type.STRING },
                                    definition: { type: Type.STRING }
                                },
                                required: ["word", "definition"]
                            }
                        }
                    },
                    required: ["mcqs", "fillInTheBlanks", "matchingPairs"]
                }
            }
        });
        
        const responseText = response.text;
        if (responseText) {
            const test = JSON.parse(responseText);
            // Basic validation
            if (!test.mcqs || !test.fillInTheBlanks || !test.matchingPairs) {
                throw new Error("Generated test is missing required fields.");
            }

            // Shuffle options for mcqs to ensure randomness
            test.mcqs.forEach((mcq: any) => {
                mcq.options = shuffle(mcq.options);
            });

            return test;
        } else {
            throw new Error("API returned an empty response for the test.");
        }
    } catch (error) {
        console.error("Error generating test:", error);
        throw new Error("Không thể tạo bài kiểm tra. Vui lòng thử lại.");
    }
};

/**
 * Generates a detailed explanation for a word using the Gemini API.
 */
export const fetchWordExplanation = async (word: VocabularyWord): Promise<WordExplanation> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a detailed explanation for the English word "${word.word}". The user is an IELTS student. Include:
            1.  synonyms: A list of 2-3 relevant synonyms.
            2.  antonyms: A list of 1-2 relevant antonyms.
            3.  collocations: 2-3 common collocations (e.g., "verb + ${word.word}", "${word.word} + noun").
            4.  detailedExplanation: A deeper explanation of its nuance, usage, or connotation in a few sentences. Explain in Vietnamese.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                        antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                        collocations: { type: Type.ARRAY, items: { type: Type.STRING } },
                        detailedExplanation: { type: Type.STRING }
                    },
                    required: ["synonyms", "antonyms", "collocations", "detailedExplanation"]
                }
            }
        });
        const responseText = response.text;
        if (responseText) {
            return JSON.parse(responseText);
        } else {
            throw new Error("API returned an empty response for the word explanation.");
        }
    } catch (error) {
        console.error("Error fetching word explanation:", error);
        throw new Error(`Không thể tạo giải thích cho từ "${word.word}". Vui lòng thử lại.`);
    }
};

/**
 * Analyzes a user's pronunciation of a word.
 */
export const fetchPronunciationAnalysis = async (word: VocabularyWord, userTranscript: string): Promise<PronunciationFeedback> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `As an expert IELTS pronunciation coach for a Vietnamese learner, analyze the user's pronunciation attempt.
            - Target word: "${word.word}"
            - Phonetic (IPA): ${word.phonetic}
            - User's transcribed attempt: "${userTranscript}"

            Analyze the transcript. 
            - If the transcript perfectly matches the target word, set 'isCorrect' to true and provide positive feedback.
            - If the transcript is close but not perfect (e.g., 'ubikitus' for 'ubiquitous'), identify the specific phonetic error.
            - If the transcript is completely wrong, state that.
            
            Provide your analysis in a structured JSON format.
            - 'isCorrect': A boolean. True only for a perfect match.
            - 'feedback': A short, encouraging feedback sentence in English.
            - 'tip': A concise, actionable tip in Vietnamese to help the user improve. If correct, this can be an empty string.
            - 'transcript': The user's transcribed attempt.
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: { type: Type.BOOLEAN },
                        feedback: { type: Type.STRING },
                        tip: { type: Type.STRING },
                        transcript: { type: Type.STRING },
                    },
                    required: ["isCorrect", "feedback", "tip", "transcript"]
                }
            }
        });
        const responseText = response.text;
        if (responseText) {
            const result = JSON.parse(responseText);
            // Ensure the transcript from the prompt is passed through
            result.transcript = userTranscript;
            return result;
        } else {
            throw new Error("API returned an empty response for pronunciation analysis.");
        }
    } catch (error) {
        console.error("Error fetching pronunciation analysis:", error);
        throw new Error(`Không thể phân tích phát âm cho từ "${word.word}". Vui lòng thử lại.`);
    }
};


/**
 * Analyzes a speaking transcript and provides IELTS-style feedback.
 */
export const fetchSpeakingAnalysis = async (transcript: TranscriptItem[]): Promise<SpeakingFeedback> => {
    const formattedTranscript = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more powerful model for nuanced analysis
            contents: `As an expert IELTS examiner, analyze the following speaking test transcript. The user is a Vietnamese learner. Provide a detailed evaluation based on the official IELTS speaking criteria.
            
            Transcript:
            ---
            ${formattedTranscript}
            ---

            Provide your analysis in a structured JSON format. For each of the four criteria (Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation), provide a band score (e.g., 6.5) and concise, constructive feedback in Vietnamese. Also, provide an overall band score.

            Include a 'speakingWeakPoints' object containing two arrays:
            1. 'vocabulary': A list of specific words the user misused or could improve.
            2. 'grammar': A list of specific grammatical error types observed (e.g., "Subject-verb agreement", "Incorrect tense").

            Finally, provide a 'suggestions' array with 3-4 concrete, actionable suggestions for the student to improve, written in Vietnamese.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallBandScore: { type: Type.NUMBER },
                        fluencyAndCoherence: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.NUMBER },
                                feedback: { type: Type.STRING }
                            },
                            required: ["score", "feedback"]
                        },
                        lexicalResource: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.NUMBER },
                                feedback: { type: Type.STRING }
                            },
                             required: ["score", "feedback"]
                        },
                        grammaticalRangeAndAccuracy: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.NUMBER },
                                feedback: { type: Type.STRING }
                            },
                             required: ["score", "feedback"]
                        },
                        pronunciation: {
                            type: Type.OBJECT,
                            properties: {
                                score: { type: Type.NUMBER },
                                feedback: { type: Type.STRING }
                            },
                             required: ["score", "feedback"]
                        },
                        speakingWeakPoints: {
                            type: Type.OBJECT,
                            properties: {
                                vocabulary: { type: Type.ARRAY, items: { type: Type.STRING } },
                                grammar: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ["vocabulary", "grammar"]
                        },
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Actionable suggestions for improvement."
                        }
                    },
                    required: ["overallBandScore", "fluencyAndCoherence", "lexicalResource", "grammaticalRangeAndAccuracy", "pronunciation", "speakingWeakPoints", "suggestions"]
                }
            }
        });
        const responseText = response.text;
        if (responseText) {
            return JSON.parse(responseText);
        } else {
            throw new Error("API returned an empty response for speaking analysis.");
        }
    } catch (error) {
        console.error("Error fetching speaking analysis:", error);
        throw new Error("Không thể phân tích phần trình bày của bạn. Vui lòng thử lại.");
    }
};

/**
 * Fetches full details for a list of words.
 */
export const fetchWordDetails = async (words: string[]): Promise<VocabularyWord[]> => {
    if (words.length === 0) return [];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `For the following list of English words: [${words.join(', ')}], provide a complete vocabulary entry for each. For each word, provide: word, phonetic (IPA), type (e.g., noun, verb), definition (in English), example (in English), definition_vi (a concise Vietnamese definition), and example_vi (a Vietnamese translation of the example).`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        vocabulary: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    word: { type: Type.STRING },
                                    phonetic: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                    definition: { type: Type.STRING },
                                    example: { type: Type.STRING },
                                    definition_vi: { type: Type.STRING },
                                    example_vi: { type: Type.STRING },
                                },
                                required: ["word", "phonetic", "type", "definition", "example", "definition_vi", "example_vi"]
                            }
                        }
                    }
                }
            }
        });
        const responseText = response.text;
        if (responseText) {
            const result = JSON.parse(responseText);
            if (!result.vocabulary) {
                throw new Error("API returned no vocabulary details.");
            }
            return result.vocabulary;
        } else {
            throw new Error("API returned an empty response for word details.");
        }
    } catch (error) {
        console.error("Error fetching word details:", error);
        throw new Error(`Không thể lấy chi tiết từ. Vui lòng thử lại.`);
    }
};

/**
 * Fetches a mock leaderboard.
 */
export const fetchLeaderboardData = async (currentUserScore: number): Promise<LeaderboardEntry[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a list of 10 diverse, fictional Vietnamese names for a leaderboard.',
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        names: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        const responseText = response.text;
        if (responseText) {
            const result = JSON.parse(responseText);
            const names = result.names || [];

            const leaderboard: Omit<LeaderboardEntry, 'rank'>[] = names.map((name: string) => {
                // Generate scores clustered around the user's score for a more "realistic" feel
                const scoreVariation = (Math.random() - 0.5) * 300; // variance of +/- 150
                const score = Math.max(0, Math.min(Math.round(currentUserScore + scoreVariation), 1000));
                return { name, fluencyScore: score };
            });

            // Add current user
            leaderboard.push({ name: "Bạn", fluencyScore: currentUserScore, isCurrentUser: true });

            // Sort by score and add rank
            const sortedLeaderboard = leaderboard
                .sort((a, b) => b.fluencyScore - a.fluencyScore)
                .map((entry, index) => ({
                    ...entry,
                    rank: index + 1,
                }));

            return sortedLeaderboard;
        } else {
             throw new Error("API returned an empty response for leaderboard data.");
        }
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        throw new Error("Không thể tải bảng xếp hạng. Vui lòng thử lại.");
    }
};

/**
 * Creates a new chat session with the AI Tutor.
 */
export const createTutorChatSession = (): Chat => {
    const chat: Chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are an expert IELTS tutor, named "Gemini Tutor". You are friendly and encouraging. Your student is a Vietnamese learner. Keep your explanations concise, clear, and easy to understand. Use Vietnamese for explanations ONLY when it helps clarify a difficult concept, but primarily communicate in English to encourage immersion. Your goal is to help them improve their vocabulary and grammar for the IELTS test.',
        },
    });
    return chat;
};