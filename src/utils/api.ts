import axios from 'axios';
import { GeminiResponse } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.0-flash';

// Create a reusable axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateContent = async (prompt: string): Promise<GeminiResponse> => {
  try {
    if (!API_KEY) {
      throw new Error('API key is not configured');
    }

    const response = await api.post(
      `/${MODEL}:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    return {
      text: response.data.candidates[0].content.parts[0].text,
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const generateTutorResponse = async (question: string): Promise<GeminiResponse> => {
  const prompt = `As a helpful personal tutor, please answer the following question in a clear and educational way: ${question}`;
  return generateContent(prompt);
};

export const summarizeLecture = async (lectureContent: string): Promise<GeminiResponse> => {
  const prompt = `Summarize the following lecture notes in a structured format with bullet points, headings, and key concepts highlighted: ${lectureContent}`;
  return generateContent(prompt);
};

export const generateEssay = async (topic: string): Promise<GeminiResponse> => {
  const prompt = `Write a well-structured essay on the following topic: ${topic}`;
  return generateContent(prompt);
};

export const generateQuestions = async (content: string): Promise<GeminiResponse> => {
  const prompt = `Based on the following content, generate 5 study questions with answers that would be useful for exam preparation: ${content}`;
  return generateContent(prompt);
};

export const generateStudyPlan = async (topic: string): Promise<GeminiResponse> => {
  const prompt = `Create a detailed study plan for the following topic. Include a breakdown by days or weeks, key concepts to cover, recommended resources, and tips for effective learning:\n\nTopic: ${topic}`;
  return generateContent(prompt);
};