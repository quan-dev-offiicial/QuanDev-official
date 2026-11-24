'use strict';
/** Quân Dev — static-site functionality, no server required for calculator/demos.
 * Contact requests are sent to the configured FormSubmit account ONLY after explicit consent.
 */
const SETTINGS = Object.freeze({
  email: 'minhquanhangtran@gmail.com',
  formEndpoint: 'https://formsubmit.co/ajax/minhquanhangtran@gmail.com',
  site: 'https://quan-dev-offiicial.github.io/QuanDev-official/'
});
const PLANS = Object.freeze({
  landing: {name:'Landing Page',base:790000,included:1},
  business:{name:'Website doanh nghiệp',base:1490000,included:4},
  catalog: {name:'Catalog bán hàng',base:1990000,included:2},
  portfolio:{name:'Portfolio cá nhân',base:990000,included:2}
});
const EXTRA_PAGE = 250000, FORM_ADDON = 250000, CART_ADDON = 300000;
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat('vi-VN').format(n)+'đ';
const state = {plan:'landing',pages:1,form:false,cart:false,seo:false,advanced:false};
let toastTimeout;
function toast(message){const t=$('toast'); if(!t)return; t.textContent=message;t.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.classList.remove('show'),3000);}
async function copy(text){
  try{await navigator.clipboard.writeText(text);toast('Đã sao chép nội dung.');return true;}
  catch(e){
    const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.append(ta);ta.select();let ok=false;
    try{ok=document.execCommand('copy');}catch(err){}ta.remove();
    toast(ok?'Đã sao chép.':'Không sao chép tự động được. Hãy mở email để gửi.');return ok;
  }
}
function getQuote(){
  const p=PLANS[state.plan]; const extra=Math.max(0,state.pages-p.included);
  const lines=[['Gói '+p.name+' ('+p.included+' trang)',p.base]];
  if(extra>0)lines.push([extra+' trang bổ sung',extra*EXTRA_PAGE]);
  if(state.form)lines.push(['Form liên hệ email',FORM_ADDON]);
  if(state.plan==='catalog'&&state.cart)lines.push(['Giỏ hàng lưu trên trình duyệt',CART_ADDON]);
  const needCustom=state.seo||state.advanced;
  return {p,lines,total:lines.reduce((sum,line)=>sum+line[1],0),needCustom};
}
function quoteText(){
  const q=getQuote();return [
    'QUÂN DEV — TÓM TẮT ƯỚC TÍNH (KHÔNG PHẢI BÁO GIÁ CHÍNH THỨC)',
    'Ngày: '+new Date().toLocaleDateString('vi-VN'),
    'Loại website: '+q.p.name,'Số trang dự kiến: '+state.pages,
    ...q.lines.map(line=>'- '+line[0]+': '+money(line[1])),
    'TỔNG PHẦN CÓ THỂ ƯỚC TÍNH: '+money(q.total),
    q.needCustom?'Yêu cầu nâng cao: có — cần khảo sát và báo giá riêng.':'Yêu cầu nâng cao: chưa chọn.',
    'Tên miền / hosting: chưa bao gồm.','Bảo trì, sửa đổi và thời gian giao: thống nhất riêng.',
    'Lưu ý: mức giá tham khảo, không phải cam kết thanh toán.',
    'Liên hệ: '+SETTINGS.email+' | Zalo 0975 853 340'
  ].join('\n');
}
function renderQuote(){
  const q=getQuote();
  document.querySelectorAll('.plan-chip').forEach(button=>{
    const selected=button.dataset.plan===state.plan;
    button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));
  });
  $('pageCount').textContent=String(state.pages);
  $('pageIncluded').textContent='Gói đã bao gồm '+q.p.included+' trang';
  $('pageMinus').disabled=state.pages<=q.p.included;
  $('pagePlus').disabled=state.pages>=20;
  $('cartOption').hidden=state.plan!=='catalog';
  $('optForm').checked=state.form;$('optCart').checked=state.cart;
  $('optSeo').checked=state.seo;$('optAdvanced').checked=state.advanced;
  $('estimateTotal').textContent=money(q.total)+(q.needCustom?' +':'');
  $('estimateTag').textContent=q.p.name+' · '+state.pages+' trang';
  const container=$('estimateLines');container.replaceChildren();
  for(const [label,price] of q.lines){
    const div=document.createElement('div');div.className='estimate-line';
    const title=document.createElement('span');title.textContent=label;
    const value=document.createElement('strong');value.textContent=money(price);
    div.append(title,value);container.append(div);
  }
  if(q.needCustom){
    const div=document.createElement('div');div.className='estimate-line';const label=document.createElement('span');label.textContent='SEO nâng cao / tính năng riêng';
    const value=document.createElement('strong');value.textContent='Báo giá riêng';div.append(label,value);container.append(div);
  }
  $('estimateCaution').textContent=q.needCustom
    ? 'Phần giá phía trên CHƯA tính các tính năng cần báo giá riêng, domain/hosting và bảo trì. Vui lòng gửi yêu cầu để nhận chi phí thực tế.'
    : 'Giá tham khảo theo phạm vi cơ bản, chưa gồm domain/hosting, bảo trì dài hạn và phát sinh. Báo giá chính thức phải được xác nhận riêng.';
}
function choosePlan(name){if(!Object.hasOwn(PLANS,name))return;state.plan=name;state.pages=PLANS[name].included;state.cart=false;renderQuote();}
function startEstimate(){
  document.querySelectorAll('.plan-chip').forEach(el=>el.addEventListener('click',()=>choosePlan(el.dataset.plan)));
  document.querySelectorAll('[data-plan]:not(.plan-chip)').forEach(el=>el.addEventListener('click',()=>choosePlan(el.dataset.plan)));
  $('pageMinus').addEventListener('click',()=>{state.pages=Math.max(PLANS[state.plan].included,state.pages-1);renderQuote();});
  $('pagePlus').addEventListener('click',()=>{state.pages=Math.min(20,state.pages+1);renderQuote();});
  for(const [id,key] of [['optForm','form'],['optCart','cart'],['optSeo','seo'],['optAdvanced','advanced']]){
    $(id).addEventListener('change',e=>{state[key]=e.target.checked;renderQuote();});
  }
  $('copyQuote').addEventListener('click',()=>copy(quoteText()));
  $('downloadQuote').addEventListener('click',()=>{
    const blob=new Blob([quoteText()],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='QuanDev-uoc-tinh-'+new Date().toISOString().slice(0,10)+'.txt';
    document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Đã tạo bản ước tính tải về.');
  });
  $('requestQuote').addEventListener('click',()=>{
    const select=$('clientType');select.value=PLANS[state.plan].name;
    const msg=$('clientMessage'),newText=quoteText();
    msg.value=msg.value.trim()?msg.value.trim()+'\n\n--- CẤU HÌNH ĐƯỢC CHỌN ---\n'+newText:newText;
    $('contact').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    toast('Đã chuyển cấu hình xuống biểu mẫu liên hệ.');
  });
  renderQuote();
}
function briefText(){
  const form=$('briefForm');const values=new FormData(form);
  return ['YÊU CẦU THIẾT KẾ WEBSITE — QUÂN DEV','Tên: '+(values.get('name')||''),'Email: '+(values.get('email')||''),
    'Số liên hệ: '+(values.get('phone')||'Chưa cung cấp'),'Loại website: '+(values.get('project_type')||'Chưa xác định'),
    'Ngân sách: '+(values.get('budget')||'Chưa xác định'),'Nhu cầu: \n'+(values.get('message')||'')].join('\n');
}
function contactMail(){
  const subject=encodeURIComponent('Yêu cầu thiết kế website — Quân Dev');
  const body=encodeURIComponent(briefText());
  window.location.href='mailto:'+SETTINGS.email+'?subject='+subject+'&body='+body;
}
function startContact(){
  $('copyBrief').addEventListener('click',()=>copy(briefText()));
  $('mailBrief').addEventListener('click',contactMail);
  const form=$('briefForm'),status=$('formStatus'),submit=$('formSubmit');let sending=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(sending)return;
    if(!form.reportValidity())return;
    if(!$('clientConsent').checked){$('clientConsent').focus();return;}
    if(($('clientHoney').value||'').trim())return;
    sending=true;submit.disabled=true;submit.firstChild.textContent='Đang gửi yêu cầu... ';
    status.className='form-status';status.textContent='Đang kết nối dịch vụ gửi email…';
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),16000);
    try{
      const data=new FormData(form);data.set('_subject','Quân Dev — Yêu cầu website từ '+String(data.get('name')||''));
      data.set('_captcha','false');data.set('_template','table');
      const resp=await fetch(SETTINGS.formEndpoint,{method:'POST',body:data,headers:{'Accept':'application/json'},signal:controller.signal});
      const responseData=await resp.json().catch(()=>null);
      if(!resp.ok || !responseData || !(responseData.success===true||responseData.success==='true'))throw new Error('Cannot confirm email delivery');
      status.className='form-status success';status.textContent='Dịch vụ đã xác nhận tiếp nhận yêu cầu. Quân Dev sẽ phản hồi qua thông tin bạn cung cấp.';
      form.reset();
    }catch(error){
      status.className='form-status error';status.textContent='Chưa xác nhận gửi thành công (có thể do mạng hoặc email FormSubmit chưa kích hoạt). Hãy bấm “Mở ứng dụng email” hoặc sao chép nội dung gửi qua Zalo.';
    }finally{clearTimeout(timeout);sending=false;submit.disabled=false;submit.firstChild.textContent='Gửi yêu cầu ';}
  });
}
function startNavigation(){
  $('currentYear').textContent=String(new Date().getFullYear());
  const toggle=$('navToggle'),links=$('navLinks');
  toggle.addEventListener('click',()=>{
    const open=!links.classList.contains('open');links.classList.toggle('open',open);
    toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');
  });
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{links.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Mở menu');}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){links.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
}
startNavigation();startEstimate();startContact();
