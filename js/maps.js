export const MAPS=[
{id:'meadow',name:'Pradaria Estelar',difficulty:1,unlockLevel:1,accent:'#56d99f',bg:'#224d49',path:[[0,.58],[.12,.58],[.2,.38],[.37,.38],[.46,.68],[.63,.68],[.7,.27],[.88,.27],[1,.48]],blocked:[{x:.28,y:.57,r:.06},{x:.55,y:.42,r:.05}],description:'Uma rota equilibrada com bastante espaço para aprender.'},
{id:'forest',name:'Bosque Luminar',difficulty:2,unlockLevel:4,accent:'#72d06d',bg:'#183f34',path:[[0,.24],[.18,.24],[.25,.6],[.42,.6],[.48,.3],[.66,.3],[.7,.76],[.88,.76],[1,.55]],blocked:[{x:.35,y:.3,r:.07},{x:.6,y:.58,r:.06}],description:'Curvas fechadas e clareiras menores.'},
{id:'frost',name:'Coroa Glacial',difficulty:3,unlockLevel:8,accent:'#74dcff',bg:'#214863',path:[[0,.72],[.18,.72],[.22,.3],[.38,.3],[.45,.82],[.62,.82],[.68,.22],[.86,.22],[1,.42]],blocked:[{x:.33,y:.58,r:.07},{x:.56,y:.45,r:.06}],description:'Um caminho longo sobre lagos congelados.'},
{id:'volcano',name:'Forja Rubra',difficulty:4,unlockLevel:13,accent:'#ff7f62',bg:'#4d2828',path:[[0,.5],[.16,.5],[.25,.2],[.45,.2],[.5,.72],[.67,.72],[.76,.38],[1,.38]],blocked:[{x:.34,y:.52,r:.08},{x:.64,y:.3,r:.06}],description:'Pouco espaço e pressão constante.'},
{id:'ruins',name:'Ruínas Prismáticas',difficulty:5,unlockLevel:20,accent:'#bc8cff',bg:'#342650',path:[[0,.2],[.2,.2],[.24,.72],[.45,.72],[.5,.34],[.68,.34],[.74,.75],[.9,.75],[1,.52]],blocked:[{x:.38,y:.38,r:.08},{x:.62,y:.58,r:.07}],description:'Uma rota traiçoeira entre estruturas antigas.'}
];
export const getMap=id=>MAPS.find(m=>m.id===id)||MAPS[0];
