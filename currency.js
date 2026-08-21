/* Automatic local currency display; checkout remains securely validated in EUR. */
(function () {
  "use strict";
  const state={country:"",currency:"EUR",rates:{EUR:1}};
  function format(amount,currency){return new Intl.NumberFormat(undefined,{style:"currency",currency,maximumFractionDigits:["RON","HUF","JPY","KRW","IDR"].includes(currency)?0:2}).format(amount);}
  function displayMoney(eurValue,romanianPrice=null){
    if(state.country==="RO"&&Number.isFinite(Number(romanianPrice))) return format(Number(romanianPrice),"RON");
    const eur=Number(eurValue)||0, rate=Number(state.rates[state.currency])||1;
    return format(eur*rate,state.currency);
  }
  function refresh(){document.querySelectorAll("[data-eur-price]").forEach(node=>{node.textContent=displayMoney(node.dataset.eurPrice,node.dataset.roPrice);});document.dispatchEvent(new CustomEvent("velvet:currency-change"));}
  async function initialize(){
    try{const response=await fetch("/api/currency",{headers:{Accept:"application/json"}});if(!response.ok)throw new Error("Currency service unavailable");const data=await response.json();state.rates=data.rates||{EUR:1};state.country=data.country||"";state.currency=data.currency&&state.rates[data.currency]?data.currency:"EUR";}catch(error){console.warn("Automatic local currency unavailable:",error);}
    refresh();const root=document.getElementById("catalogue-root");if(root)new MutationObserver(refresh).observe(root,{childList:true,subtree:true});
  }
  window.VELVET_CURRENCY={displayMoney,get currency(){return state.currency;},get country(){return state.country;},get isRomania(){return state.country==="RO";}};
  document.addEventListener("DOMContentLoaded",initialize);
})();
