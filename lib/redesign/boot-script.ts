import { LANGUAGE_STORAGE_KEY, LOADER_STORAGE_KEY } from "./config"

/** Inline boot script — runs before paint to avoid loader / motion / lang flashes. */
export const BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var mq=window.matchMedia("(prefers-reduced-motion: reduce)");if(mq.matches)d.classList.add("reduce-motion");var skip=false;try{skip=!!sessionStorage.getItem("${LOADER_STORAGE_KEY}")}catch(e){}if(skip||mq.matches)d.classList.add("loader-done");var lang=null;try{lang=localStorage.getItem("${LANGUAGE_STORAGE_KEY}")||localStorage.getItem("language")}catch(e){}if(lang!=="es"&&lang!=="en"){lang=((navigator.language||"").toLowerCase().indexOf("es")===0)?"es":"en"}d.lang=lang;d.dataset.lang=lang}catch(e){}})();`
