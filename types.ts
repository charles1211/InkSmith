
export enum TattooStyle {
  REALISM = 'Realism',
  TRADITIONAL = 'Traditional',
  NEO_TRADITIONAL = 'Neo Traditional',
  WATERCOLOR = 'Watercolor',
  BLACKWORK = 'Blackwork',
  MINIMALIST = 'Minimalist',
  JAPANESE = 'Japanese',
  TRIBAL = 'Tribal',
  SCRIPT = 'Script',
  OTHER = 'Other'
}

export interface Artist {
  id: string;
  name: string;
  specialties: TattooStyle[];
  bio: string;
  imageUrl: string;
  instagramHandle: string;
  highlights?: string[];
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ageVerification: 'yes' | 'guardian' | '';
  services: string[];
  tattooStyle: string;
  tattooStyleOther?: string;
  piercingPlacement: string;
  piercingPlacementOther?: string;
  artistId: string;
  description: string;
  preferredDate: string;
  referenceFile: File | null;
}

export interface GeminiIdeaResponse {
  concepts: {
    title: string;
    description: string;
    placementSuggestion: string;
    estimatedTime: string;
  }[];
}
