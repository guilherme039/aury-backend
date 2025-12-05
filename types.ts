

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: number;
  name: string;
  imageUrl: string;
  time: string;
  nutrition: NutritionInfo;
  detectedFoods?: DetectedFood[];
  timestamp: number; // Timestamp para expiração de 24h
}

export interface DailyGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

export interface UserProfileData {
  name: string;
  photoUrl: string;
  goal: string;
  age: number;
  weight: number;
  height: number;
  workoutFrequency?: string;
  obstacle?: string;
  howHeard?: string;
  isOwner?: boolean; // Added for owner/admin check
}

export interface OnboardingData {
  goal: string;
  workoutFrequency: string;
  obstacle: string;
  howHeard: string;
}

export interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlan {
  breakfast: MealSuggestion[];
  lunch: MealSuggestion[];
  dinner: MealSuggestion[];
  snacks: MealSuggestion[];
}

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DetectedFood {
  foodName: string;
  boundingBox?: BoundingBox;
  weightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidenceScore: number;
  adjustmentSuggestion: string;
}

export interface ScanResult {
  mealName: string;
  totalNutrition: NutritionInfo;
  detectedFoods: DetectedFood[];
}

export interface WaterLogEntry {
  amount: number;
  timestamp: number;
}

export interface UserSession {
  isLoggedIn: boolean;
  isOwner: boolean;
  analysesRemaining: number;
  subscriptionStatus: 'none' | 'trial' | 'active';
}
