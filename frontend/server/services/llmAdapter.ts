import { GoogleGenerativeAI } from "@google/generative-ai";
import { llmConfig } from "../config/llm.config";
import { llmCache } from "./llmCache";
import { llmMetrics } from "./llmMetrics";

/**
 * Standardized response format across all LLM providers
 */
export interface LLMResponse<T = any> {
  success: boolean;
  data: T;
  confidence: number; // 0-100
  model: string;
  latency: number; // milliseconds
  cached: boolean;
  error?: string;
  provider: string;
  tokens?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
}

/**
 * Configuration for LLM requests
 */
export interface LLMRequestConfig {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  responseFormat?: "text" | "json";
  schema?: any;
  cacheTTL?: number; // seconds, 0 to disable caching
  retryCount?: number;
  timeout?: number; // milliseconds
}

/**
 * Abstract base class for LLM providers
 */
export abstract class LLMAdapter {
  protected model: string;
  protected provider: string;
  
  constructor(model: string, provider: string) {
    this.model = model;
    this.provider = provider;
  }

  /**
   * Generate text completion
   */
  abstract generateText(
    prompt: string,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<string>>;

  /**
   * Generate JSON response
   */
  abstract generateJSON(
    prompt: string,
    schema: any,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<any>>;

  /**
   * Calculate confidence score based on response characteristics
   */
  protected calculateConfidence(response: any): number {
    // Default implementation - can be overridden by specific adapters
    // Factors to consider:
    // - Response completeness
    // - Token usage (if available)
    // - Response structure validity
    // - Model-specific confidence signals
    return 85; // Default moderate-high confidence
  }

  /**
   * Wrap with caching and metrics
   */
  protected async wrapWithMiddleware<T>(
    operation: () => Promise<T>,
    cacheKey?: string,
    cacheTTL?: number,
    operationName?: string
  ): Promise<LLMResponse<T>> {
    const startTime = Date.now();
    
    // Check cache if enabled
    if (cacheKey && cacheTTL && cacheTTL > 0) {
      const cached = await llmCache.get(cacheKey);
      if (cached) {
        const latency = Date.now() - startTime;
        llmMetrics.recordRequest(
          this.provider,
          this.model,
          operationName || "unknown",
          latency,
          true,
          true
        );
        return {
          success: true,
          data: cached as T,
          confidence: 100, // Cached responses have high confidence
          model: this.model,
          latency,
          cached: true,
          provider: this.provider,
        };
      }
    }

    try {
      const result = await operation();
      const latency = Date.now() - startTime;

      // Cache if enabled
      if (cacheKey && cacheTTL && cacheTTL > 0) {
        await llmCache.set(cacheKey, result, cacheTTL);
      }

      // Record metrics
      llmMetrics.recordRequest(
        this.provider,
        this.model,
        operationName || "unknown",
        latency,
        true,
        false
      );

      return {
        success: true,
        data: result,
        confidence: this.calculateConfidence(result),
        model: this.model,
        latency,
        cached: false,
        provider: this.provider,
      };
    } catch (error: any) {
      const latency = Date.now() - startTime;
      
      // Record failure metrics
      llmMetrics.recordRequest(
        this.provider,
        this.model,
        operationName || "unknown",
        latency,
        false,
        false
      );

      return {
        success: false,
        data: null as any,
        confidence: 0,
        model: this.model,
        latency,
        cached: false,
        error: error.message || "Unknown error",
        provider: this.provider,
      };
    }
  }
}

/**
 * Gemini Adapter Implementation
 */
export class GeminiAdapter extends LLMAdapter {
  private client: GoogleGenerativeAI;

  constructor(apiKey: string, model: string = "gemini-2.0-flash-exp") {
    super(model, "gemini");
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateText(
    prompt: string,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<string>> {
    const cacheKey = llmCache.generateKey("gemini-text", prompt, config);
    const cacheTTL = config?.cacheTTL ?? llmConfig.defaultCacheTTL;

    return this.wrapWithMiddleware(
      async () => {
        const model = this.client.getGenerativeModel({ model: this.model });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: config?.temperature ?? llmConfig.defaultTemperature,
            maxOutputTokens: config?.maxTokens,
            topP: config?.topP,
            topK: config?.topK,
            stopSequences: config?.stopSequences,
          },
        });

        const response = await result.response;
        return response.text() || "";
      },
      cacheKey,
      cacheTTL,
      "generateText"
    );
  }

  async generateJSON(
    prompt: string,
    schema: any,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<any>> {
    const cacheKey = llmCache.generateKey("gemini-json", prompt, { schema, ...config });
    const cacheTTL = config?.cacheTTL ?? llmConfig.defaultCacheTTL;

    return this.wrapWithMiddleware(
      async () => {
        const model = this.client.getGenerativeModel({ 
          model: this.model,
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
          }
        });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: config?.temperature ?? llmConfig.defaultTemperature,
            maxOutputTokens: config?.maxTokens,
            topP: config?.topP,
            topK: config?.topK,
            stopSequences: config?.stopSequences,
          },
        });

        const response = await result.response;
        const jsonText = response.text() || "{}";
        return JSON.parse(jsonText);
      },
      cacheKey,
      cacheTTL,
      "generateJSON"
    );
  }

  protected calculateConfidence(response: any): number {
    // Gemini-specific confidence calculation
    if (!response) return 0;
    
    // For JSON responses, check structure completeness
    if (typeof response === 'object') {
      const keys = Object.keys(response);
      const nonEmptyValues = keys.filter(k => 
        response[k] !== null && 
        response[k] !== undefined && 
        response[k] !== ""
      );
      const completeness = (nonEmptyValues.length / Math.max(keys.length, 1)) * 100;
      
      // If response has confidence field, use it
      if (response.confidence?.overall) {
        const confidenceMap = { high: 95, medium: 75, low: 50 };
        return confidenceMap[response.confidence.overall as keyof typeof confidenceMap] || completeness;
      }
      
      return Math.min(completeness, 95);
    }
    
    // For text responses, check length and quality
    if (typeof response === 'string') {
      if (response.length < 10) return 50;
      if (response.length < 100) return 70;
      return 85;
    }
    
    return 75; // Default moderate confidence
  }
}

/**
 * Mock Adapter for Testing
 */
export class MockAdapter extends LLMAdapter {
  private mockResponses: Map<string, any> = new Map();
  private defaultDelay: number = 100; // ms

  constructor() {
    super("mock-model", "mock");
    this.setupDefaultMocks();
  }

  private setupDefaultMocks() {
    // Setup common mock responses
    this.mockResponses.set("resume-parse", {
      personalInfo: {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1-234-567-8900",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johndoe",
        website: "johndoe.com",
        summary: "Experienced software engineer with 5+ years in full-stack development."
      },
      experience: [
        {
          id: "exp-1",
          company: "Tech Corp",
          position: "Senior Software Engineer",
          startDate: "2020-01",
          endDate: "",
          current: true,
          description: "Leading development of cloud-native applications."
        }
      ],
      education: [
        {
          id: "edu-1",
          institution: "Stanford University",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2015-09",
          endDate: "2019-06",
          current: false
        }
      ],
      skills: ["JavaScript", "React", "Node.js", "AWS", "Docker", "PostgreSQL"],
      confidence: {
        overall: "high",
        fields: {
          fullName: "high",
          email: "high",
          phone: "high",
          location: "high",
          linkedin: "high",
          website: "high",
          summary: "high",
          experience: "high",
          education: "high",
          skills: "high"
        }
      }
    });

    this.mockResponses.set("cover-letter", 
      "Dear Hiring Manager,\n\n" +
      "I am writing to express my interest in the Software Engineer position at your company. " +
      "With my extensive experience in full-stack development and passion for creating innovative solutions, " +
      "I am confident I would be a valuable addition to your team.\n\n" +
      "I look forward to discussing how my skills can contribute to your organization's success.\n\n" +
      "Sincerely,\nJohn Doe"
    );

    this.mockResponses.set("job-match", { matchScore: 85 });
  }

  setMockResponse(key: string, response: any) {
    this.mockResponses.set(key, response);
  }

  async generateText(
    prompt: string,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<string>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.defaultDelay));

    const mockKey = this.extractMockKey(prompt);
    const response = this.mockResponses.get(mockKey) || 
      `Mock response for: ${prompt.substring(0, 50)}...`;

    return {
      success: true,
      data: typeof response === 'string' ? response : JSON.stringify(response),
      confidence: 95,
      model: this.model,
      latency: this.defaultDelay,
      cached: false,
      provider: this.provider,
      tokens: {
        prompt: prompt.length / 4, // Rough estimation
        completion: response.length / 4,
        total: (prompt.length + response.length) / 4
      }
    };
  }

  async generateJSON(
    prompt: string,
    schema: any,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<any>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.defaultDelay));

    const mockKey = this.extractMockKey(prompt);
    const response = this.mockResponses.get(mockKey) || 
      this.generateMockFromSchema(schema);

    return {
      success: true,
      data: response,
      confidence: 95,
      model: this.model,
      latency: this.defaultDelay,
      cached: false,
      provider: this.provider,
      tokens: {
        prompt: prompt.length / 4,
        completion: JSON.stringify(response).length / 4,
        total: (prompt.length + JSON.stringify(response).length) / 4
      }
    };
  }

  private extractMockKey(prompt: string): string {
    // Extract key based on prompt content
    if (prompt.includes("resume") && prompt.includes("parse")) return "resume-parse";
    if (prompt.includes("cover letter")) return "cover-letter";
    if (prompt.includes("job match")) return "job-match";
    return "default";
  }

  private generateMockFromSchema(schema: any): any {
    // Generate mock data based on schema
    if (!schema || typeof schema !== 'object') return {};
    
    const result: any = {};
    
    if (schema.type === 'object' && schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties as any)) {
        result[key] = this.generateMockValue(prop);
      }
    }
    
    return result;
  }

  private generateMockValue(prop: any): any {
    switch (prop.type) {
      case 'string':
        return 'mock-string';
      case 'number':
        return 42;
      case 'boolean':
        return true;
      case 'array':
        return ['item1', 'item2'];
      case 'object':
        return this.generateMockFromSchema(prop);
      default:
        return null;
    }
  }
}

/**
 * OpenAI Adapter (Stub for future implementation)
 */
export class OpenAIAdapter extends LLMAdapter {
  private apiKey: string;

  constructor(apiKey: string, model: string = "gpt-4-turbo-preview") {
    super(model, "openai");
    this.apiKey = apiKey;
  }

  async generateText(
    prompt: string,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<string>> {
    // TODO: Implement OpenAI API integration
    throw new Error("OpenAI adapter not yet implemented");
  }

  async generateJSON(
    prompt: string,
    schema: any,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<any>> {
    // TODO: Implement OpenAI API integration
    throw new Error("OpenAI adapter not yet implemented");
  }
}

/**
 * Claude Adapter (Stub for future implementation)
 */
export class ClaudeAdapter extends LLMAdapter {
  private apiKey: string;

  constructor(apiKey: string, model: string = "claude-3-opus-20240229") {
    super(model, "claude");
    this.apiKey = apiKey;
  }

  async generateText(
    prompt: string,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<string>> {
    // TODO: Implement Anthropic Claude API integration
    throw new Error("Claude adapter not yet implemented");
  }

  async generateJSON(
    prompt: string,
    schema: any,
    config?: LLMRequestConfig
  ): Promise<LLMResponse<any>> {
    // TODO: Implement Anthropic Claude API integration
    throw new Error("Claude adapter not yet implemented");
  }
}

/**
 * Factory class to create LLM adapters
 */
export class LLMFactory {
  private static instances: Map<string, LLMAdapter> = new Map();

  static createAdapter(
    provider: "gemini" | "openai" | "claude" | "mock",
    apiKey?: string,
    model?: string
  ): LLMAdapter {
    const key = `${provider}-${model || 'default'}`;
    
    // Return cached instance if exists
    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    let adapter: LLMAdapter;

    switch (provider) {
      case "gemini":
        adapter = new GeminiAdapter(apiKey || process.env.GEMINI_API_KEY || "", model);
        break;
      case "openai":
        adapter = new OpenAIAdapter(apiKey || process.env.OPENAI_API_KEY || "", model);
        break;
      case "claude":
        adapter = new ClaudeAdapter(apiKey || process.env.CLAUDE_API_KEY || "", model);
        break;
      case "mock":
        adapter = new MockAdapter();
        break;
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }

    this.instances.set(key, adapter);
    return adapter;
  }

  static getDefaultAdapter(): LLMAdapter {
    const provider = llmConfig.defaultProvider;
    const model = llmConfig.models[provider as keyof typeof llmConfig.models];
    return this.createAdapter(provider, undefined, model);
  }

  static clearInstances() {
    this.instances.clear();
  }
}