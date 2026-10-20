import { describe, expect, it } from "vitest";
import { mockAnalyses } from "@/mocks/analyses";
import { scoreTone } from "@/lib/store";

describe("mock analyses", () => {
  it("breakdown sums equal match_score", () => {
    for (const a of mockAnalyses) {
      if (!a.result) continue;
      const b = a.result.score_breakdown;
      expect(b.required_qualifications + b.preferred_qualifications + b.experience_relevance + b.presentation).toBe(a.result.match_score);
    }
  });
  it("score color bands", () => {
    expect(scoreTone(80)).toBe("high");
    expect(scoreTone(79)).toBe("mid");
    expect(scoreTone(50)).toBe("mid");
    expect(scoreTone(49)).toBe("low");
  });
});
