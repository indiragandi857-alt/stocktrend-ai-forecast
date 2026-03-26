export interface TrendSearchParams {
  region: string;
  category: string;
  mediaType: 'image' | 'video';
}

export interface GeneratedPrompt {
  title: string;
  description: string;
  technicalSettings: string; // e.g., "50mm f/1.8, golden hour" or "4k, 60fps, slow motion"
}

export interface StockTrend {
  id: string;
  trendName: string;
  popularityScore: number; // 0-100
  reasoning: string; // Why is this trending?
  visualStyle: string; // Visual aesthetic description
  prompts: GeneratedPrompt[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TrendResponse {
  trends: StockTrend[];
  sources: GroundingSource[];
}

export enum Region {
  Global = 'Global',
  Indonesia = 'Indonesia',
  USA = 'United States',
  Europe = 'Europe',
  AsiaPacific = 'Asia Pacific',
  Japan = 'Japan',
  Brazil = 'Brazil'
}

export enum Category {
  Lifestyle = 'Lifestyle & People',
  Business = 'Business & Corporate',
  Technology = 'Technology & AI',
  Nature = 'Nature & Travel',
  Food = 'Food & Drink',
  Abstract = 'Abstract & Backgrounds',
  Health = 'Health & Wellness',
  Holidays = 'Holidays & Cultural Events'
}

export enum StockAssetType {
  People = 'Photography (People/Lifestyle)',
  Object = 'Object & Still Life (Isolated/Food)',
  Icon = 'Vector Icon & Illustration',
  Background = 'Background & Texture (Poster)',
  CopySpace = 'Conceptual & Copy Space (For Text)'
}