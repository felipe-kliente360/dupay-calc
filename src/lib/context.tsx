'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GrainEntry, HopEntry, EquipProfile, SavedRecipe, TabId, WaterSource, SaltAdditions } from './types';
import { loadEquip, saveEquip, loadRecipes, saveRecipe as persistRecipe, deleteRecipe as removeRecipe, loadWater, saveWater } from './storage';

export const DEFAULT_WATER: WaterSource = { ca:0, mg:0, na:0, hco3:0, so4:0, cl:0, ph:7.0 };
export const DEFAULT_SALTS: SaltAdditions = { gypsum:0, cacl2:0, epsom:0, nacl:0, nahco3:0 };

export const DEFAULT_EQUIP: EquipProfile = {
  batchL:        20,
  efficiency:    75,
  boilMin:       60,
  boiloffLh:     3,
  deadSpace:     1.5,
  trubLoss:      2.0,
  absorptionLkg: 1.0,
};

interface AppCtx {
  styleId: string;
  setStyleId: (id: string) => void;
  grains: GrainEntry[];
  setGrains: (g: GrainEntry[] | ((prev: GrainEntry[]) => GrainEntry[])) => void;
  hops: HopEntry[];
  setHops: (h: HopEntry[] | ((prev: HopEntry[]) => HopEntry[])) => void;
  yeastId: number;
  setYeastId: (id: number) => void;
  customAtten: number | null;
  setCustomAtten: (a: number | null) => void;
  equip: EquipProfile;
  setEquip: (e: EquipProfile) => void;
  waterSource: WaterSource;
  setWaterSource: (w: WaterSource) => void;
  salts: SaltAdditions;
  setSalts: (s: SaltAdditions) => void;
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  savedRecipes: SavedRecipe[];
  saveCurrentRecipe: (name: string) => void;
  loadSavedRecipe: (recipe: SavedRecipe) => void;
  deleteSavedRecipe: (id: string) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [styleId, setStyleId]           = useState('21A');
  const [grains, setGrains]             = useState<GrainEntry[]>([]);
  const [hops, setHops]                 = useState<HopEntry[]>([]);
  const [yeastId, setYeastId]           = useState(101);
  const [customAtten, setCustomAtten]   = useState<number | null>(null);
  const [equip, setEquipState]          = useState<EquipProfile>(DEFAULT_EQUIP);
  const [waterSource, setWaterState]    = useState<WaterSource>(DEFAULT_WATER);
  const [salts, setSaltsState]          = useState<SaltAdditions>(DEFAULT_SALTS);
  const [activeTab, setActiveTab]       = useState<TabId>('calculator');
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    setEquipState(loadEquip(DEFAULT_EQUIP));
    setSavedRecipes(loadRecipes());
    const w = loadWater();
    if (w) { setWaterState(w.source); setSaltsState(w.salts); }
  }, []);

  const setEquip = (e: EquipProfile) => { setEquipState(e); saveEquip(e); };

  const setWaterSource = (w: WaterSource) => {
    setWaterState(w);
    saveWater(w, salts);
  };
  const setSalts = (s: SaltAdditions) => {
    setSaltsState(s);
    saveWater(waterSource, s);
  };

  const saveCurrentRecipe = (name: string) => {
    const recipe: SavedRecipe = {
      id: Date.now().toString(),
      name,
      styleId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      grains,
      hops,
      yeastId,
      customAtten,
      notes: '',
      equipSnapshot: equip,
    };
    persistRecipe(recipe);
    setSavedRecipes(loadRecipes());
  };

  const loadSavedRecipe = (recipe: SavedRecipe) => {
    setStyleId(recipe.styleId);
    setGrains(recipe.grains);
    setHops(recipe.hops);
    setYeastId(recipe.yeastId);
    setCustomAtten(recipe.customAtten);
    setActiveTab('calculator');
  };

  const deleteSavedRecipe = (id: string) => {
    removeRecipe(id);
    setSavedRecipes(loadRecipes());
  };

  return (
    <Ctx.Provider value={{
      styleId, setStyleId,
      grains, setGrains,
      hops, setHops,
      yeastId, setYeastId,
      customAtten, setCustomAtten,
      equip, setEquip,
      waterSource, setWaterSource,
      salts, setSalts,
      activeTab, setActiveTab,
      savedRecipes, saveCurrentRecipe, loadSavedRecipe, deleteSavedRecipe,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
