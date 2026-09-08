export const DIFFICULTIES={easy:{label:'Fácil',hp:.82,speed:.95,money:780,lives:130,reward:.85},normal:{label:'Normal',hp:1,speed:1,money:650,lives:100,reward:1},hard:{label:'Difícil',hp:1.28,speed:1.08,money:560,lives:80,reward:1.25},extreme:{label:'Extremo',hp:1.62,speed:1.14,money:470,lives:60,reward:1.6}};
export const sellValue=tower=>Math.floor(tower.spent*.7);
export const waveBonus=wave=>Math.floor(65+wave*4.5);
