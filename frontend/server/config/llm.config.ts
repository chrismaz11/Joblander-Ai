/**
 * LLM Configuration Module
 * Centralized configuration for all LLM-related settings
 */

export interface LLMConfig {
  // Provider settings
  defaultProvider: "gemini" | "openai" | "claude" | "mock";
  providers: {
    gemini: {
      enabled: boolean;
      apiKey?: string;
      baseUrl?: string;
    };
    openai: {
      enabled: boolean;
      apiKey?: string;
      baseUrl?: string;
      organization?: string;
    };
    claude: {
      enabled: boolean;
      apiKey?: string;
      baseUrl?: string;
    };
    mock: {
      enabled: boolean;
    };
  };

  // Model selection per task type
  models: {
    gemini: string;
    openai: string;
    claude: string;
  };
  
  taskModels: {
    resumeParsing: string;
    coverLetterGeneration: string;
    jobMatching: string;
    resumeEnhancement: string;
    skillsExtraction: string;
    citysuggestions: string;
    textCleaning: string;
  };

  // Default generation parameters
  defaultTemperature: number;
  defaultMaxTokens: number;
  defaultTopP: number;
  defaultTopK: number;

  // Cache settings
  cacheEnabled: boolean;
  defaultCacheTTL: number; // seconds
  maxCacheSize: number; // MB
  cacheStrategy: {
    resumeParsing: number; // 24 hours
    coverLetterGeneration: number; // 1 hour
    jobMatching: number; // 2 hours
    templateSuggestions: number; // 7 days
    skillsExtraction: number; // 24 hours
    textCleaning: number; // 1 hour
    default: number; // 1 hour
  };

  // Rate limiting
  rateLimiting: {
    enabled: boolean;
    maxRequestsPerMinute: number;
    maxRequestsPerHour: number;
    maxRequestsPerDay: number;
    burstLimit: number;
  };

  // Retry configuration
  retry: {
    maxAttempts: number;
    initialDelay: number; // ms
    maxDelay: number; // ms
    backoffFactor: number;
    retryableErrors: string[];
  };

  // Monitoring & Metrics
  monitoring: {
    enabled: boolean;
    logLevel: "debug" | "info" | "warn" | "error";
    metricsInterval: number; // seconds
    alertThresholds: {
      errorRate: number; // percentage
      latency: number; // ms
      cacheHitRate: number; // percentage (minimum expected)
    };
  };

  // Cost tracking
  costTracking: {
    enabled: boolean;
    pricePerToken: {
      gemini: { input: number; output: number };
      openai: { input: number; output: number };
      claude: { input: number; output: number };
    };
    budgetAlerts: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };

  // Timeouts
  timeouts: {
    default: number; // ms
    resumeParsing: number;
    coverLetterGeneration: number;
    jobMatching: number;
  };
}

/**
 * Default LLM Configuration
 * Can be overridden via environment variables
 */
export const llmConfig: LLMConfig = {
  // Provider settings
  defaultProvider: (process.env.LLM_PROVIDER as any) || "gemini",
  providers: {
    gemini: {
      enabled: process.env.GEMINI_ENABLED !== "false",
      apiKey: process.env.GEMINI_API_KEY,
      baseUrl: process.env.GEMINI_BASE_URL,
    },
    openai: {
      enabled: process.env.OPENAI_ENABLED === "true",
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      organization: process.env.OPENAI_ORG,
    },
    claude: {
      enabled: process.env.CLAUDE_ENABLED === "true",
      apiKey: process.env.CLAUDE_API_KEY,
      baseUrl: process.env.CLAUDE_BASE_URL || "https://api.anthropic.com",
    },
    mock: {
      enabled: process.env.NODE_ENV === "test" || process.env.MOCK_LLM === "true",
    },
  },

  // Model selection
  models: {
    gemini: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
    openai: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
    claude: process.env.CLAUDE_MODEL || "claude-3-opus-20240229",
  },

  taskModels: {
    resumeParsing: "gemini-2.0-flash-exp",
    coverLetterGeneration: "gemini-2.0-flash-exp",
    jobMatching: "gemini-2.0-flash-exp",
    resumeEnhancement: "gemini-2.0-flash-exp",
    skillsExtraction: "gemini-2.0-flash-exp",
    citysuggestions: "gemini-2.0-flash-exp",
    textCleaning: "gemini-2.0-flash-exp",
  },

  // Default generation parameters
  defaultTemperature: parseFloat(process.env.LLM_TEMPERATURE || "0.7"),
  defaultMaxTokens: parseInt(process.env.LLM_MAX_TOKENS || "4096", 10),
  defaultTopP: parseFloat(process.env.LLM_TOP_P || "0.95"),
  defaultTopK: parseInt(process.env.LLM_TOP_K || "40", 10),

  // Cache settings
  cacheEnabled: process.env.LLM_CACHE_ENABLED !== "false",
  defaultCacheTTL: parseInt(process.env.LLM_CACHE_TTL || "3600", 10), // 1 hour default
  maxCacheSize: parseInt(process.env.LLM_CACHE_MAX_SIZE || "100", 10), // 100 MB
  cacheStrategy: {
    resumeParsing: 86400, // 24 hours
    coverLetterGeneration: 3600, // 1 hour
    jobMatching: 7200, // 2 hours
    templateSuggestions: 604800, // 7 days
    skillsExtraction: 86400, // 24 hours
    textCleaning: 3600, // 1 hour
    default: 3600, // 1 hour
  },

  // Rate limiting
  rateLimiting: {
    enabled: process.env.LLM_RATE_LIMIT_ENABLED === "true",
    maxRequestsPerMinute: parseInt(process.env.LLM_RATE_LIMIT_PER_MIN || "60", 10),
    maxRequestsPerHour: parseInt(process.env.LLM_RATE_LIMIT_PER_HOUR || "1000", 10),
    maxRequestsPerDay: parseInt(process.env.LLM_RATE_LIMIT_PER_DAY || "10000", 10),
    burstLimit: parseInt(process.env.LLM_RATE_LIMIT_BURST || "10", 10),
  },

  // Retry configuration
  retry: {
    maxAttempts: parseInt(process.env.LLM_RETRY_MAX || "3", 10),
    initialDelay: parseInt(process.env.LLM_RETRY_DELAY || "1000", 10),
    maxDelay: parseInt(process.env.LLM_RETRY_MAX_DELAY || "10000", 10),
    backoffFactor: parseFloat(process.env.LLM_RETRY_BACKOFF || "2"),
    retryableErrors: [
      "RATE_LIMIT_EXCEEDED",
      "TIMEOUT",
      "NETWORK_ERROR",
      "SERVICE_UNAVAILABLE",
    ],
  },

  // Monitoring & Metrics
  monitoring: {
    enabled: process.env.LLM_MONITORING_ENABLED !== "false",
    logLevel: (process.env.LLM_LOG_LEVEL as any) || "info",
    metricsInterval: parseInt(process.env.LLM_METRICS_INTERVAL || "60", 10),
    alertThresholds: {
      errorRate: parseFloat(process.env.LLM_ALERT_ERROR_RATE || "5"), // 5%
      latency: parseInt(process.env.LLM_ALERT_LATENCY || "5000", 10), // 5s
      cacheHitRate: parseFloat(process.env.LLM_ALERT_CACHE_HIT || "30"), // 30% minimum
    },
  },

  // Cost tracking
  costTracking: {
    enabled: process.env.LLM_COST_TRACKING === "true",
    pricePerToken: {
      gemini: {
        input: parseFloat(process.env.GEMINI_PRICE_INPUT || "0.00001"),
        output: parseFloat(process.env.GEMINI_PRICE_OUTPUT || "0.00003"),
      },
      openai: {
        input: parseFloat(process.env.OPENAI_PRICE_INPUT || "0.00003"),
        output: parseFloat(process.env.OPENAI_PRICE_OUTPUT || "0.00006"),
      },
      claude: {
        input: parseFloat(process.env.CLAUDE_PRICE_INPUT || "0.00008"),
        output: parseFloat(process.env.CLAUDE_PRICE_OUTPUT || "0.00024"),
      },
    },
    budgetAlerts: {
      daily: parseFloat(process.env.LLM_BUDGET_DAILY || "10"),
      weekly: parseFloat(process.env.LLM_BUDGET_WEEKLY || "50"),
      monthly: parseFloat(process.env.LLM_BUDGET_MONTHLY || "200"),
    },
  },

  // Timeouts
  timeouts: {
    default: parseInt(process.env.LLM_TIMEOUT || "30000", 10), // 30 seconds
    resumeParsing: parseInt(process.env.LLM_TIMEOUT_RESUME || "45000", 10), // 45 seconds
    coverLetterGeneration: parseInt(process.env.LLM_TIMEOUT_COVER || "30000", 10), // 30 seconds
    jobMatching: parseInt(process.env.LLM_TIMEOUT_JOB || "20000", 10), // 20 seconds
  },
};

/**
 * Helper function to get task-specific configuration
 */
export function getTaskConfig(taskType: keyof typeof llmConfig.taskModels) {
  return {
    model: llmConfig.taskModels[taskType] || llmConfig.models[llmConfig.defaultProvider],
    cacheTTL: llmConfig.cacheStrategy[taskType as keyof typeof llmConfig.cacheStrategy] || 
              llmConfig.cacheStrategy.default,
    timeout: llmConfig.timeouts[taskType as keyof typeof llmConfig.timeouts] || 
             llmConfig.timeouts.default,
  };
}

/**
 * Validate configuration at startup
 */
export function validateLLMConfig(): string[] {
  const errors: string[] = [];

  // Check if at least one provider is enabled
  const enabledProviders = Object.entries(llmConfig.providers)
    .filter(([_, config]) => config.enabled);
  
  if (enabledProviders.length === 0) {
    errors.push("No LLM providers are enabled");
  }

  // Check if default provider is enabled
  const defaultProviderConfig = llmConfig.providers[llmConfig.defaultProvider];
  if (!defaultProviderConfig?.enabled) {
    errors.push(`Default provider '${llmConfig.defaultProvider}' is not enabled`);
  }

  // Check API keys for enabled providers
  for (const [provider, config] of enabledProviders) {
    if (provider !== "mock" && "apiKey" in config && !config.apiKey) {
      errors.push(`API key missing for enabled provider: ${provider}`);
    }
  }

  // Validate numeric ranges
  if (llmConfig.defaultTemperature < 0 || llmConfig.defaultTemperature > 2) {
    errors.push("Temperature must be between 0 and 2");
  }

  if (llmConfig.defaultMaxTokens < 1 || llmConfig.defaultMaxTokens > 128000) {
    errors.push("Max tokens must be between 1 and 128000");
  }

  if (llmConfig.retry.maxAttempts < 1 || llmConfig.retry.maxAttempts > 10) {
    errors.push("Retry attempts must be between 1 and 10");
  }

  return errors;
}

export default llmConfig;
