# Quân Dev — Website mới (bản MVP, KHÔNG có Dashboard)

Website **mới hoàn toàn**, không sửa/copy mã nguồn từ Quân Dev V6. Dark Premium + responsive. Thiết kế để đăng trên GitHub Pages, Netlify hoặc dịch vụ host tĩnh khác.

## File
- `index.html` — cấu trúc trang.
- `assets/styles.css` — giao diện responsive.
- `assets/app.js` — bộ lọc portfolio, chi tiết dự án, blog, tính giá, gửi form.
- `assets/favicon.svg` — biểu tượng.

## Chức năng đã xây
- Trang chủ, 3 dự án trong Portfolio (2 liên kết website, 1 **đang phát triển**), lọc dự án.
- Dịch vụ, quy trình, FAQ, bài blog có thể đọc ở hộp thoại.
- Tính giá trực tiếp, chi phí cộng thêm, chuyển cấu hình sang biểu mẫu.
- Form gửi yêu cầu về email thông qua FormSubmit AJAX; có kiểm tra đầu vào, đồng ý gửi, trạng thái đang gửi/thành công/lỗi, honeypot, sao chép yêu cầu khi lỗi.
- Giao diện responsive mobile + laptop, menu mobile, cơ bản về accessibility, description và Open Graph.
- Khu vực đánh giá minh bạch: **chưa có lời đánh giá thật, không sử dụng nội dung bịa**.

## Trước khi công khai cho khách
1. **Xác nhận lại email đích** `minhquanhangtran@gmail.com` trong `assets/app.js` và email tại `index.html`.
2. **Xác nhận số điện thoại/Zalo** `0975 853 340` (lấy từ nguồn website cũ); chỉnh nếu đã đổi.
3. Deploy thử lên GitHub Pages hoặc hosting có HTTPS.
4. **Kích hoạt FormSubmit**: Lần gửi đầu có thể kích hoạt email xác nhận. Nếu chưa xác nhận email, khách có thể chưa được nhận thông báo về Gmail. Hãy test gửi thật một lần từ trang đã deploy và kiểm tra cả hộp thư chính lẫn spam.
5. Test tất cả 4 loại gói, tăng giảm trang, addon, chuyển cấu hình sang form.
6. Kiểm tra lại liên kết Lam Handmade `https://quan-dev-offiicial.github.io/Lam_Handmade/` và Bánh Bèo Bà Ba `https://banhbeobaba.github.io/banh-beo-ba-ba-v1/` trên trình duyệt thực tế.
7. Xác minh bảng giá nội bộ trước khi quảng cáo; bảng giá là **đề xuất** và chưa bao gồm tên miền/hosting.
8. Sau khi mua tên miền, bổ sung canonical, `og:url`, sitemap với URL mới.
9. Bổ sung chính sách quyền riêng tư đầy đủ nếu triển khai thương mại; FormSubmit là dịch vụ gửi dữ liệu bên thứ ba.

## Giới hạn hiện tại
- Không có Dashboard / backend / database. Form yêu cầu **chỉ chuyển qua Gmail**, không có bản lưu riêng trên máy chủ.
- Gửi form thất bại: hiện cảnh báo và nút sao chép nội dung; không hiển thị thông báo thành công giả.
- FormSubmit cần được kích hoạt và chạy qua mạng. Mở file HTML offline vẫn xem được giao diện và tính giá, **không gửi email khi offline**.
- Không có hệ thống blog CMS hoặc review CMS: bài viết được lưu trong JS, muốn sửa cần chỉnh code. Phần đánh giá không bịa nội dung.
- Tên miền, hosting, các gói trả phí và tính năng nâng cao chưa được triển khai.
- Giá gốc trong JS: Landing 790k, Doanh nghiệp 1.49tr, Catalog 1.99tr, Portfolio 990k; trang thêm +250k, form +250k, giỏ hàng trên thiết bị +300k. Phạm vi cần báo giá riêng khi có chức năng nâng cao.

## Đăng GitHub Pages nhanh
Tạo **repository mới**, tải 2 mục `index.html` và `assets/` lên nhánh `main`, vào Settings > Pages, chọn deploy from branch (nếu repo cho phép). Đợi GitHub thông báo build thành công, rồi vào URL Pages được cung cấp. Việc cấu hình cần làm trực tiếp trên tài khoản GitHub có quyền ghi; chưa được tự thực hiện trong bản bàn giao này.

© Quân Dev — mẫu phát triển 2026.

## Motion UI update
- Hero staggered entrance, subtle decorative animation and interactive desktop spotlight.
- Scroll-reveal for sections/cards via IntersectionObserver; project hover depth/light sweep and button micro-interactions.
- Scroll-position progress line, price change micro-animation, dialog/FAQ transitions.
- Supports `prefers-reduced-motion`; touch devices receive reduced visual workload.
- No animation library and no requirement for extra hosting or paid services.
