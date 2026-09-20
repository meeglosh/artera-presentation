// Scroll-craft supplies the pinned stages; this choreography expresses the argument.
const acts=[...document.querySelectorAll('[data-narrative]')];
const wide=matchMedia('(min-width:1000px) and (min-height:720px)');
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const clamp=n=>Math.max(0,Math.min(1,n));
let enabled=false,scheduled=false;
function setState(act,step,progress){
 act.dataset.narrativeStep=step;
 act.style.setProperty('--assembly',clamp(progress/.82).toFixed(4));
 act.style.setProperty('--path',(step/(+(act.dataset.stepCount||4)-1)).toFixed(4));
 act.dataset.scVerifyState=`${step}:${progress.toFixed(3)}`;
 act.dataset.scVerifyHold=String(act.dataset.narrative!=='clinical'||progress>=.82);
 act.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.step===step)));
 act.querySelectorAll('[data-reveal-step]').forEach(e=>{e.classList.toggle('resolved',+e.dataset.revealStep<=step);e.classList.toggle('current',+e.dataset.revealStep===step)});
 act.querySelectorAll('[data-roadmap-phase]').forEach(e=>e.classList.toggle('current',+e.dataset.roadmapPhase===step));
 act.querySelectorAll('[data-report-step]').forEach(e=>e.classList.toggle('current',+e.dataset.reportStep===step));
 act.querySelectorAll('[data-lifecycle-step]').forEach(e=>e.classList.toggle('current',+e.dataset.lifecycleStep===step));
}
function render(){scheduled=false;const council=document.querySelector("#kooth");const cp=enabled?clamp((innerHeight*.75-council.getBoundingClientRect().top)/(innerHeight*.8)):1;council.style.setProperty("--council-p",cp.toFixed(4));council.dataset.scVerifyState=cp.toFixed(4);for(const act of acts){const r=act.getBoundingClientRect();const p=enabled?clamp(-r.top/Math.max(1,act.offsetHeight-innerHeight)):1;const step=Math.min(+(act.dataset.stepCount||4)-1,Math.floor(p*+(act.dataset.stepCount||4)));setState(act,step,p)}}
function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(render)}}
function configure(){enabled=wide.matches&&!reduced.matches&&!document.body.classList.contains('motion-off');document.body.classList.toggle('narrative-live',enabled);window.presentationScroll?.layout();render();}
function select(act,step){const progress=(step+.25)/+(act.dataset.stepCount||4);setState(act,step,progress);if(enabled){const top=act.getBoundingClientRect().top+scrollY;scrollTo({top:top+progress*(act.offsetHeight-innerHeight),behavior:'instant'})}}
acts.forEach(act=>act.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>select(act,+b.dataset.step))));
// Return true only when a chapter has another internal beat to visit.
window.advanceNarrative=(act,direction)=>{if(!enabled||!act?.matches('[data-narrative]'))return false;const step=+(act.dataset.narrativeStep||0)+direction;if(step<0||step>=+(act.dataset.stepCount||4))return false;select(act,step);return true};
addEventListener('scroll',queue,{passive:true});addEventListener('resize',configure);wide.addEventListener('change',configure);reduced.addEventListener('change',configure);document.addEventListener('motionchange',configure);configure();
