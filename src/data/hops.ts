import { Hop } from '@/lib/types';

export const HOPS_DB: Hop[] = [
  // ── EUA ───────────────────────────────────────────────────────────────────
  { id:1,  name:"Cascade",              origin:"EUA",          aa:[4.5, 7.0], flavor:"Cítrico (toranja), floral",            use:"Amargor/Aroma" },
  { id:2,  name:"Centennial",           origin:"EUA",          aa:[9.5,11.5], flavor:"Floral, cítrico, terroso",             use:"Amargor/Aroma" },
  { id:3,  name:"Chinook",              origin:"EUA",          aa:[12.0,14.0],flavor:"Pinho, resinoso, condimentado",        use:"Amargor" },
  { id:4,  name:"Citra",                origin:"EUA",          aa:[11.0,13.0],flavor:"Tropical, maracujá, manga, cítrico",   use:"Aroma/Dry-hop" },
  { id:5,  name:"Mosaic",               origin:"EUA",          aa:[11.5,13.5],flavor:"Tropical, frutas vermelhas, terroso",  use:"Aroma/Dry-hop" },
  { id:6,  name:"Simcoe",               origin:"EUA",          aa:[12.0,14.0],flavor:"Pinho, terroso, maracujá",             use:"Amargor/Aroma" },
  { id:7,  name:"Columbus (CTZ)",       origin:"EUA",          aa:[14.0,18.0],flavor:"Terroso, resinoso, condimentado",      use:"Amargor" },
  { id:8,  name:"Amarillo",             origin:"EUA",          aa:[8.0,11.0], flavor:"Laranja, tangerina, floral",           use:"Aroma/Dry-hop" },
  { id:9,  name:"Magnum",               origin:"EUA/Alemanha", aa:[12.0,14.0],flavor:"Limpo, neutro, nobre",                use:"Amargor" },
  { id:10, name:"El Dorado",            origin:"EUA",          aa:[14.0,16.0],flavor:"Melancia, pera, tropical",             use:"Aroma/Dry-hop" },
  { id:11, name:"Willamette",           origin:"EUA",          aa:[4.0, 6.0], flavor:"Floral, terroso, herbal suave",        use:"Aroma" },
  { id:12, name:"Northern Brewer",      origin:"EUA/Alemanha", aa:[7.0,10.0], flavor:"Cedro, menta, herbal limpo",           use:"Amargor" },
  { id:13, name:"Ekuanot",              origin:"EUA",          aa:[13.0,15.0],flavor:"Lima, manga, maracujá, herbal",        use:"Aroma/Dry-hop" },
  { id:14, name:"Azacca",               origin:"EUA",          aa:[14.0,16.0],flavor:"Manga, laranja, pinho, tropical",      use:"Aroma/Dry-hop" },
  { id:15, name:"Idaho 7",              origin:"EUA",          aa:[12.0,14.0],flavor:"Fruta tropical, pêssego, tangerina",   use:"Aroma/Dry-hop" },
  { id:16, name:"Strata",               origin:"EUA",          aa:[12.0,14.0],flavor:"Maracujá, morango, tropical, cannabis", use:"Aroma/Dry-hop" },
  { id:17, name:"Bravo",                origin:"EUA",          aa:[14.0,17.0],flavor:"Floral, frutas, resinoso, limpo",      use:"Amargor" },
  // ── República Tcheca ──────────────────────────────────────────────────────
  { id:20, name:"Saaz",                 origin:"Rep. Tcheca",  aa:[2.5, 4.5], flavor:"Herbal, terroso, condimentado suave",  use:"Aroma" },
  // ── Alemanha ──────────────────────────────────────────────────────────────
  { id:21, name:"Hallertau Mittelfrüh", origin:"Alemanha",     aa:[3.5, 5.5], flavor:"Herbal, floral, condimentado",         use:"Aroma" },
  { id:22, name:"Tettnanger",           origin:"Alemanha",     aa:[3.5, 5.5], flavor:"Herbal, terroso, condimentado",        use:"Aroma" },
  { id:23, name:"Perle",                origin:"Alemanha",     aa:[7.0, 9.5], flavor:"Herbal, menta, floral",                use:"Amargor/Aroma" },
  { id:24, name:"Polaris",              origin:"Alemanha",     aa:[18.0,23.0],flavor:"Mentol, frutas tropicais, pinho",      use:"Amargor" },
  { id:25, name:"Hersbrucker",          origin:"Alemanha",     aa:[1.5, 4.0], flavor:"Herbal suave, floral, feno",           use:"Aroma" },
  { id:26, name:"Spalt",                origin:"Alemanha",     aa:[3.0, 5.5], flavor:"Condimentado suave, herbal, terroso",  use:"Aroma" },
  // ── Inglaterra / Europa ───────────────────────────────────────────────────
  { id:30, name:"East Kent Goldings",   origin:"Inglaterra",   aa:[4.0, 6.0], flavor:"Suave, floral, herbal, mel",           use:"Aroma" },
  { id:31, name:"Fuggles",              origin:"Inglaterra",   aa:[3.5, 5.5], flavor:"Suave, terroso, herbal, madeira",      use:"Aroma" },
  { id:32, name:"Challenger",           origin:"Inglaterra",   aa:[7.0, 9.0], flavor:"Cedro, condimentado, toranja suave",   use:"Amargor/Aroma" },
  { id:33, name:"Styrian Goldings",     origin:"Eslovênia",    aa:[4.5, 6.0], flavor:"Suave, floral, condimentado, terra",   use:"Aroma" },
  // ── Austrália ─────────────────────────────────────────────────────────────
  { id:40, name:"Galaxy",               origin:"Austrália",    aa:[13.0,15.0],flavor:"Pêssego, maracujá, cítrico intenso",   use:"Aroma/Dry-hop" },
  { id:43, name:"Vic Secret",           origin:"Austrália",    aa:[14.0,17.0],flavor:"Pinho, maracujá, manga",               use:"Aroma/Dry-hop" },
  { id:50, name:"Topaz",                origin:"Austrália",    aa:[10.0,14.0],flavor:"Frutas tropicais, resinoso",           use:"Amargor/Aroma" },
  // ── Nova Zelândia ─────────────────────────────────────────────────────────
  { id:41, name:"Nelson Sauvin",        origin:"Nova Zelândia",aa:[12.0,13.0],flavor:"Uva branca (Sauvignon), goiaba",       use:"Aroma/Dry-hop" },
  { id:42, name:"Motueka",              origin:"Nova Zelândia",aa:[6.5, 8.5], flavor:"Lima, limão, ervas tropicais",          use:"Aroma" },
  { id:44, name:"Wai-iti",              origin:"Nova Zelândia",aa:[2.5, 4.0], flavor:"Pêssego, damasco, lima",               use:"Aroma" },
  { id:45, name:"Riwaka",               origin:"Nova Zelândia",aa:[4.5, 6.5], flavor:"Toranja, maracujá, cítrico tropical",  use:"Aroma/Dry-hop" },
  { id:46, name:"Rakau",                origin:"Nova Zelândia",aa:[10.0,12.0],flavor:"Pêssego, ameixa, cítrico suave",       use:"Aroma/Dry-hop" },
];
