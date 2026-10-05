-- ============================================================
-- NIBELC — CẤU TRÚC DỮ LIỆU CHO TRANG QUẢN TRỊ
-- ------------------------------------------------------------
-- Chạy:  psql "$DATABASE_URL" -f db/001-khoi-tao.sql
-- Chạy lại nhiều lần được (toàn bộ đều "if not exists").
--
-- VÌ SAO DÙNG JSONB CHO PHẦN NỘI DUNG
-- Một đơn hàng có vị trí tuyển dụng, yêu cầu, quyền lợi, thư
-- viện ảnh — mỗi thứ một danh sách dài ngắn khác nhau. Tách ra
-- thành bảng con thì mỗi lần Sếp muốn thêm một trường là phải
-- sửa cấu trúc rồi deploy lại. Để trong JSONB thì trang quản
-- trị thêm trường là xong, không đụng tới CSDL.
-- Những gì cần TÌM KIẾM và SẮP XẾP (slug, ẩn/hiện, ngành, nước)
-- vẫn nằm ở cột riêng để còn đánh chỉ mục.
--
-- ĐA NGỮ
-- `dich` giữ bản tiếng Anh và tiếng Đức: {"en": {...}, "de": {...}}
-- Sếp chốt 05/10/2026: nhân viên chỉ bắt buộc nhập tiếng Việt;
-- trường nào chưa dịch thì bản /en /de KHÔNG hiện mục đó, chứ
-- không hiện lẫn tiếng Việt vào.
-- ============================================================

-- ---------- ĐƠN HÀNG ----------
create table if not exists don_hang (
  id          text primary key,
  slug        text unique not null,
  -- toàn bộ nội dung bản tiếng Việt (tiêu đề, mô tả, vị trí, lương…)
  du_lieu     jsonb not null,
  dich        jsonb not null default '{}'::jsonb,
  -- rút ra ngoài để lọc và sắp xếp
  nganh       text,
  nuoc        text,
  hien        boolean not null default true,
  noi_bat     boolean not null default false,
  thu_tu      integer not null default 0,
  tao_luc     timestamptz not null default now(),
  sua_luc     timestamptz not null default now()
);
create index if not exists don_hang_hien_idx   on don_hang (hien, thu_tu desc, sua_luc desc);
create index if not exists don_hang_nganh_idx  on don_hang (nganh) where hien;
create index if not exists don_hang_nuoc_idx   on don_hang (nuoc)  where hien;

-- ---------- BÀI VIẾT (cẩm nang + cộng đồng) ----------
-- Gộp một bảng vì hai loại có cùng hình dạng: tiêu đề, ảnh bìa,
-- thân bài, thời gian đọc. Khác nhau mỗi cột `loai`.
create table if not exists bai_viet (
  id          text primary key,
  slug        text unique not null,
  loai        text not null check (loai in ('cam-nang', 'cong-dong')),
  du_lieu     jsonb not null,
  dich        jsonb not null default '{}'::jsonb,
  nhom        text,
  hien        boolean not null default true,
  thu_tu      integer not null default 0,
  tao_luc     timestamptz not null default now(),
  sua_luc     timestamptz not null default now()
);
create index if not exists bai_viet_loai_idx on bai_viet (loai, hien, thu_tu desc, tao_luc desc);

-- ---------- NỘI DUNG TRANG (banner, tiêu đề, mô tả) ----------
-- Khoá dạng "trang-chu.banner", "don-hang.hero". Mỗi khoá một
-- cục JSON, trang quản trị dựng form theo đúng khoá đó.
create table if not exists noi_dung (
  khoa      text primary key,
  gia_tri   jsonb not null,
  sua_luc   timestamptz not null default now()
);

-- ---------- KHO ẢNH ----------
-- File NẰM NGOÀI thư mục app (/opt/nibelc-kho/anh). Để trong app
-- là mỗi lần deploy `git reset --hard` xoá sạch — đúng lỗi đã
-- dính ở tro-ly-tgd. Bảng này chỉ giữ thông tin tra cứu.
create table if not exists anh (
  id         text primary key,
  ten_goc    text not null,
  tep        text unique not null,       -- tên file trong kho
  loai       text not null,              -- image/jpeg, image/webp…
  rong       integer,
  cao        integer,
  dung_luong integer,
  nhan       text[] not null default '{}',
  tao_luc    timestamptz not null default now()
);
create index if not exists anh_moi_idx  on anh (tao_luc desc);
create index if not exists anh_nhan_idx on anh using gin (nhan);

-- ---------- NHẬT KÝ ----------
-- Một tài khoản chung cho cả đội (Sếp chốt 05/10/2026), nên
-- không biết được AI sửa. Nhưng vẫn ghi lại SỬA GÌ và giữ bản
-- trước — để còn hoàn tác khi ai đó xoá nhầm.
create table if not exists nhat_ky (
  id        bigserial primary key,
  luc       timestamptz not null default now(),
  viec      text not null,               -- them | sua | xoa | hien | an
  bang      text not null,
  ban_ghi   text,
  truoc     jsonb,
  sau       jsonb
);
create index if not exists nhat_ky_moi_idx on nhat_ky (luc desc);

-- ---------- PHIÊN ĐĂNG NHẬP ----------
create table if not exists phien (
  ma        text primary key,
  tao_luc   timestamptz not null default now(),
  het_han   timestamptz not null
);
create index if not exists phien_het_han_idx on phien (het_han);

-- tự cập nhật sua_luc
create or replace function cham_sua_luc() returns trigger as $$
begin
  new.sua_luc = now();
  return new;
end;
$$ language plpgsql;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'don_hang_sua_luc') then
    create trigger don_hang_sua_luc before update on don_hang
      for each row execute function cham_sua_luc();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'bai_viet_sua_luc') then
    create trigger bai_viet_sua_luc before update on bai_viet
      for each row execute function cham_sua_luc();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'noi_dung_sua_luc') then
    create trigger noi_dung_sua_luc before update on noi_dung
      for each row execute function cham_sua_luc();
  end if;
end $$;
