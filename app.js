'use strict';

// QUÂN DEV — independent new build. No dashboard or database is included in this version.
// IMPORTANT: Check the destination email and activate FormSubmit before using commercially.
const SETTINGS = Object.freeze({
  inquiryEmail: 'minhquanhangtran@gmail.com',
  formEndpoint: 'https://formsubmit.co/ajax/minhquanhangtran@gmail.com'
});
const PLANS = Object.freeze({
  landing:   {name:'Landing Page',base:790000,included:1},
  business:  {name:'Website doanh nghiệp',base:1490000,included:4},
  catalog:   {name:'Catalog bán hàng',base:1990000,included:2},
  portfolio: {name:'Portfolio cá nhân',base:990000,included:2}
});
const EXTRA_PAGE = 250000;
const ADDON_FORM = 250000;
const ADDON_CART = 300000;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const formatMoney = number => new Intl.NumberFormat('vi-VN').format(number) + 'đ';

const state = {plan:'landing',pages:1,form:false,cart:false,advanced:false};
const planName = () => PLANS[state.plan].name;
function quoteState(){
  const p = PLANS[state.plan];
  const extraPages = Math.max(0,state.pages-p.included);
  const total = p.base+extraPages*EXTRA_PAGE+(state.form?ADDON_FORM:0)+(state.cart&&state.plan==='catalog'?ADDON_CART:0);
  const lines = [
    {label:'Gói cơ bản ('+p.included+' trang)',value:p.base},
    {label:extraPages+' trang bổ sung',value:extraPages*EXTRA_PAGE}
  ];
  if(state.form) lines.push({label:'Form gửi email',value:ADDON_FORM});
  if(state.cart && state.plan==='catalog') lines.push({label:'Giỏ hàng trên thiết bị',value:ADDON_CART});
  return {total,lines,advanced:state.advanced};
}
function renderQuote(){
  const p=PLANS[state.plan];
  const quote=quoteState();
  $$('#planOptions .plan-option').forEach(button=>{
    const active=button.dataset.plan===state.plan;
    button.classList.toggle('active',active);
    button.setAttribute('aria-pressed',String(active));
  });
  $('#pageCount').textContent=String(state.pages);
  $('#includedNote').textContent=`Gói ${p.name} đã bao gồm ${p.included} trang. Trang thêm: ${formatMoney(EXTRA_PAGE)}/trang.`;
  $('#decreasePages').disabled=state.pages<=p.included;
  $('#increasePages').disabled=state.pages>=10;
  $('#cartFeature').hidden=state.plan!=='catalog';
  $('#addForm').checked=state.form;
  $('#addCart').checked=state.cart;
  $('#advancedFeature').checked=state.advanced;
  $('#estimatePrice').textContent=quote.advanced?'Cần tư vấn riêng':formatMoney(quote.total);
  $('#estimateDescription').textContent=`${p.name} · ${state.pages} trang${quote.advanced?' · Có tính năng nâng cao':''}`;
  $('#estimateBreakdown').replaceChildren(...quote.lines.map(item=>{
    const el=document.createElement('div');
    const label=document.createElement('span');label.textContent=item.label;
    const price=document.createElement('b');price.textContent=formatMoney(item.value);
    el.append(label,price);return el;
  }));
}
function choosePlan(plan){
  if(!Object.prototype.hasOwnProperty.call(PLANS,plan))return;
  state.plan=plan;state.pages=PLANS[plan].included;
  if(plan!=='catalog')state.cart=false;
  renderQuote();
}
$$('#planOptions .plan-option').forEach(b=>b.addEventListener('click',()=>choosePlan(b.dataset.plan)));
$('#decreasePages').addEventListener('click',()=>{state.pages=Math.max(PLANS[state.plan].included,state.pages-1);renderQuote()});
$('#increasePages').addEventListener('click',()=>{state.pages=Math.min(10,state.pages+1);renderQuote()});
$('#addForm').addEventListener('change',e=>{state.form=e.target.checked;renderQuote()});
$('#addCart').addEventListener('change',e=>{state.cart=e.target.checked;renderQuote()});
$('#advancedFeature').addEventListener('change',e=>{state.advanced=e.target.checked;renderQuote()});
$$('[data-choose-plan]').forEach(link=>link.addEventListener('click',()=>choosePlan(link.dataset.choosePlan)));

function quoteSummary(){
  const q=quoteState();
  const options=[state.form?'Có form gửi email':null,(state.cart&&state.plan==='catalog')?'Có giỏ hàng trên thiết bị':null,state.advanced?'Có tính năng nâng cao, cần tư vấn':null].filter(Boolean);
  return [
    `Loại website: ${planName()}`,
    `Số trang dự kiến: ${state.pages}`,
    `Tính năng thêm: ${options.join('; ')||'Không chọn'}`,
    `Dự toán tham khảo: ${q.advanced?'Cần tư vấn riêng':formatMoney(q.total)}`,
    'Lưu ý: Giá dự kiến, chưa gồm tên miền, hosting và yêu cầu ngoài phạm vi.'
  ].join('\n');
}
$('#useEstimate').addEventListener('click',()=>{
  const projectValues={landing:'Landing Page',business:'Website doanh nghiệp',catalog:'Catalog bán hàng',portfolio:'Portfolio cá nhân'};
  $('#clientProjectType').value=projectValues[state.plan];
  const existing=$('#clientMessage').value.trim();
  const sep='\n\n';
  if(!existing.includes('Dự toán tham khảo:'))$('#clientMessage').value=(existing?existing+sep:'')+'[CẤU HÌNH ƯỚC TÍNH]\n'+quoteSummary();
  else {$('#clientMessage').value=existing.replace(/\[CẤU HÌNH ƯỚC TÍNH\][\s\S]*/,'[CẤU HÌNH ƯỚC TÍNH]\n'+quoteSummary())}
  $('#contact').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  showToast('Đã chuyển cấu hình sang biểu mẫu yêu cầu.');
});

// Filtering real sample projects, with explicit status labels.
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const chosen=button.dataset.filter;
  $$('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
  $$('#projectGrid .project-card').forEach(card=>{card.hidden=chosen!=='all'&&card.dataset.category!==chosen});
}));

const CASES={
  lam:{tag:'CASE STUDY / SAMPLE PROJECT',title:'Lam Handmade',status:'Website đã public',html:`<p>Lam Handmade là website giới thiệu và trưng bày sản phẩm thủ công Macramé. Trọng tâm là hình ảnh sản phẩm, điều hướng dễ hiểu và một trải nghiệm duyệt hàng gọn gàng.</p><h3>Phạm vi minh họa</h3><ul><li>Danh mục và các khu vực giới thiệu sản phẩm.</li><li>Giao diện tương thích nhiều kích thước màn hình.</li><li>Giỏ hàng lưu trên thiết bị và luồng liên hệ đặt hàng.</li></ul><p>Đây là dự án mẫu trong portfolio Quân Dev; không mặc định là một hợp đồng thương mại đã bàn giao.</p><p><a target="_blank" rel="noopener noreferrer" href="https://quan-dev-offiicial.github.io/Lam_Handmade/">Trải nghiệm Lam Handmade ↗</a></p>`},
  baba:{tag:'CASE STUDY / SAMPLE PROJECT',title:'Bánh Bèo Bà Ba',status:'Website đã public',html:`<p>Website giới thiệu thương hiệu ẩm thực địa phương, đặt trọng tâm vào bản sắc thương hiệu, thực đơn dễ xem và đường dẫn liên hệ rõ ràng.</p><h3>Phạm vi minh họa</h3><ul><li>Giới thiệu câu chuyện và hình ảnh thương hiệu.</li><li>Thực đơn và nội dung sản phẩm.</li><li>Tương thích điện thoại và điều hướng liên hệ/đặt món.</li></ul><p>Đây là một sản phẩm dùng để chứng minh hướng thiết kế và cách triển khai. Trạng thái bàn giao thương mại không được khẳng định.</p><p><a target="_blank" rel="noopener noreferrer" href="https://banhbeobaba.github.io/banh-beo-ba-ba-v1/">Trải nghiệm Bánh Bèo Bà Ba ↗</a></p>`},
  history:{tag:'EXPERIMENTAL PROJECT / IN DEVELOPMENT',title:'Dòng Sử Việt',status:'Đang phát triển',html:`<p>Dòng Sử Việt là ý tưởng về một không gian khám phá lịch sử Việt Nam thông qua dòng thời gian, bản đồ và những câu chuyện tương tác.</p><h3>Hướng phát triển</h3><ul><li>Đặt sự kiện lịch sử vào bối cảnh thời gian và địa lý.</li><li>Trình bày kiến thức theo hành trình khám phá.</li><li>Thử nghiệm cách kết hợp nghiên cứu với tương tác trực quan.</li></ul><p>Dự án hiện chưa có bản hoàn chỉnh để công khai, chưa có ngày phát hành được cam kết. Phần mô tả thể hiện định hướng, không phải danh sách chức năng đã nghiệm thu.</p>`}
};
const ARTICLES={
  facebook:{tag:'QUÂN DEV JOURNAL / KIẾN THỨC CƠ BẢN',title:'Có Facebook rồi, vì sao vẫn cần website?',html:`<p>Facebook rất tiện để bắt đầu kinh doanh: đăng bài nhanh, nhắn tin dễ và tiếp cận khách hàng thông qua nội dung. Nhưng trang cá nhân hoặc Fanpage không thay thế được mọi vai trò của website.</p><h3>Website giúp tập trung thông tin</h3><p>Một khách mới có thể muốn xem toàn bộ dịch vụ, bảng giá, sản phẩm, địa chỉ hoặc chính sách của bạn. Website giúp sắp xếp chúng thành các khu vực rõ ràng, thay vì phải tìm lại giữa các bài đăng.</p><h3>Bạn có quyền chủ động hơn</h3><p>Website có tên miền riêng cho phép bạn kiểm soát bố cục, cách trình bày và luồng gửi yêu cầu. Tuy vậy, vẫn phải tính đến chi phí lưu trữ, bảo trì và quảng bá.</p><h3>Không cần chọn một trong hai</h3><p>Với nhiều cửa hàng nhỏ, cách hợp lý là dùng Facebook để tiếp cận và trò chuyện, website để giới thiệu tập trung, đồng thời gắn nút Messenger/Zalo để khách liên hệ.</p><p><strong>Kết luận:</strong> Chỉ nên đầu tư website nếu nó giải quyết được một nhu cầu cụ thể, không phải chỉ vì người khác đều có.</p>`},
  cost:{tag:'QUÂN DEV JOURNAL / NGÂN SÁCH',title:'Một website cần trả những khoản phí nào?',html:`<p>Khi nghe báo giá làm website, bạn cần hỏi rõ giá đó đã bao gồm những gì. Số tiền thiết kế một lần không nhất thiết là tổng chi phí sở hữu lâu dài.</p><h3>1. Phí thiết kế và phát triển</h3><p>Gồm giao diện, số lượng trang, tính năng và nội dung trong phạm vi đã thống nhất. Chức năng quản trị, thanh toán hay tích hợp đặc biệt có thể cần báo riêng.</p><h3>2. Tên miền và lưu trữ</h3><p>Tên miền là địa chỉ truy cập. Hosting là nơi website chạy hoặc lưu nội dung. Nhiều dịch vụ thu phí theo tháng hoặc năm; một số website tĩnh có thể dùng gói miễn phí trong giới hạn cho phép.</p><h3>3. Bảo trì và cập nhật</h3><p>Sửa lỗi trong phạm vi bảo hành khác với việc thêm chức năng mới, đổi toàn bộ thiết kế hoặc duy trì nội dung hằng tháng.</p><h3>4. Dịch vụ của bên thứ ba</h3><p>Email gửi biểu mẫu, lưu trữ ảnh, thanh toán, bản đồ và những API khác có thể phát sinh chi phí theo mức sử dụng.</p><p><strong>Lời khuyên:</strong> Yêu cầu bảng phạm vi và bảng chi phí duy trì trước khi thanh toán cọc.</p>`},
  conversion:{tag:'QUÂN DEV JOURNAL / TRẢI NGHIỆM',title:'Website đẹp nhưng khách không liên hệ: vì sao?',html:`<p>Một giao diện đẹp có thể tạo ấn tượng, nhưng chưa đủ để mang lại cuộc trò chuyện hay đơn hàng. Điều quan trọng là khách hiểu được họ nhận gì và phải làm gì tiếp theo.</p><h3>Thông điệp chưa rõ</h3><p>Người truy cập thường muốn biết ngay doanh nghiệp cung cấp gì, cho ai và khác biệt ra sao. Những dòng khẩu hiệu hoa mỹ không thay thế được thông tin này.</p><h3>Thiếu bằng chứng</h3><p>Dự án mẫu, ảnh chụp thực tế, quy trình và nội dung minh bạch thường thuyết phục hơn những lời cam kết chung chung. Đừng bịa lượt khách hoặc nhận xét để tạo uy tín.</p><h3>Khó liên hệ trên điện thoại</h3><p>Nếu nút gọi, email, Zalo hoặc biểu mẫu bị ẩn quá sâu, nhiều người sẽ bỏ cuộc. Hãy thử tự gửi một yêu cầu từ điện thoại như một khách hàng mới.</p><h3>Quá nhiều câu hỏi</h3><p>Biểu mẫu nên thu thập đủ thông tin để bắt đầu tư vấn, nhưng không nên buộc khách chuẩn bị cả bản đặc tả kỹ thuật.</p><p><strong>Kết luận:</strong> Thiết kế tốt giúp hành động cần thiết trở nên rõ ràng và dễ thực hiện.</p>`}
};
const detailDialog=$('#detailDialog');
let priorFocus=null;
function openDetail(data){
  priorFocus=document.activeElement;
  $('#dialogTag').textContent=data.tag;
  $('#dialogBody').innerHTML=`<span class="dialog-pill">${data.status||'GÓC KIẾN THỨC'}</span><h2 id="dialogTitle">${data.title}</h2>${data.html}`;
  detailDialog.showModal();
  document.body.classList.add('dialog-open');
  $('#closeDialog').focus();
}
$$('[data-case]').forEach(button=>button.addEventListener('click',()=>openDetail(CASES[button.dataset.case])));
$$('[data-article]').forEach(button=>button.addEventListener('click',()=>openDetail(ARTICLES[button.dataset.article])));
$('#closeDialog').addEventListener('click',()=>detailDialog.close());
detailDialog.addEventListener('click',event=>{if(event.target===detailDialog)detailDialog.close()});
detailDialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');priorFocus?.focus?.()});

// Header navigation.
const navToggle=$('.nav-toggle');
const nav=$('#mainNav');
function closeNav(){nav.classList.remove('open');navToggle.setAttribute('aria-expanded','false');navToggle.setAttribute('aria-label','Mở menu')}
navToggle.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(isOpen));navToggle.setAttribute('aria-label',isOpen?'Đóng menu':'Mở menu')});
$$('#mainNav a').forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeNav()});

let toastTimer;
function showToast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3400)}
function briefText(){
  const f=$('#briefForm');
  return [`YÊU CẦU TƯ VẤN — QUÂN DEV`,`Khách hàng: ${f.elements.name.value.trim()}`,`Email: ${f.elements.email.value.trim()}`,`Số liên hệ: ${f.elements.phone.value.trim()}`,`Loại website: ${f.elements.project_type.value}`,`Ngân sách: ${f.elements.budget.value}`,`Mô tả:\n${f.elements.message.value.trim()}`].join('\n');
}
async function copyText(text){
  if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text);return}
  const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:0;top:0;opacity:0';document.body.append(ta);ta.focus();ta.select();const worked=document.execCommand('copy');ta.remove();if(!worked)throw new Error('Clipboard unavailable');
}
$('#copyBrief').addEventListener('click',async()=>{try{await copyText(briefText());showToast('Đã sao chép. Mở Gmail để gửi nội dung này.')}catch(e){showToast('Không thể sao chép tự động; hãy gửi yêu cầu qua email.')}});

// Send a real inquiry via a third-party form-to-email service. No fake success states.
const briefForm=$('#briefForm');
const formStatus=$('#formStatus');
const submitButton=$('#submitBrief');
let sending=false;
briefForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending)return;
  formStatus.textContent='';formStatus.className='form-status';
  if(!briefForm.checkValidity()){briefForm.reportValidity();return}
  if($('#websiteTrap').value.trim())return; // honeypot
  const email=$('#clientEmail').value.trim();
  const phone=$('#clientPhone').value.trim();
  if(phone.replace(/[^\d]/g,'').length<9){$('#clientPhone').setCustomValidity('Vui lòng nhập số liên hệ hợp lệ');briefForm.reportValidity();$('#clientPhone').setCustomValidity('');return}
  const fields=new FormData();
  fields.append('name',$('#clientName').value.trim());
  fields.append('email',email);
  fields.append('phone',phone);
  fields.append('project_type',$('#clientProjectType').value);
  fields.append('budget',$('#clientBudget').value);
  fields.append('message',$('#clientMessage').value.trim());
  fields.append('_subject','[QUÂN DEV] Yêu cầu website mới — '+$('#clientProjectType').value);
  fields.append('_template','table');
  fields.append('_captcha','false'); // Protected instead by hidden honeypot; add server-side protections if traffic increases.
  fields.append('_honey','');
  sending=true;submitButton.disabled=true;submitButton.querySelector('span:first-child').textContent='Đang gửi yêu cầu...';
  formStatus.textContent='Đang kết nối dịch vụ gửi email...';
  try{
    const response=await fetch(SETTINGS.formEndpoint,{method:'POST',body:fields,headers:{'Accept':'application/json'}});
    let data={};try{data=await response.json()}catch(_){/* empty/non-JSON treated based on HTTP */}
    const errorFromService=data.success===false||data.success==='false'||data.error;
    if(!response.ok||errorFromService)throw new Error(typeof data.message==='string'?data.message:'Máy chủ gửi email từ chối yêu cầu.');
    formStatus.textContent='Đã gửi yêu cầu tới dịch vụ tiếp nhận. Quân Dev sẽ kiểm tra email và liên hệ lại khi nhận được thông tin.';
    formStatus.className='form-status success';
    briefForm.reset();
  }catch(error){
    formStatus.textContent='Chưa thể xác nhận yêu cầu đã được gửi. Vui lòng sao chép nội dung rồi gửi trực tiếp đến '+SETTINGS.inquiryEmail+'.';
    formStatus.className='form-status error';
  }finally{
    sending=false;submitButton.disabled=false;submitButton.querySelector('span:first-child').textContent='Gửi yêu cầu thiết kế';
  }
});
$('#year').textContent=String(new Date().getFullYear());
renderQuote();


// QUÂN DEV MOTION SYSTEM — gentle scroll reveals, scroll progress, and optional pointer spotlight.
(function initQuanDevMotion(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const progress=document.getElementById('readingProgress');
  let scrollScheduled=false;
  function updateScrollProgress(){
    scrollScheduled=false;
    if(!progress)return;
    const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
    const pct=Math.min(1,Math.max(0,window.scrollY/max));
    progress.style.transform=`scaleX(${pct})`;
  }
  function scheduleScroll(){
    if(scrollScheduled)return;
    scrollScheduled=true;
    window.requestAnimationFrame(updateScrollProgress);
  }
  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleScroll,{passive:true});
  updateScrollProgress();
  if(reduced.matches)return;

  if('IntersectionObserver' in window){
    const targets=[...document.querySelectorAll(
      '.section-heading, .project-card, .service-card, .approach-list > div, .steps-grid .step, .blog-card, .review-content, .faq-items, .contact-copy, .brief-form'
    )];
    targets.forEach(node=>{
      node.classList.add('motion-reveal');
      const siblingIndex=[...node.parentElement.children].indexOf(node);
      node.style.setProperty('--motion-delay',`${Math.min(3,siblingIndex)*75}ms`);
    });
    document.documentElement.classList.add('motion-active');
    const io=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting){
          entry.target.classList.add('motion-visible');
          io.unobserve(entry.target);
        }
      }
    },{threshold:0.07,rootMargin:'0px 0px -30px 0px'});
    targets.forEach(node=>io.observe(node));
    reduced.addEventListener?.('change',()=>{
      if(reduced.matches){document.documentElement.classList.remove('motion-active');io.disconnect();}
    });
  }

  // A soft spotlight tracks the pointer; touch users and reduced-motion users skip it.
  const visual=document.querySelector('.hero-visual');
  if(visual && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    let pending=false,px=50,py=50;
    visual.addEventListener('pointermove',event=>{
      const bounds=visual.getBoundingClientRect();
      px=((event.clientX-bounds.left)/bounds.width*100).toFixed(1)+'%';
      py=((event.clientY-bounds.top)/bounds.height*100).toFixed(1)+'%';
      if(pending)return;
      pending=true;
      requestAnimationFrame(()=>{visual.style.setProperty('--spot-x',px);visual.style.setProperty('--spot-y',py);pending=false;});
    },{passive:true});
  }
  const price=document.getElementById('estimatePrice');
  if(price && 'MutationObserver' in window){
    let initial=price.textContent;
    new MutationObserver(()=>{
      const next=price.textContent;
      if(next===initial)return;
      initial=next;
      price.classList.remove('price-change');
      void price.offsetWidth; // replay only when a different price has been calculated
      price.classList.add('price-change');
    }).observe(price,{characterData:true,childList:true,subtree:true});
  }
})();
