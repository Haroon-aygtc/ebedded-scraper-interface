export interface SelectorGroup {
  id: string;
  name: string;
  selectors: Selector[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Selector {
  id: string;
  name: string;
  selector: string;
  type: "css" | "xpath" | "regex";
  attribute?: string;
  description?: string;
}

export interface ScrapingConfig {
  id: string;
  name: string;
  urls: string[];
  selectorGroups: string[];
  options: ScrapingOptions;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScrapingOptions {
  includeMetadata: boolean;
  includeHeaders: boolean;
  includeFooters: boolean;
  includeLinks: boolean;
  includeImages: boolean;
  followPagination: boolean;
  followInternalLinks: boolean;
  maxDepth: number;
  maxPages: number;
  delay: number;
  userAgent?: string;
  stealthMode: boolean;
  customHeaders?: Record<string, string>;
  exportFormat: "csv" | "json" | "text" | "html";
}

export interface ScrapingResult {
  id: string;
  configId: string;
  url: string;
  data: any;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    author?: string;
    publishedDate?: string;
  };
  headers?: Record<string, string>;
  links?: string[];
  images?: string[];
  timestamp: Date;
  status: "success" | "partial" | "failed";
  error?: string;
}
