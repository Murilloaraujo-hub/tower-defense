const common={
A:[{name:'Potência I',cost:220,apply:t=>t.damage*=1.35},{name:'Potência II',cost:420,apply:t=>t.damage*=1.4},{name:'Impacto Astral',cost:760,apply:t=>{t.damage*=1.45;t.pierce+=2}},{name:'Ruptura',cost:1150,apply:t=>{t.damage*=1.35;t.splash=34}},{name:'Ascendente',cost:1850,apply:t=>{t.damage*=1.55;t.pierce+=3}}],
B:[{name:'Ritmo I',cost:200,apply:t=>t.attackSpeed*=.84},{name:'Ritmo II',cost:390,apply:t=>t.attackSpeed*=.82},{name:'Ataque Duplo',cost:720,apply:t=>t.multishot=(t.multishot||1)+1},{name:'Foco Perfeito',cost:1080,apply:t=>t.attackSpeed*=.72},{name:'Tempestade',cost:1700,apply:t=>{t.multishot=(t.multishot||1)+1;t.attackSpeed*=.78}}],
C:[{name:'Alcance I',cost:180,apply:t=>t.range*=1.18},{name:'Perfuração',cost:360,apply:t=>t.pierce+=2},{name:'Alcance II',cost:620,apply:t=>t.range*=1.2},{name:'Visão do Véu',cost:970,apply:t=>{t.range*=1.12;t.canSeeInvisible=true}},{name:'Guardião',cost:1500,apply:t=>{t.range*=1.18;t.pierce+=3}}]
};
export function createUpgradeState(){return{A:0,B:0,C:0}}
export function getUpgrade(path,level){return common[path]?.[level]||null}
export function pathName(path){return{A:'Poder',B:'Ritmo',C:'Controle'}[path]}
