!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).AutoToc=t()}(this,(function(){"use strict";"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;function e(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var t={exports:{}};return function(e,t){e.exports=function(){const e="horizontal",t="all",n="manual",o="nesting",l="headings",s=s=>{const i=()=>{const i=s.getConfig().autotoc||{},a={};return i.mode===e?a.mode=e:i.mode===t?a.mode=t:(void 0!==i.mode&&i.mode!==n&&console.warn("Unknown autotoc mode: "+i.mode),a.mode=n),i.levels===o?a.levels=o:(void 0!==i.levels&&i.levels!==l&&console.warn("Unknown autotoc levels: "+i.levels),a.levels=l),"function"==typeof i.transformationFn?a.transformationFn=i.transformationFn:a.transformationFn=e=>e,a.defaultListStyles=i.defaultListStyles||"ul",a},a=(o,l)=>{if(void 0!==l.dataset.tocIgnore||"false"===l.dataset.tocIgnore||"hidden"===l.dataset.visibility&&!0!==s.getConfig().showHiddenSlides)return!1;if(o===t)return!0;if(o===e){const e=s.getIndices(l);return void 0===e.v?!(l.firstElementChild&&"section"===l.firstElementChild.tagName.toLowerCase()):0===e.v||void 0!==l.dataset.toc}return o===n&&void 0!==l.dataset.toc},r=e=>{for(const t of e.children)if(t.tagName.match(/^H[1-7]$/i))return{level:parseInt(t.tagName.substring(1)),title:t.innerText||""};return{level:1,title:"???"}},d=(e,t)=>{let n=new Set(void 0===t.dataset.tocGroups?[]:t.dataset.tocGroups.split(/\s*,\s*/).map((e=>e.toUpperCase())));const o=s.getIndices(t);let i=null,a=t.dataset.tocTitle||"";""===a&&(i=r(t),a=i.title),a=e.transformationFn(a,t);let d=0,c=t.dataset.tocLevel;return void 0!==c&&(d=parseInt(c)),(0===d||isNaN(d))&&(e.levels===l?(null===i&&(i=r(t)),d=i.level):d=void 0===o.v||0===o.v?1:2),{level:d,title:a,groups:n,indices:o}},c=e=>{const t=s.getRevealElement().ownerDocument.createElement("a");t.innerText=e.title;let n="#/"+e.indices.h;void 0!==e.indices.v&&(n+="/"+e.indices.v,void 0!==e.indices.f&&(n+="/"+e.indices.f)),t.href=n;const o=s.getRevealElement().ownerDocument.createElement("li");return o.appendChild(t),o},f=(e,t,n)=>{const o=t.dataset.tocGroups,l=(t.dataset.tocStyles||e.defaultListStyles).split(/\s*,\s*/),s=new Set(void 0===o?[]:o.split(/\s*,\s*/).map((e=>e.toUpperCase()))),i=[t],a=e=>{if(s.size>0){let t=!1;return e.groups.forEach((e=>{s.has(e)&&(t=!0)})),!t}};for(let e of n)if(!a(e)){for(;e.level+1<i.length;)i.pop();if(e.level+1===i.length){const t=c(e);i[i.length-1].after(t),i[i.length-1]=t}else{let n="";for(n=e.level-1<l.length?l[e.level-1]:l[l.length-1];e.level>i.length;){const e=t.ownerDocument.createElement(n),o=t.ownerDocument.createElement("li");e.append(o),i[i.length-1].append(e),i.push(o)}const o=t.ownerDocument.createElement(n),s=c(e);o.append(s),i[i.length-1].append(o),i.push(s)}}},u=()=>{const e=s.getSlidesElement().querySelectorAll("[data-toc-insert]");if(0===e.length)return void console.log("No element with 'data-toc-insert' attribute found. Won't generate any table of content.");const t=i(),n=s.getSlides().filter((e=>a(t.mode,e))).map((e=>d(t,e)));e.forEach((e=>f(t,e,n)))};try{u()}catch(e){console.error("Could not create tocs",e)}};return()=>({id:"autotoc",init:s,destroy:()=>{}})}()}(t),e(t.exports)}));