export const ENEMIES={
wisp:{name:'Fagulha',hp:7,speed:82,reward:3,radius:10,color:'#b8f1ff',lives:1},
skitter:{name:'Corredor',hp:10,speed:138,reward:4,radius:9,color:'#9ff08c',lives:1},
brute:{name:'Casco',hp:32,speed:58,reward:7,radius:14,color:'#ffbd75',lives:2},
armor:{name:'Bastião',hp:62,speed:48,reward:10,radius:15,color:'#9ca8c8',lives:3,armor:2},
regen:{name:'Broto Sombrio',hp:50,speed:62,reward:9,radius:13,color:'#74e6b3',lives:2,regen:4},
shade:{name:'Sombra',hp:38,speed:96,reward:8,radius:11,color:'#8a7cf0',lives:2,invisible:true},
swarm:{name:'Estilhaço',hp:5,speed:110,reward:2,radius:7,color:'#ffd875',lives:1},
golem:{name:'Golem do Véu',hp:125,speed:36,reward:16,radius:19,color:'#bd8c74',lives:5,armor:3},
mage:{name:'Oráculo Partido',hp:75,speed:70,reward:13,radius:14,color:'#e88cff',lives:3,resist:.22},
elite:{name:'Sentinela Elite',hp:175,speed:72,reward:22,radius:17,color:'#ff6d8d',lives:7,armor:3,resist:.3},
champion:{name:'Arauto',hp:420,speed:48,reward:45,radius:23,color:'#f7e07c',lives:12,armor:5,resist:.35,regen:8,boss:true},
titan:{name:'Titã Astral',hp:1200,speed:34,reward:120,radius:31,color:'#ff9866',lives:30,armor:7,resist:.5,regen:18,boss:true}
};
export const enemyKeys=Object.keys(ENEMIES);
