# Văn Hóa & Phương Pháp Làm Việc Nhóm — VinUni AI Thực Chiến (Khóa 5, Track 3)

Tài liệu này tóm lược toàn bộ khung phương pháp luận quản trị dự án, phối hợp nhóm và nguyên tắc kỹ thuật được đào tạo trong chương trình VinUni AI20K, nhằm làm kim chỉ nam xuyên suốt quá trình thiết kế và triển khai prototype **MFG-08 SmartWO**.

Mọi nguyên tắc dưới đây đều được trích xuất trực tiếp từ tài liệu đào tạo chính thức của chương trình, không suy diễn hay bịa đặt.

---

## 1. Bản Định Hướng Dự Án (Project Charter) — Hoàn Tất Trong Tuần 1

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S3); `Template Project Charter + Mẫu báo cáo.xlsx`.*

- **Thời điểm bắt buộc:** Phải hoàn thành và thống nhất ngay trong **Tuần 1**, trước khi gõ dòng code đầu tiên.
- **4 thành tố sống còn của Project Charter:**
  1. **Mục tiêu SMART:** Ứng dụng giải quyết bài toán gì cụ thể? Dành cho ai? (Ví dụ: Giúp điều độ viên một ca trên chuyền lắp ráp mô phỏng ra quyết định phát lệnh nhanh và chính xác 100% về điều kiện sẵn sàng).
  2. **Metrics thành công đo đếm được:** Chỉ tiêu định lượng rõ ràng, không cảm tính. (Ví dụ: `illegal_release = 0`, tỷ lệ tuân thủ HITL = 100% trên bộ test; Decision Support Time đo qua A/B testing so với baseline thủ công).
  3. **Phạm vi (In-Scope / Out-of-Scope):** Xác định rõ sẽ làm gì và **kiên quyết KHÔNG làm gì** để dập tắt nguy cơ phình phạm vi (Scope Creep). Không đưa vào các tính năng viễn vông ngoài tầm 6 tuần.
  4. **Bản đồ Stakeholder:** Xác định rõ ai là người duyệt yêu cầu, ai là người dùng trực tiếp (điều độ viên, tổ trưởng), phương thức và tần suất liên lạc, báo cáo.

---

## 2. Phân Định Ba Vai Trò Nòng Cốt

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S4); `team_project_management_template.xlsx`.*

Không một cá nhân nào có thể làm tất cả. Đội ngũ 4 người được tổ chức theo 3 chốt chặn:

| Vai trò | Danh xưng bảo vệ | Trách nhiệm then chốt |
|---|---|---|
| **Product Owner (PO) / Team Lead** | *Người bảo vệ giá trị* | Chịu trách nhiệm cao nhất về sự thành/bại của sản phẩm; giữ vững mục tiêu bài toán; thấu hiểu nghiệp vụ và kết nối chặt chẽ với Stakeholder/Mentor. |
| **Tech Lead / Dev** | *Người bảo vệ kỹ thuật* | Có thẩm quyền cao nhất về kiến trúc hệ thống, lựa chọn công nghệ, cấu trúc dữ liệu và chất lượng code. |
| **Project Manager (PM)** | *Người bảo vệ thời gian* | Chịu trách nhiệm cao nhất về tiến độ, chất lượng giao hàng, kỷ luật quy trình và đôn đốc công việc hằng ngày (có thể kiêm nhiệm bởi Lead). |

---

## 3. Nguồn Sự Thật Duy Nhất (Single Source of Truth — SSOT)

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S5); `team_project_management_template.xlsx`.*

- **Nguyên tắc cốt lõi (Keep It Simple):** Duy trì đúng **1 file duy nhất / team** (theo mẫu bảng tính quản trị dự án).
- **Mọi mắt xích đều phải dẫn về file này:**
  - Link tới **GitHub Repository** (Mã nguồn, CI/CD pipeline, AI Commit Log).
  - Link tới **Figma / Wireframe** (Thiết kế giao diện, luồng UX/UI).
  - Link tới **API Specs & Live Production Demo URL**.
  - **Backlog & Bảng phân công task** theo ngày/sprint.
- **Kỷ luật thép:** Bất kỳ tài liệu, thiết kế hay đoạn code nào **không được liên kết trong file SSOT đều coi như KHÔNG TỒN TẠI**.

---

## 4. Phát Hành Liên Tục (Continuous Delivery) V1 → V2 → V3

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S6).*

- **Bài học chống sai lầm "Cây cầu dài hoàn hảo":** Tuyệt đối không ngồi vẽ thiết kế thật hoàn hảo rồi code âm thầm đến tuần cuối mới ra mắt. Hậu quả chắc chắn là: cháy deadline, kiệt sức và làm ra thứ người dùng không cần.
- **Chiến lược 3 bậc phát hành:**
  - **V1 (Quick & Dirty):** Dựng khung chạy được luồng chính sớm nhất có thể để kiểm chứng giả định.
  - **V2 (Cải thiện):** Tối ưu hóa, bổ sung xử lý lỗi, tinh chỉnh trải nghiệm dựa trên phản hồi.
  - **V3 (Xuất sắc):** Hoàn thiện chỉn chu, gia cố bảo mật, kiểm thử toàn diện và đóng gói nghiệm thu.
- **Châm ngôn thực chiến:** *"Đoạn code tốt nhất là đoạn code đang chạy ổn định trên môi trường Production."*

---

## 5. Đơn Vị Công Việc: User Story & Kiểm Thử UAT

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S7); `notes.md` (Workshop 12/11).*

- **Cấu trúc chuẩn của User Story:**
  > *"Với vai trò là `[Người dùng]`, tôi muốn `[Tính năng]` để `[Lợi ích đạt được]`."*
- **Ý nghĩa thực tế:**
  - Là ngôn ngữ chung xóa nhòa khoảng cách giữa Coder và Nghiệp vụ/Stakeholder.
  - Đảm bảo mỗi dòng code viết ra đều mang lại giá trị thực (`Value`) cho người dùng cuối.
  - Độ hạt công việc: Mỗi User Story có độ dài ước lượng vừa vặn trong khoảng **2–3 ngày phát triển**.
  - Là căn cứ trực tiếp để xây dựng kịch bản kiểm thử chấp nhận người dùng (**UAT — User Acceptance Testing**) chạy trên môi trường thực tế.

---

## 6. Kỷ Luật Sprint & Hai Checkpoint Sinh Tử

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S8); `timeline.md`.*

- **Độ dài Sprint:** **1 Sprint = đúng 1 tuần**. Danh sách User Story cam kết trong Sprint là **CỐ ĐỊNH** — đã chốt là tập trung làm bằng được, không tùy tiện thêm bớt giữa chừng.
- **Lộ trình 6 tuần và 2 mốc sinh tử:**
  - **Checkpoint 1 (Tuần 3 — Hoàn tất 80%):** Demo lần 1 luồng nghiệp vụ chính E2E. Chứng minh năng lực kỹ thuật và tính khả thi để tạo niềm tin với Hội đồng/Stakeholder.
  - **Checkpoint 2 (Tuần 5 — Hoàn tất 100%):** Demo lần 2. Sản phẩm hoàn thiện đầy đủ tính năng cốt lõi, chạy mượt mà trên môi trường Production thật.
  - **Tuần 4:** Đệm kỹ thuật, xử lý triệt để 20% tồn đọng phức tạp, tối ưu hóa hiệu năng.
  - **Tuần 6:** Tổng duyệt, hoàn thiện slide báo cáo, chuẩn bị bài bảo vệ chung cuộc.

---

## 7. Viết Đặc Tả Kỹ Thuật (Spec) Trước Khi Code

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S9).*

Mọi tính năng quan trọng đều **bắt buộc phải có bản đặc tả kỹ thuật** trước khi gõ phím. Cấu trúc Spec chuẩn gồm 3 phần:
1. **Motivation (Động lực):** Tính năng này giải quyết vấn đề gì? Kỳ vọng đạt được điều gì? Có phương án thay thế nào đơn giản hơn không?
2. **Design (Thiết kế):** Kiến trúc kỹ thuật, luồng UI/UX, API endpoints, Prompt cấu trúc, Data Schema và **danh sách các trường hợp biên (Edge cases)**.
3. **Plan (Kế hoạch):** Phân rã công việc nhỏ (atomic tasks), tiến độ bàn giao, và **tiêu chí nghiệm thu rõ ràng (Definition of Done)**.
- **Mục đích:** Suy nghĩ thấu đáo để tránh việc hiểu sai luồng, dẫn đến việc phải "đập đi xây lại" gây lãng phí công sức.

---

## 8. Kỷ Luật Giao Tiếp: Họp Ngắn, Đúng Lúc, Ra Quyết Định

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S10).*

Tránh để các cuộc họp lê thê triệt tiêu năng suất làm việc của nhóm:
- **Daily Standup (10–15 phút):**
  - Tần suất: Diễn ra đều đặn vào đầu giờ sáng (khuyến nghị 09:00).
  - Nội dung đúng 3 câu hỏi: *Hôm qua đã làm gì? Hôm nay sẽ làm gì? Có gặp vướng mắc (Blocker) nào không?*
  - Mục tiêu: Duy trì nhịp độ làm việc (**Rhythm**) và tinh thần trách nhiệm cá nhân (**Accountability**).
- **Technical Meeting (5–10 phút):**
  - Tần suất: Triệu tập tức thì khi xuất hiện Blocker kỹ thuật hoặc xung đột merge code/thay đổi schema.
  - Nội dung: Tập trung đồng bộ duy nhất một quyết định kỹ thuật cụ thể.
- **Nguyên tắc vàng:** Họp ngắn — đúng trọng tâm — chốt phương án rõ ràng — giải tán ngay để quay lại làm việc.

---

## 9. Tâm Lý Nhóm & Ma Trận Xử Lý Xung Đột

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S11, S12).*

- **4 giai đoạn tâm lý phát triển nhóm (Tuckman Model):**
  1. *Forming (Hình thành):* Hào hứng nhưng mơ hồ về vai trò → Giải pháp: Chốt ngay Project Charter và phân vai.
  2. *Storming (Sóng gió):* Bất đồng ý kiến, xung đột cách làm, trễ tiến độ → **Đây là hiện tượng tất yếu và bình thường**, cần nhận diện và đối thoại sớm.
  3. *Norming (Ổn định):* Thấu hiểu và chấp nhận sự khác biệt, tuân thủ kỷ luật chung.
  4. *Performing (Thăng hoa):* Tin tưởng tuyệt đối, phối hợp nhịp nhàng, năng suất vượt bậc.
- **Ma trận đối phó xung đột:**
  - **Khuyến khích tối đa: Xung đột Kỹ thuật / Công việc.** Tranh luận thẳng thắn, công tâm về kiến trúc, thuật toán, trải nghiệm người dùng. Nguyên tắc: *Người có chuyên môn sâu nhất về mảng đó là người đưa ra quyết định cuối cùng.*
  - **Kiên quyết dập tắt: Xung đột Cá nhân.** Cái tôi, sự tự ái, công kích thái độ. Giải quyết bằng tinh thần chuyên nghiệp: *Đã bàn bạc và chốt phương án chung là dốc lòng thực thi, không bàn lùi.* Leader có trách nhiệm xử lý dứt điểm trong ngày, tuyệt đối không để ấm ức âm ỉ qua đêm.

---

## 10. Bài Tập Retrospective: Sad – Mad – Glad

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S13).*

Tổ chức định kỳ vào cuối mỗi Sprint để giải tỏa tâm lý và liên tục tối ưu quy trình:
- **SAD (Buồn / Nuối tiếc):** Những điều khiến nhóm tụt năng lượng hoặc chưa làm trọn vẹn (ví dụ: yêu cầu bài toán chưa rõ, mất thời gian thử sai). → Chia sẻ thẳng thắn, đồng cảm.
- **MAD (Bực xúc / Cản trở):** Những rào cản lặp đi lặp lại gây ức chế (ví dụ: máy dev lỗi, chờ đợi API quá lâu). → Biến thành **Action Item hành động ngay lập tức** để dập tắt trong sprint tới.
- **GLAD (Vui / Tự hào):** Những kết quả tốt, bước đột phá kỹ thuật (ví dụ: dựng xong mock data sạch, kết nối agent trơn tru). → Tuyên dương và ghi nhận công sức của đồng đội.

---

## 11. Tinh Thần Đa Chức Năng (Cross-Functional Team)

*Nguồn: `Workshop QTDA + Quản lý nhóm /slide QTDA & Quản lý nhóm.html` (Slide S14).*

- Trong môi trường khởi nghiệp thần tốc 6 tuần, **tuyệt đối không tồn tại tư duy: "Đây không phải việc của tôi"**.
- Hệ thống làm việc phải mang tính tương hỗ, tự thích ứng:
  - Nếu Frontend bị quá tải hoặc kẹt giao diện: Thành viên phụ trách AI/Backend sẵn sàng nhảy vào hỗ trợ dựng UI hoặc viết tài liệu đặc tả.
  - Nếu Backend chưa kịp làm xong API: Frontend chủ động định nghĩa contract và tự tạo Mock API / Mock Data Store để tiếp tục tiến độ mà không ngồi đợi.
- Mục tiêu tối thượng của nhóm không bao giờ được phép gián đoạn trước bất kỳ sự cố cục bộ nào.

---

## 12. Kỹ Thuật Thực Chiến & Triển Khai (Đúc Kết Workshop 12/11/2026)

*Nguồn: `notes.md` (Workshop 12/11/2026); `Tongketdahoc.md` (Day 1–5).*

### Kỹ thuật & Hạ tầng
- **CI/CD & Môi trường Production (VPS) từ ngày đầu tiên:** Không phát triển theo kiểu "chạy được trên máy tôi là xong". Mọi commit phải được build và deploy tự động lên môi trường thực ngay từ tuần 1.
- **Bộ Unit Test & Kịch bản Test Production:** Xây dựng bộ kiểm thử đơn vị bao phủ các hàm logic cốt lõi (như tính toán cổng kiểm tra). Có kịch bản kiểm thử E2E chạy trực tiếp trên production bám theo User Story để làm tài liệu nghiệm thu UAT.

### Phương pháp tiếp cận bài toán
- **Nghiên cứu sản phẩm chuẩn quốc tế:** Muốn làm sâu và vững, phải khảo sát kỹ các giải pháp phần mềm công nghiệp hàng đầu (SAP MES, Siemens Opcenter, Tulip, Plex) để hiểu họ chuẩn hóa bài toán như thế nào, từ đó định vị rõ giá trị độc bản của sản phẩm mình.
- **Tư duy từ vấn đề thay vì công nghệ:** Không bắt đầu bằng việc "làm chatbot". Tuân thủ quy trình Double Diamond và thang độ phức tạp: **Rule → Workflow → Agent**. Chỉ ứng dụng AI vào đúng điểm nghẽn mang lại đòn bẩy thực sự.

### Chất lượng & Chuẩn mực giao diện
- **Kiên quyết bài trừ "AI Slop":**
  - Tuyệt đối không dùng phong cách thiết kế AI màu mè, bóng bẩy sáo rỗng: cấm gradient tím hồng phát sáng (purple-pink neon glow), cấm quả cầu AI lơ lửng vô nghĩa, cấm các câu khẩu hiệu marketing sáo rỗng ("Ask your AI anything", "Magic solver").
  - Giao diện nhà xưởng phải mang tính công cụ chuyên nghiệp: Theme sáng (clean light mode), phân cấp thị giác rõ ràng, font chữ trung tính, độ tương phản cao, tập trung hoàn toàn vào dữ liệu vận hành và quyết định của con người.
- **Chỉn chu toàn diện:** Sản phẩm tốt phải thể hiện sự chuyên nghiệp ở mọi điểm chạm, từ mã nguồn, giao diện, tài liệu đặc tả cho đến slide thuyết trình.

### Định hướng công nghệ AI: Personal Agent thay vì RAG cũ kỹ
- **RAG truyền thống đã lỗi thời đối với tác vụ điều hành:** Các kiến trúc RAG cồng kềnh với hàng triệu vector embedding không phù hợp với nghiệp vụ điều độ đòi hỏi tính tất định, độ chính xác 100% và bảo mật trạng thái.
- **Chuyển dịch sang Personal Agent có công cụ:** AI đóng vai trò như một trợ lý cá nhân tinh gọn (Personal Assistant) được trang bị các công cụ tra cứu thông tin nghiệp vụ mỏng (tool lookup SOP/quy chuẩn), tập trung giải thích ngữ cảnh, phát hiện bất thường và đề xuất phiếu phê duyệt có con người kiểm soát (Human-in-the-Loop — HITL), **tuyệt đối không bao giờ cho phép AI tự ý can thiệp hay thay đổi trạng thái sản xuất**.
