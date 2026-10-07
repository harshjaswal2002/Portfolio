'use strict';
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value, low=0, high=1) => Math.min(high, Math.max(low, value));
const smooth = (value, low, high) => {const x=clamp((value-low)/(high-low));return x*x*(3-2*x);};
let storedMotion;
try {storedMotion=localStorage.getItem('portfolio-motion');} catch (_) {}
let motionOff = storedMotion ? storedMotion==='off' : reducedMotion.matches;
let sculpture;
try {sculpture=new ScrollSculpture($('#sculpture-canvas'));root.classList.add('webgl-ready');} catch (error) {console.info('Using static artwork fallback.');$('#sculpture-canvas').hidden=true;}
const chapters=$$('.scroll-chapter');
const scenes=chapters.map(element=>({element,pin:$('.scene-pin',element),top:0,length:1}));
let isMobile=window.innerWidth<=750;
let targetY=window.scrollY,currentY=targetY,frame=null,currentTone='',pointerX=0,pointerY=0;
const worlds={
 ivory:{background:'#eeece7',one:'#aeaba8',two:'#d9c4ad',tint:[.78,.42,.22],dark:false},
 sage:{background:'#dbe4db',one:'#9bbcad',two:'#d1d9bc',tint:[.45,.66,.49],dark:false},
 sand:{background:'#ece3d5',one:'#c8b398',two:'#e2c7a7',tint:[.79,.58,.35],dark:false},
 lavender:{background:'#e6e0ef',one:'#b4a0cc',two:'#cec6df',tint:[.61,.43,.75],dark:false},
 blue:{background:'#1f2a3d',one:'#44536d',two:'#344862',tint:[.46,.56,.78],dark:true},
 charcoal:{background:'#1e2523',one:'#45513d',two:'#706e55',tint:[.69,.73,.52],dark:true},
 stone:{background:'#e9e6dc',one:'#b4b5a2',two:'#d1c7b0',tint:[.72,.61,.43],dark:false},
 forest:{background:'#293628',one:'#536b42',two:'#697e50',tint:[.52,.66,.35],dark:true}
};
function configureMotion(){
 root.classList.add('immersive');root.classList.toggle('motion-reduced',motionOff);
 const button=$('.motion-toggle');button.setAttribute('aria-pressed',String(motionOff));
 button.setAttribute('aria-label',`Turn ${motionOff?'on':'off'} motion`);$('.motion-label').textContent=`Motion ${motionOff?'off':'on'}`;
 if(motionOff){$$('.skill-story,.education-entry').forEach(el=>el.removeAttribute('aria-hidden'));}
 refresh();
}
function refresh(){
 isMobile=window.innerWidth<=750;
 for(const scene of scenes){scene.top=scene.element.offsetTop;scene.length=Math.max(1,scene.element.offsetHeight-scene.pin.offsetHeight);}
 if(sculpture)sculpture.resize();targetY=currentY=window.scrollY;schedule();
}
function schedule(){if(frame===null&&!document.hidden)frame=requestAnimationFrame(render);}
function paintText(element,alpha,offset,base=''){if(!element)return;element.style.opacity=alpha.toFixed(3);element.style.transform=`${base} translateY(${offset.toFixed(2)}px)`;}
function setWorld(tone){
 if(tone===currentTone)return;currentTone=tone;const world=worlds[tone]||worlds.ivory;
 root.style.setProperty('--world',world.background);root.style.setProperty('--glow-one',world.one);root.style.setProperty('--glow-two',world.two);root.classList.toggle('dark-world',world.dark);
}
function render(){
 frame=null;targetY=window.scrollY;
 if(motionOff)currentY=targetY;else currentY+=((targetY-currentY)*.21);
 if(Math.abs(targetY-currentY)<.25)currentY=targetY;
 const y=currentY,vh=window.innerHeight,documentLength=Math.max(1,root.scrollHeight-vh);
 const total=clamp(y/documentLength);$('.page-progress span').style.width=`${(total*100).toFixed(2)}%`;$('.hud-progress').textContent=`${String(Math.round(total*100)).padStart(2,'0')}%`;
 let active=scenes[0];for(const scene of scenes){if(y+vh*.3>=scene.top)active=scene;}
 const contact=$('#contact');if(y+vh*.5>=contact.offsetTop)active={element:contact,top:contact.offsetTop,length:contact.offsetHeight-vh};
 setWorld(active.element.dataset.tone||'ivory');
 $('.hud-chapter').textContent=`${active.element.dataset.number} / ${active.element.dataset.chapter}`;
 const sectionId=active.element.id.startsWith('project-')?'work':active.element.id;
 $$('.chapter-nav a').forEach(link=>{if(link.getAttribute('href')===`#${sectionId}`)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
 $('.hud-scroll').style.opacity=total>.96?'0':'1';
 if(!motionOff){
  for(const scene of scenes){
   const p=clamp((y-scene.top)/scene.length),el=scene.element;
   el.dataset.scrollProgress=p.toFixed(3);
   if(el.id==='home'){
    const a=1-smooth(p,.22,.48),b=smooth(p,.34,.55)*(1-smooth(p,.89,1));
    paintText($('.opening-copy',el),a,-p*55,isMobile?'translateY(-30%)':'translateY(-50%)');
    paintText($('.opening-second',el),b,(1-smooth(p,.34,.57))*60,'translateY(-50%)');
    $('.opening-annotation',el).style.opacity=(1-smooth(p,.33,.55)).toFixed(3);
    $('.opening-orbit',el).style.opacity=b.toFixed(3);
   }
   if(el.classList.contains('work-intro')){
    const text=$('.work-intro-title',el);text.style.transform=`translate(${p*18}px,${-p*45}px) scale(${1+p*.035})`;text.style.opacity=(1-smooth(p,.82,1)).toFixed(3);
   }
   if(el.classList.contains('project-chapter')){
    const heading=1-smooth(p,.25,.46),details=smooth(p,.31,.5)*(1-smooth(p,.9,1));
    paintText($('.project-heading',el),heading,-smooth(p,.25,.5)*45);
    paintText($('.project-details',el),details,(1-smooth(p,.31,.5))*45);
    const stage=$('.project-stage',el);
    stage.style.opacity=(isMobile?1-smooth(p,.27,.49):1-smooth(p,.94,1)).toFixed(3);
    stage.style.transform=`translateY(${isMobile?'-20%':'-50%'}) perspective(1200px) rotateY(${isMobile?0:-10+smooth(p,0,.7)*13}deg) rotateX(${isMobile?0:6-p*9}deg) rotateZ(${-2+p*4}deg) scale(${.9+smooth(p,0,.45)*.1}) translateX(${isMobile?0:p*10}px)`;
    $('.project-scrub i',el).style.width=`${p*100}%`;$('.project-phase-label',el).textContent=p<.4?'THE EXPERIENCE':'MY CONTRIBUTION';
    const chart=$('.chart-line',el);if(chart)chart.style.strokeDashoffset=String((1-smooth(p,.02,.3))*500);
    const phone=$('.mock-phone',el);if(phone)phone.style.transform=`rotate(${8-p*18}deg) translateY(${-p*15}px)`;
    const wave=$('.waveform path',el);if(wave)wave.style.transform=`scaleY(${.65+.35*Math.sin(p*25)})`;
    const building=$('.building-art',el);if(building)building.style.transform=`translateY(${14-p*30}px)`;
   }
   if(el.id==='expertise'){
    const step=Math.min(2,Math.floor(p*3));
    $$('.skill-story',el).forEach((story,i)=>{const local=p*3-i;const alpha=i===step?Math.min(1,smooth(local,0,.14))*(i===2?1:1-smooth(local,.91,1)):0;paintText(story,(p===0&&i===0)?1:alpha,30*(1-clamp(local/.18)));story.setAttribute('aria-hidden',String(i!==step));});
    $$('.skill-position span',el).forEach((node,i)=>node.classList.toggle('active',i===step));
    $('.skill-rings',el).style.transform=`rotate(${p*160}deg)`;
    const orbit=$('.skills-art',el);orbit.style.filter=`hue-rotate(${p*35}deg)`;
   }
   if(el.id==='journey'){
    const step=Math.min(3,Math.floor(p*4));
    $$('.education-entry',el).forEach((entry,i)=>{const local=p*4-i;const alpha=i===step?Math.min(1,smooth(local,0,.15))*(i===3?1:1-smooth(local,.91,1)):0;paintText(entry,(p===0&&i===0)?1:alpha,35*(1-clamp(local/.2)));entry.setAttribute('aria-hidden',String(i!==step));});
    $('.education-line span',el).style.height=`${p*100}%`;$('.journey-symbol',el).style.transform=`rotate(${p*160}deg)`;
   }
   if(el.id==='about'){
    $('.roots-landscape img',el).style.transform=`scale(${1.24-p*.22}) translateY(${-p*18}px)`;
    paintText($('.roots-copy',el),1-smooth(p,.83,1),-p*35);
   }
  }
 }
 if(sculpture&&!motionOff){
  const opening=scenes[0],hp=clamp(y/opening.length),world=worlds[active.element.dataset.tone]||worlds.ivory;
  const first=active.element.id==='home';const visible=first?1:active.element.id==='work'?.46:active.element.id==='contact'?.3:.1;
  root.style.setProperty('--world-opacity',String(visible));
  const aspect=window.innerWidth/window.innerHeight;
  sculpture.render({rotation:.65+y*.0013+pointerX*.09,morph:.22+smooth(hp,0,.75)*.78,scale:isMobile?.17+.025*Math.sin(hp*Math.PI):.31+hp*.09,x:first?(isMobile?aspect*.12:aspect*(.35-hp*.1)):aspect*.15,y:first?(isMobile?-.49+hp*.05:-.03):-.15,tint:world.tint});
 }
 if(Math.abs(targetY-currentY)>.25)schedule();
}

$('.motion-toggle').addEventListener('click',()=>{
 motionOff=!motionOff;
 try {localStorage.setItem('portfolio-motion',motionOff?'off':'on');} catch (_) {}
 configureMotion();
});
reducedMotion.addEventListener('change',event=>{
 let preference;
 try {preference=localStorage.getItem('portfolio-motion');} catch (_) {}
 if(!preference){motionOff=event.matches;configureMotion();}
});
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',refresh);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
window.addEventListener('pointermove',event=>{
 if(event.pointerType!=='mouse'||motionOff)return;
 pointerX=event.clientX/window.innerWidth-.5;
 pointerY=event.clientY/window.innerHeight-.5;
 schedule();
},{passive:true});
configureMotion();
document.fonts.ready.then(refresh);
const briefForm = $('#brief-form');
const briefResult = $('#brief-result');
let currentBrief = '';
function makeBrief(data) {
  return `PROJECT BRIEF FOR HARSH JASWAL\n\nName: ${String(data.get('name') || '').trim()}\nEmail: ${String(data.get('email') || '').trim()}\nProject: ${String(data.get('type') || '').trim()}\n\nThe idea\n${String(data.get('idea') || '').trim()}\n\nPrepared with Harsh Jaswal’s portfolio.`;
}
briefForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!briefForm.reportValidity()) return;
  const name = $('#brief-name');
  const idea = $('#brief-idea');
  name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
  idea.setCustomValidity(idea.value.trim() ? '' : 'Please describe your idea.');
  if (!briefForm.reportValidity()) return;
  currentBrief = makeBrief(new FormData(briefForm));
  $('#brief-output').textContent = currentBrief;
  $('#brief-status').textContent = 'Copy or download this brief to share through your preferred channel.';
  briefForm.hidden = true;
  briefResult.hidden = false;
  if (contactEmail) {
    const emailLink = $('#email-brief');
    emailLink.hidden = false;
    emailLink.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Project enquiry — ' + $('#brief-type').value)}&body=${encodeURIComponent(currentBrief)}`;
  }
  $('#copy-brief').focus({ preventScroll: true });
  refresh();
});
[$('#brief-name'), $('#brief-idea')].forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
$('#edit-brief').addEventListener('click', () => {
  briefForm.hidden = false;
  briefResult.hidden = true;
  $('#brief-name').focus({ preventScroll: true });
  refresh();
});
$('#copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(currentBrief);
    $('#brief-status').textContent = 'Copied. Your brief is ready to share.';
  } catch (_) {
    const range = document.createRange();
    range.selectNodeContents($('#brief-output'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    $('#brief-status').textContent = 'Select and copy the brief above, or download it as a text file.';
  }
});
$('#download-brief').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([currentBrief], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'project-brief-for-harsh-jaswal.txt';
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  $('#brief-status').textContent = 'Downloaded. Share the text file through your preferred channel.';
});
$('#year').textContent = new Date().getFullYear();
