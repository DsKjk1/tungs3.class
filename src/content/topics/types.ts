import type { MCQ } from "@/components/Quiz";

export interface SubSection {
  id: string;
  code: string;        // "01"
  title: string;       // "Manufacture"
  explanation: string; // one paragraph
  bullets: string[];
  paragraphs: string[];
  quiz: MCQ[];
}

export interface FlashcardEntry {
  category: string;
  front: string;
  back: string;
}

export interface TopicContent {
  slug: string;
  hero: string;
  tags: string[];
  sections: SubSection[];
  flashcards: FlashcardEntry[];
}
