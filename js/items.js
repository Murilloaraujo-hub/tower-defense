export const ITEMS=[
{id:'sunblade',name:'Lâmina Heliônica',rarity:'rare',type:'Arma',effect:'+12% dano',bonus:{damage:1.12},unlocked:true},
{id:'focusring',name:'Anel de Foco',rarity:'uncommon',type:'Acessório',effect:'+8% alcance',bonus:{range:1.08},unlocked:true},
{id:'piercegem',name:'Gema Prismática',rarity:'epic',type:'Artefato',effect:'+1 perfuração',bonus:{pierce:1},unlocked:false},
{id:'hourglass',name:'Ampulheta Pulsante',rarity:'legendary',type:'Artefato',effect:'-8% cooldown',bonus:{abilityCooldown:.92},unlocked:false},
{id:'starcharm',name:'Talismã Estelar',rarity:'mythic',type:'Acessório',effect:'+18% velocidade',bonus:{attackSpeed:.82},unlocked:false}
];
export const getItem=id=>ITEMS.find(i=>i.id===id);
