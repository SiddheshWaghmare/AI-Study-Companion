// Mock API responses for testing without using real API calls
import { GeminiResponse } from '../types';

export const generateContent = async (prompt: string): Promise<GeminiResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    text: `This is a mock response for: "${prompt.substring(0, 50)}..."\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, nunc nisl aliquet nunc, eget aliquam nisl nunc eget nisl.`
  };
};

export const generateTutorResponse = async (question: string): Promise<GeminiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    text: `Here's an explanation for your question about "${question.substring(0, 30)}...":\n\n` +
    "## Key Concepts\n\n" +
    "* First important point to understand\n" +
    "* Second key concept with more detail\n" +
    "* Third related idea\n\n" +
    "## Example\n\n" +
    "Let me illustrate with an example:\n\n" +
    "```\n" +
    "// Code example if applicable\n" +
    "function example() {\n" +
    "  return 'This demonstrates the concept';\n" +
    "}\n" +
    "```\n\n" +
    "Is there anything specific about this topic you'd like me to clarify further?"
  };
};

export const summarizeLecture = async (lectureContent: string): Promise<GeminiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    text: `# Summary of Lecture\n\n` +
    `## Introduction\n\n` +
    `* The lecture covered key concepts in ${lectureContent.length > 30 ? lectureContent.substring(0, 30) + '...' : lectureContent}\n` +
    `* Important historical context was provided\n` +
    `* The main theory was introduced\n\n` +
    `## Key Points\n\n` +
    `1. First major concept with explanation\n` +
    `2. Second important idea that builds on the first\n` +
    `3. Third concept that completes the framework\n\n` +
    `## Applications\n\n` +
    `* Practical use case #1\n` +
    `* Real-world example #2\n` +
    `* Industry implementation\n\n` +
    `## Conclusion\n\n` +
    `The lecture demonstrated how these concepts work together to form a comprehensive understanding of the subject.`
  };
};

export const generateEssay = async (topic: string): Promise<GeminiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    text: `# ${topic}\n\n` +
    `## Introduction\n\n` +
    `This essay explores the topic of ${topic}. It is a subject of great importance in today's world for several reasons. First, it impacts how we understand modern challenges. Second, it provides a framework for analyzing complex issues. Finally, it helps us develop solutions to pressing problems.\n\n` +
    `## Background\n\n` +
    `The historical context of this topic dates back to early developments in the field. Several key figures contributed to our understanding, including prominent researchers and theorists. Their work established the foundation for current perspectives.\n\n` +
    `## Main Arguments\n\n` +
    `### First Point\n\n` +
    `The first major consideration is the impact on society. Research by Smith (2018) demonstrates significant effects on community structures. This has implications for policy development and implementation.\n\n` +
    `### Second Point\n\n` +
    `Another critical aspect is the economic dimension. According to economic analyses by Johnson (2020), there are measurable outcomes in various sectors. This challenges traditional views of market dynamics.\n\n` +
    `### Third Point\n\n` +
    `The ethical considerations cannot be overlooked. As Wong (2019) argues, there are important moral questions that must be addressed. These considerations should inform our approach.\n\n` +
    `## Conclusion\n\n` +
    `In summary, this essay has explored the multifaceted nature of ${topic}. The evidence suggests that a comprehensive approach is necessary. Future research should focus on developing integrated frameworks that address all dimensions of this important subject.\n\n` +
    `## References\n\n` +
    `* Johnson, A. (2020). Economic Implications of Modern Challenges. Journal of Economic Studies, 45(3), 112-128.\n` +
    `* Smith, B. (2018). Social Structures in Contemporary Society. Oxford University Press.\n` +
    `* Wong, C. (2019). Ethical Dimensions of Policy Decisions. Ethics Quarterly, 29(2), 78-92.`
  };
};

export const generateQuestions = async (content: string): Promise<GeminiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    text: `# Study Questions\n\n` +
    `## Multiple Choice\n\n` +
    `1. What is the primary focus of the content discussed?\n` +
    `   A) Historical development\n` +
    `   B) Theoretical frameworks\n` +
    `   C) Practical applications\n` +
    `   D) Future implications\n\n` +
    `   **Answer: B) Theoretical frameworks**\n\n` +
    `2. Which concept is most closely associated with the main theory?\n` +
    `   A) Concept A\n` +
    `   B) Concept B\n` +
    `   C) Concept C\n` +
    `   D) Concept D\n\n` +
    `   **Answer: A) Concept A**\n\n` +
    `## Short Answer\n\n` +
    `3. Explain the relationship between the two key principles discussed in the material.\n\n` +
    `   **Answer: The two key principles have a complementary relationship where the first establishes the theoretical foundation and the second provides the practical framework for application.**\n\n` +
    `4. What are the three main components of the central framework?\n\n` +
    `   **Answer: The three main components are the structural element, the functional element, and the integrative element.**\n\n` +
    `5. How does this material relate to real-world applications in the field?\n\n` +
    `   **Answer: The material provides analytical tools that can be applied to solve practical problems in industry, research, and development contexts.**`
  };
};