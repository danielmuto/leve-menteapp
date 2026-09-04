import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Entry = {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  values: Record<string, string>;
  audios?: { id: string; url: string; seconds: number }[];
};

export type MoodLog = { date: string; mood: string };

export type AppState = {
  name: string;
  email: string | null;
  onboarded: boolean;
  defaultMood: string;
  reminder: boolean;
  reminderTime: string;
  subscriber: boolean;
  entries: Entry[];
  moodLogs: MoodLog[];
};

const EMPTY: AppState = {
  name: "",
  email: null,
  onboarded: false,
  defaultMood: "calma",
  reminder: true,
  reminderTime: "20:00",
  subscriber: false,
  entries: [],
  moodLogs: [],
};

const KEY = "escrita-terapeutica-v1";

type Ctx = {
  state: AppState;
  hydrated: boolean;
  update: (patch: Partial<AppState>) => void;
  addEntry: (entry: Omit<Entry, "id" | "createdAt">) => Entry;
  removeEntry: (id: string) => void;
  logMood: (mood: string) => void;
  reset: () => void;
  streak: number;
  todayMood: string | null;
  visibleEntries: Entry[];
};

const AppContext = createContext<Ctx | null>(null);

export const todayKey = () => new Date().toISOString().slice(0, 10);

function computeStreak(logs: MoodLog[], entries: Entry[]) {
  const days = new Set<string>();
  logs.forEach((l) => days.add(l.date));
  entries.forEach((e) => days.add(e.createdAt.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (streak === 0 && key === todayKey()) {
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...EMPTY, ...(JSON.parse(raw) as AppState) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const addEntry: Ctx["addEntry"] = useCallback((entry) => {
    const full: Entry = {
      ...entry,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, entries: [full, ...s.entries] }));
    return full;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setState((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }));
  }, []);

  const logMood = useCallback((mood: string) => {
    const date = todayKey();
    setState((s) => ({
      ...s,
      moodLogs: [...s.moodLogs.filter((l) => l.date !== date), { date, mood }],
    }));
  }, []);

  const reset = useCallback(() => {
    setState(EMPTY);
    localStorage.removeItem(KEY);
  }, []);

  const value = useMemo<Ctx>(() => {
    const streak = computeStreak(state.moodLogs, state.entries);
    const todayMood = state.moodLogs.find((l) => l.date === todayKey())?.mood ?? null;
    const limit = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const visibleEntries = state.subscriber
      ? state.entries
      : state.entries.filter((e) => new Date(e.createdAt).getTime() >= limit);
    return {
      state,
      hydrated,
      update,
      addEntry,
      removeEntry,
      logMood,
      reset,
      streak,
      todayMood,
      visibleEntries,
    };
  }, [state, hydrated, update, addEntry, removeEntry, logMood, reset]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp precisa estar dentro de AppProvider");
  return ctx;
}
