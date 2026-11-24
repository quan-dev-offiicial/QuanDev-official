'use strict';
const $ = x => document.getElementById(x),money=n=>new Intl.NumberFormat('vi-VN').format(n)+'đ';
let hide;
function toast(message){const el=$('demoToast');el.textContent=message;el.classList.add('show');clearTimeout(hide);hide=setTimeout(()=>el.classList.remove('show'),2500);}
async function copyText(value){try{await navigator.clipboard.writeText(value);toast('Đã sao chép nội dung mẫu.')}catch(e){toast('Trình duyệt không cho sao chép tự động. Hãy chọn và sao chép thủ công.')}}
const FOOD=[{id:'f1',name:'Bún bò Mơ',group:'mon-chinh',price:59000,icon:'🍜',note:'Nước dùng thơm, rau tươi'},{id:'f2',name:'Cơm gà sả',group:'mon-chinh',price:65000,icon:'🍚',note:'Đùi gà áp chảo, sả'},{id:'f3',name:'Bánh cuốn',group:'mon-chinh',price:45000,icon:'🥟',note:'Ăn sáng nhẹ nhàng'},{id:'f4',name:'Trà đào',group:'do-uong',price:35000,icon:'🍑',note:'Lạnh, vị trái cây'},{id:'f5',name:'Cà phê sữa',group:'do-uong',price:32000,icon:'☕',note:'Rang xay kiểu Việt'},{id:'f6',name:'Chè dừa',group:'trang-mieng',price:39000,icon:'🥥',note:'Dừa non, ít ngọt'}];
const SHOP=[{id:'s1',name:'Bình sứ Curve',group:'decor',price:320000,icon:'🏺'},{id:'s2',name:'Đèn bàn Halo',group:'decor',price:490000,icon:'💡'},{id:'s3',name:'Túi canvas Wave',group:'fashion',price:179000,icon:'👜'},{id:'s4',name:'Áo Mono',group:'fashion',price:290000,icon:'👕'},{id:'s5',name:'Sổ tay Studio',group:'paper',price:69000,icon:'📓'},{id:'s6',name:'Bộ bút Mark',group:'paper',price:89000,icon:'🖊️'}];
function createStore(kind){
 const products=kind==='food'?FOOD:SHOP,cart={},filterBtns=[...document.querySelectorAll('[data-filter]')],grid=$(kind==='food'?'foodMenu':'productGrid'),list=$('cartList'),total=$('cartTotal');
 let active='all';
 function render(){grid.replaceChildren();products.filter(p=>active==='all'||p.group===active).forEach(p=>{
  const div=document.createElement('article');div.className=kind==='food'?'food-item':'product-card';
  if(kind==='food'){
   const emoji=document.createElement('span');emoji.className='food-symbol';emoji.textContent=p.icon;
   const h=document.createElement('h3');h.textContent=p.name;const note=document.createElement('p');note.textContent=p.note;
   const bottom=document.createElement('div');bottom.className='food-price';const price=document.createElement('span');price.textContent=money(p.price);const btn=document.createElement('button');btn.textContent='+';btn.setAttribute('aria-label','Thêm '+p.name);btn.onclick=()=>add(p.id);bottom.append(price,btn);div.append(emoji,h,note,bottom);
  }else{
   const art=document.createElement('div');art.className='product-art';art.textContent=p.icon;const h=document.createElement('h3');h.textContent=p.name;
   const bottom=document.createElement('div');bottom.className='product-bottom';const price=document.createElement('span');price.textContent=money(p.price);const btn=document.createElement('button');btn.textContent='+';btn.setAttribute('aria-label','Thêm '+p.name);btn.onclick=()=>add(p.id);bottom.append(price,btn);div.append(art,h,bottom);
  }grid.append(div);});renderCart();}
 function add(id){cart[id]=(cart[id]||0)+1;renderCart();toast('Đã thêm vào giỏ mẫu.');}
 function renderCart(){list.replaceChildren();let totalValue=0;for(const p of products){if(!cart[p.id])continue;totalValue+=cart[p.id]*p.price;const li=document.createElement('li');const name=document.createElement('span');name.textContent=cart[p.id]+' × '+p.name;const controls=document.createElement('span');const sum=document.createElement('strong');sum.textContent=money(cart[p.id]*p.price);const remove=document.createElement('button');remove.textContent='Xóa';remove.setAttribute('aria-label','Bỏ '+p.name);remove.onclick=()=>{delete cart[p.id];renderCart();};controls.append(sum,document.createTextNode(' '),remove);li.append(name,controls);list.append(li);}if(list.children.length===0){const li=document.createElement('li');li.textContent='Chưa có sản phẩm nào.';list.append(li);}total.textContent=money(totalValue);}
 filterBtns.forEach(btn=>btn.onclick=()=>{active=btn.dataset.filter;filterBtns.forEach(el=>el.classList.toggle('active',el===btn));render();});
 $('cartCopy').onclick=()=>{const lines=products.filter(p=>cart[p.id]).map(p=>cart[p.id]+' × '+p.name+': '+money(cart[p.id]*p.price));if(!lines.length){toast('Hãy chọn ít nhất một món trước.');return;}copyText('GIỎ HÀNG DEMO — KHÔNG PHẢI ĐƠN ĐẶT THẬT\n'+lines.join('\n')+'\nTổng: '+total.textContent);};
 render();
}
function startStay(){
 const rooms=[...document.querySelectorAll('[data-room]')];let chosen=rooms[0].dataset.room;const roomInfo={garden:{name:'Garden Room',price:680000},hill:{name:'Hill Studio',price:890000},suite:{name:'Cloud Suite',price:1250000}};
 rooms.forEach(card=>{card.querySelector('button').onclick=()=>{chosen=card.dataset.room;rooms.forEach(c=>c.classList.toggle('selected',c===card));toast('Đã chọn '+roomInfo[chosen].name);};});
 const today=new Date().toISOString().slice(0,10);$('checkIn').min=today;$('checkOut').min=today;
 $('stayForm').onsubmit=e=>{e.preventDefault();const start=new Date($('checkIn').value+'T00:00:00'),end=new Date($('checkOut').value+'T00:00:00');const days=Math.round((end-start)/86400000);
 if(!Number.isFinite(days)||days<1){toast('Ngày trả phòng phải sau ngày nhận phòng.');return;}const guests=Number($('stayGuests').value);const room=roomInfo[chosen];
 const summary=`YÊU CẦU LƯU TRÚ DEMO — KHÔNG PHẢI ĐẶT PHÒNG THẬT\nPhòng mẫu: ${room.name}\nNhận phòng: ${$('checkIn').value}\nTrả phòng: ${$('checkOut').value}\nSố đêm: ${days}\nKhách: ${guests}\nTổng minh họa: ${money(days*room.price)}\nChưa kiểm tra phòng trống / thuế / phí.`;
 $('stayResult').textContent=summary;$('stayResult').hidden=false;toast('Đã tạo tóm tắt mẫu.');};
 $('stayCopy').onclick=()=>{if($('stayResult').hidden){toast('Hãy tạo tóm tắt trước.');return;}copyText($('stayResult').textContent);};
}
function startBarber(){
 const services=[...document.querySelectorAll('[data-service]')];let chosen=services[0].dataset.service;
 services.forEach(el=>el.onclick=()=>{chosen=el.dataset.service;services.forEach(c=>c.classList.toggle('active',c===el));});
 $('barberDate').min=new Date().toISOString().slice(0,10);
 $('barberForm').onsubmit=e=>{e.preventDefault();const selected=services.find(el=>el.dataset.service===chosen);
 const summary='LỊCH HẸN DEMO — KHÔNG CÓ ĐẶT HẸN THẬT\nDịch vụ: '+selected.querySelector('b').textContent+'\nGiá mẫu: '+selected.querySelector('strong').textContent+'\nNgày: '+$('barberDate').value+'\nGiờ: '+$('barberTime').value+'\nKhông kiểm tra lịch nhân viên hoặc lưu máy chủ.';
 $('barberResult').textContent=summary;$('barberResult').hidden=false;toast('Đã tạo phiếu lịch hẹn mẫu.');};
 $('barberCopy').onclick=()=>{if($('barberResult').hidden){toast('Hãy tạo phiếu trước.');return;}copyText($('barberResult').textContent);};
}
const kind=document.body.dataset.demo;if(kind==='food'||kind==='catalog')createStore(kind);if(kind==='stay')startStay();if(kind==='barber')startBarber();
