import { useSyncExternalStore } from "react";
import { mockAnalyses, type AnalysisRecord } from "@/mocks/analyses";

type State = { loggedIn: boolean; analyses: AnalysisRecord[] };
let state: State = { loggedIn: false, analyses: mockAnalyses };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const store = {
  login() {
    state = { ...state, loggedIn: true };
    emit();
  },
  logout() {
    state = { ...state, loggedIn: false };
    emit();
  },
  remove(id: string) {
    state = { ...state, analyses: state.analyses.filter((a) => a.id !== id) };
    emit();
  },
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useAppState() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function scoreTone(score: number) {
  if (score >= 80) return "high" as const;
  if (score >= 50) return "mid" as const;
  return "low" as const;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
