import { SavedRecipe, EquipProfile, WaterSource, SaltAdditions } from './types';

const KEYS = {
  recipes: 'dupay:recipes',
  equip:   'dupay:equip',
  water:   'dupay:water',
} as const;

export const loadEquip = (defaults: EquipProfile): EquipProfile => {
  try {
    const raw = localStorage.getItem(KEYS.equip);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch { return defaults; }
};

export const saveEquip = (equip: EquipProfile): void => {
  localStorage.setItem(KEYS.equip, JSON.stringify(equip));
};

export const loadRecipes = (): SavedRecipe[] => {
  try {
    const raw = localStorage.getItem(KEYS.recipes);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const saveRecipe = (recipe: SavedRecipe): void => {
  const all = loadRecipes().filter(r => r.id !== recipe.id);
  localStorage.setItem(KEYS.recipes, JSON.stringify([...all, recipe]));
};

export const deleteRecipe = (id: string): void => {
  const all = loadRecipes().filter(r => r.id !== id);
  localStorage.setItem(KEYS.recipes, JSON.stringify(all));
};

export const loadWater = (): { source: WaterSource; salts: SaltAdditions } | null => {
  try {
    const raw = localStorage.getItem(KEYS.water);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

export const saveWater = (source: WaterSource, salts: SaltAdditions): void => {
  localStorage.setItem(KEYS.water, JSON.stringify({ source, salts }));
};
