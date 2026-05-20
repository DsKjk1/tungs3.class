import type { TopicContent } from "./types";
import { environmentalIssues } from "./environmental-issues";
import { personalData } from "./personal-data";
import { legislation } from "./legislation";
import { artificialIntelligence } from "./artificial-intelligence";
import { intellectualProperty } from "./intellectual-property";
import { threats } from "./threats";
import { protectingSystems } from "./protecting-systems";

export const topicContent: Record<string, TopicContent> = {
  "environmental-issues": environmentalIssues,
  "personal-data": personalData,
  "legislation": legislation,
  "artificial-intelligence": artificialIntelligence,
  "intellectual-property": intellectualProperty,
  "threats": threats,
  "protecting-systems": protectingSystems,
};

export function getTopicContent(slug: string): TopicContent | null {
  return topicContent[slug] ?? null;
}
