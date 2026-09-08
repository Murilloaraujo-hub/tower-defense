export function toast(text){const layer=document.getElementById('toastLayer');if(!layer)return;const el=document.createElement('div');el.className='toast';el.textContent=text;layer.append(el);setTimeout(()=>el.remove(),1900)}
export const fmt=n=>Math.floor(n).toLocaleString('pt-BR');
