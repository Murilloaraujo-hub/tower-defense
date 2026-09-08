import {evaluateAchievements} from './achievements.js';
const KEY='astralBastionSave';
const SETTINGS='astralBastionSettings';
export function defaultSave(){return{level:1,xp:0,coins:700,achievements:[],unlockedHeroes:['kael','lyra','nix','morva'],unlockedMaps:['meadow'],equippedHeroes:['kael','lyra','nix','morva'],equipment:['sunblade','focusring'],equippedEquipment:{kael:['sunblade'],lyra:['focusring']},allies:[],equippedAlly:null,tutorialDone:false,profileName:'Guardião',stats:{kills:0,gamesPlayed:0,wins:0,losses:0,bestWave:0,moneySpent:0,towersPlaced:0,abilitiesUsed:0,bossesDefeated:0,perfectWins:0}}}
export function defaultSettings(){return{master:80,music:45,sfx:75,particles:true,damageNumbers:true,quality:'high',autoStart:false}}
export function loadSave(){try{return{...defaultSave(),...JSON.parse(localStorage.getItem(KEY)||'{}'),stats:{...defaultSave().stats,...(JSON.parse(localStorage.getItem(KEY)||'{}').stats||{})}}}catch{return defaultSave()}}
export function saveGame(data){evaluateAchievements(data);localStorage.setItem(KEY,JSON.stringify(data))}
export function loadSettings(){try{return{...defaultSettings(),...JSON.parse(localStorage.getItem(SETTINGS)||'{}')}}catch{return defaultSettings()}}
export function saveSettings(data){localStorage.setItem(SETTINGS,JSON.stringify(data))}
export function xpNeeded(level){return Math.floor(100*Math.pow(1.18,level-1))}
export function grantProgress(save,xp,coins){save.xp+=xp;save.coins+=coins;while(save.xp>=xpNeeded(save.level)){save.xp-=xpNeeded(save.level);save.level++;const heroUnlocks={4:'orin',8:'vesper',13:'rune',18:'sera'};const mapUnlocks={4:'forest',8:'frost',13:'volcano',20:'ruins'};if(heroUnlocks[save.level]&&!save.unlockedHeroes.includes(heroUnlocks[save.level]))save.unlockedHeroes.push(heroUnlocks[save.level]);if(mapUnlocks[save.level]&&!save.unlockedMaps.includes(mapUnlocks[save.level]))save.unlockedMaps.push(mapUnlocks[save.level])}saveGame(save)}
export function clearSave(){localStorage.removeItem(KEY);localStorage.removeItem(SETTINGS)}
