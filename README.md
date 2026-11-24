# QUÂN DEV — Studio Edition V3 (24/11/2026)

**Nâng cấp thực sự từ hướng nội dung/source của repository** `quan-dev-offiicial/QuanDev-official` (GitHub Pages). Bản này có thiết kế editorial cream / forest / terracotta, thay cho bố cục dark-dashboard cũ. Không dùng framework, không build step và không phụ thuộc CDN để render website.

## Những gì ĐÃ HOÀN THÀNH trong source

- Trang chủ thiết kế mới hoàn toàn, responsive, menu mobile và trạng thái focus keyboard.
- 3 case study thật về **những dự án do Quân Dev xây/đang nghiên cứu**. Giữ nhãn rõ: Lam Handmade và Bánh Bèo Bà Ba là website mẫu; Dòng Sử Việt vẫn đang phát triển. **Không bịa KPI, khách hàng, đánh giá hoặc giao dịch.**
- 4 demo có thao tác THẬT và dữ liệu giả để minh họa: `demos/am-thuc/` (lọc menu + giỏ mẫu), `demos/homestay/` (chọn phòng/ngày và phiếu mẫu), `demos/barber/` (chọn dịch vụ/giờ và phiếu mẫu), `demos/catalog/` (lọc sản phẩm + giỏ mẫu). Không phải đặt chỗ hoặc thanh toán thật; các trang đã noindex.
- Bộ tính giá hoạt động trên trình duyệt: 4 gói, số trang, form, giỏ hàng, cờ yêu cầu SEO/đăng nhập nâng cao; bảng chi tiết; sao chép, tải TXT, chuyển cấu hình xuống form. Mức giá **GIỮ TỪ SOURCE GỐC**, phải xác nhận trước khi giao dịch.
- Form yêu cầu dùng FormSubmit AJAX, kiểm tra dữ liệu và consent, trạng thái chờ, lỗi, thành công thật theo response, honeypot; fallback sao chép/email/Zalo.
- 3 bài viết nội dung hữu ích; FAQ, quy trình, chính sách quyền riêng tư.
- SEO kỹ thuật: title/description riêng, canonical đúng URL GitHub Pages hiện tại, OG card, sitemap/robots, schema cơ bản, 404, semantic HTML.
- Performance: không cần thư viện JS bên ngoài, không gọi Google Fonts, icon/screenshot bằng CSS, ảnh OG nội bộ, phù hợp laptop/điện thoại yếu.
- Accessibility: skip link, semantic landmarks, input labels, focus states, menu ARIA, `prefers-reduced-motion`.

## Những điều CẦN THỰC HIỆN NGOÀI SOURCE (không được gọi là đã xong)

1. **FormSubmit**: `app.js` gửi tới `https://formsubmit.co/ajax/minhquanhangtran@gmail.com`. Chủ email phải xác minh/kích hoạt FormSubmit, gửi mẫu với internet và kiểm tra hộp thư spam. Chưa kiểm thử việc nhận mail thật trên hòm thư. Không có database lưu lead trên máy chủ.
2. **Thống kê lượt truy cập/nhấp/gửi**: cần kết nối dịch vụ analytics (chẳng hạn Cloudflare Web Analytics hoặc một endpoint riêng) và cập nhật quyền riêng tư. Không đưa số lượt giả. Hiện chưa triển khai tracking global để giữ privacy-by-default.
3. **Hệ thống đăng nhập khách, dashboard realtime, thanh toán**: cần backend/database/Auth server và cấu hình quyền bảo mật. GitHub Pages chỉ host tĩnh, không thể triển khai backend đó bằng HTML thuần.
4. **Chính sách bán hàng**: xác nhận giá, bảo hành, chính sách sửa đổi, quyền sở hữu, tên miền/hosting với chủ dự án trước khi coi là cam kết chính thức.
5. **Liên kết website mẫu**: xác nhận Lam Handmade và Bánh Bèo Bà Ba đang truy cập được. Các URL được giữ từ source gốc, không thể bảo đảm chúng còn live.
6. **Ảnh chụp sản phẩm/feedback**: thay các bản đồ họa mô phỏng bằng screenshot thật của sản phẩm nếu có; chỉ thêm lời đánh giá đã được khách xác nhận.

## Deploy lên GitHub Pages

Repository hiện tại: https://github.com/quan-dev-offiicial/QuanDev-official
Site dự kiến: https://quan-dev-offiicial.github.io/QuanDev-official/

**Quan trọng:** kết nối GitHub trong phiên tạo bản này chỉ có quyền đọc repo đó, nên website đang live **CHƯA được cập nhật tự động**.

1. Tải ZIP, giải nén thành thư mục website. Các file `index.html`, `styles.css`, `app.js`, `inner.js`, `favicon.svg`, `robots.txt`, `sitemap.xml`, `privacy.html`, `404.html` và các thư mục `assets`, `cases`, `journal`, `demos` đều phải nằm **trực tiếp ở root repository**, không được đặt cả ZIP vào repo.
2. An toàn nhất: tạo nhánh backup trước hoặc tải bản ZIP của repository gốc bằng GitHub > Code > Download ZIP.
3. Sử dụng GitHub Desktop, VS Code Git hoặc upload file trong browser để thay thế source tại nhánh `main`. Nếu repo đã có `index (1).html` bản cũ, có thể để nguyên; GitHub Pages dùng `index.html`.
4. Xác nhận `Settings → Pages → Deploy from a branch → main / (root)`. Quan sát Actions nếu build lỗi.
5. Mở URL đã triển khai và test toàn bộ menu, giá, gửi form, demo và mobile. Làm test trên thiết bị thật trước khi quảng cáo.

**Lệnh Git cho developer đã có repo clone:**

```bash
# Thay các file source sau khi backup trước (không xóa nhầm file khách hàng)
git status
git add index.html styles.css app.js inner.js favicon.svg robots.txt sitemap.xml privacy.html 404.html assets cases demos journal README.md
git commit -m "Upgrade Quân Dev to Studio V3"
git push origin main
```

> Nếu muốn giữ lịch sử chuẩn, hãy tạo branch rồi mở PR trước khi merge. Không có backend nào được tự ý thêm vào public repo.

## Kiểm tra nhanh

Chạy `python -m http.server 8080` tại thư mục website, mở `http://localhost:8080/`. Có thể mở `index.html` trực tiếp, nhưng gửi form cần kết nối Internet và xác nhận dịch vụ; thử bằng local server sẽ giống hosting hơn.

**Check:** click 4 plan + tăng/giảm trang; mở/đóng cart option, chọn add-on; tải TXT và kiểm tra số; chuyển cấu hình xuống form; thử 4 demo (lọc menu/sản phẩm, giỏ, yêu cầu phòng, phiếu hẹn); bấm link case/blog; kiểm tra viewport 375px và 1440px; thử mạng chậm; xác minh form gửi tới email thật.

## CRM riêng (file ZIP khác, KHÔNG đăng lên GitHub Pages)

Có thể sử dụng `QuanDev_CRM_OFFLINE.html` trong gói **CRM Private** riêng để ghi khách bằng localStorage, lọc trạng thái và sao lưu JSON/CSV trên máy riêng. Không có server, không có đăng nhập, không đồng bộ. Nếu xóa dữ liệu trình duyệt sẽ mất record chưa backup. Dữ liệu liên hệ khách hàng không được upload công khai.
