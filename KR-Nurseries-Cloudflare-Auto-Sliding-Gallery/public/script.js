const ADMIN_NUMBERS=['9381661029','8328286323','8074625223'];
const DEFAULT_GALLERY=[
 {title:'Fresh Nursery Plants',url:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80'},
 {title:'Healthy Green Saplings',url:'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=80'},
 {title:'Fruit & Farm Plants',url:'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80'},
 {title:'Garden Collection',url:'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80'},
 {title:'Grow Green',url:'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80'},
 {title:'Nursery Life',url:'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=1000&q=80'}
];

document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.querySelector('.menu');
menu.addEventListener('click',()=>{const n=document.querySelector('.nav nav');n.style.display=n.style.display==='flex'?'none':'flex';n.style.position='absolute';n.style.top='78px';n.style.right='6%';n.style.flexDirection='column';n.style.background='#fbfcf8';n.style.padding='20px';n.style.border='1px solid #e8ede5';n.style.borderRadius='12px'});

document.getElementById('enquiry').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const branch=f.get('branch');const target=branch.startsWith('Ragavapalli')?'8074625223':'8328286323';const msg=`Hello KR Nurseries, I am ${f.get('name')}. Phone: ${f.get('phone')}. Branch: ${branch}. Requirement: ${f.get('message')}`;window.open('https://wa.me/91'+target+'?text='+encodeURIComponent(msg),'_blank')});

function openAdmin(){document.getElementById('adminModal').classList.add('show');document.getElementById('adminModal').setAttribute('aria-hidden','false');renderAdmin();}
function closeAdmin(){document.getElementById('adminModal').classList.remove('show');document.getElementById('adminModal').setAttribute('aria-hidden','true');}
window.addEventListener('click',e=>{if(e.target.id==='adminModal')closeAdmin()});

document.getElementById('adminLoginForm').addEventListener('submit',e=>{e.preventDefault();const phone=document.getElementById('adminPhone').value.replace(/\D/g,'');if(ADMIN_NUMBERS.includes(phone)){sessionStorage.setItem('krAdmin','true');document.getElementById('loginError').textContent='';renderAdmin();}else document.getElementById('loginError').textContent='This number is not authorised.';});
function getGallery(){try{return JSON.parse(localStorage.getItem('krGallery'))||DEFAULT_GALLERY}catch{return DEFAULT_GALLERY}}
function saveGallery(g){localStorage.setItem('krGallery',JSON.stringify(g));renderGallery();renderAdminList()}
let galleryIndex=0;let galleryTimer=null;let galleryTouchStartX=0;let galleryTouchDeltaX=0;
function renderGallery(){const grid=document.getElementById('galleryGrid');const dots=document.getElementById('galleryDots');const items=getGallery();if(!grid)return;grid.innerHTML=items.map((x,i)=>`<article class="gallery-item"><img src="${escapeAttr(x.url)}" alt="${escapeAttr(x.title)}" loading="lazy" onerror="this.parentElement.classList.add('broken')"><div><span>${String(i+1).padStart(2,'0')}</span><b>${escapeHtml(x.title)}</b></div></article>`).join('');galleryIndex=Math.min(galleryIndex,Math.max(0,items.length-1));if(dots)dots.innerHTML=items.map((_,i)=>`<button type="button" aria-label="Go to gallery image ${i+1}" class="${i===galleryIndex?'active':''}" onclick="galleryGo(${i})"></button>`).join('');updateGalleryPosition();startGalleryAutoSlide();bindGalleryTouch();}
function galleryVisibleCount(){return window.innerWidth<=620?1:window.innerWidth<=980?2:3}
function updateGalleryPosition(){const track=document.getElementById('galleryGrid');const items=getGallery();if(!track||!items.length)return;const count=galleryVisibleCount();const max=Math.max(0,items.length-count);galleryIndex=Math.min(galleryIndex,max);track.style.transform=`translateX(calc(-${galleryIndex} * (100% / ${count}) - ${galleryIndex} * 16px / ${count}))`;document.querySelectorAll('#galleryDots button').forEach((b,i)=>b.classList.toggle('active',i===galleryIndex));}
function galleryNext(){const items=getGallery();if(items.length<=1)return;const max=Math.max(0,items.length-galleryVisibleCount());galleryIndex=galleryIndex>=max?0:galleryIndex+1;updateGalleryPosition();}
function galleryPrev(){const items=getGallery();if(items.length<=1)return;const max=Math.max(0,items.length-galleryVisibleCount());galleryIndex=galleryIndex<=0?max:galleryIndex-1;updateGalleryPosition();}
function galleryGo(i){galleryIndex=i;updateGalleryPosition();startGalleryAutoSlide();}
function startGalleryAutoSlide(){clearInterval(galleryTimer);const items=getGallery();if(items.length>galleryVisibleCount())galleryTimer=setInterval(galleryNext,4000);}
function bindGalleryTouch(){const viewport=document.querySelector('.gallery-viewport');if(!viewport||viewport.dataset.touchBound)return;viewport.dataset.touchBound='1';viewport.addEventListener('touchstart',e=>{galleryTouchStartX=e.touches[0].clientX;galleryTouchDeltaX=0;clearInterval(galleryTimer)},{passive:true});viewport.addEventListener('touchmove',e=>{galleryTouchDeltaX=e.touches[0].clientX-galleryTouchStartX},{passive:true});viewport.addEventListener('touchend',()=>{if(Math.abs(galleryTouchDeltaX)>45){galleryTouchDeltaX<0?galleryNext():galleryPrev()}startGalleryAutoSlide()});}
window.addEventListener('resize',()=>{updateGalleryPosition();startGalleryAutoSlide()});
function renderAdmin(){const logged=sessionStorage.getItem('krAdmin')==='true';document.getElementById('adminLogin').hidden=logged;document.getElementById('adminPanel').hidden=!logged;if(logged){renderAdminList()} }
function renderAdminList(){const el=document.getElementById('adminGalleryList');if(!el||sessionStorage.getItem('krAdmin')!=='true')return;const g=getGallery();el.innerHTML=g.map((x,i)=>`<div class="admin-row"><img src="${escapeAttr(x.url)}" alt=""><span>${escapeHtml(x.title)}</span><button type="button" onclick="removeGallery(${i})">Remove</button></div>`).join('')}
function removeGallery(i){const g=getGallery();g.splice(i,1);saveGallery(g)}
function adminLogout(){sessionStorage.removeItem('krAdmin');renderAdmin()}
const galleryFile=document.getElementById('galleryFile');
const galleryPreview=document.getElementById('galleryPreview');
const galleryPreviewImg=document.getElementById('galleryPreviewImg');
const galleryFileName=document.getElementById('galleryFileName');
const MAX_IMAGE_SIZE=5*1024*1024;
let selectedGalleryFile=null;

galleryFile.addEventListener('change',()=>{
  const file=galleryFile.files&&galleryFile.files[0];
  if(!file)return;
  if(!file.type.startsWith('image/')){galleryFile.value='';selectedGalleryFile=null;galleryPreview.hidden=true;alert('Please select an image file.');return;}
  if(file.size>MAX_IMAGE_SIZE){galleryFile.value='';selectedGalleryFile=null;galleryPreview.hidden=true;alert('Image must be 5 MB or smaller.');return;}
  selectedGalleryFile=file;
  galleryFileName.textContent=file.name;
  galleryPreviewImg.src=URL.createObjectURL(file);
  galleryPreview.hidden=false;
});

document.getElementById('galleryForm').addEventListener('submit',e=>{
  e.preventDefault();
  const title=document.getElementById('galleryTitle').value.trim();
  const file=selectedGalleryFile;
  if(!title||!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    const g=getGallery();
    g.push({title,url:reader.result});
    try{saveGallery(g);e.target.reset();selectedGalleryFile=null;galleryPreview.hidden=true;galleryPreviewImg.removeAttribute('src');galleryFileName.textContent='';}
    catch(err){alert('The image could not be saved in this browser. Try a smaller image.');}
  };
  reader.readAsDataURL(file);
});
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}function escapeAttr(v){return escapeHtml(v)}
renderGallery();
