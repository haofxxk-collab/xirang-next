-- 息壤・Supabase 資料庫 Schema
-- 在 Supabase 後台 → SQL Editor → 貼上執行

-- 申請表
CREATE TABLE IF NOT EXISTS applications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz DEFAULT now(),

  -- 基本資料
  name            text NOT NULL,
  name_en         text,
  email           text NOT NULL,
  phone           text,
  region          text NOT NULL,
  applicant_type  text NOT NULL CHECK (applicant_type IN ('artist','family','agent','recommendation')),

  -- 創作背景
  media           text[] NOT NULL DEFAULT '{}',
  years_active    text NOT NULL,
  work_count      text,
  bio             text NOT NULL,
  exhibitions     text,
  referral        text,

  -- 附件
  portfolio_url   text,
  notes           text,

  -- 狀態管理
  agreed_to_terms boolean NOT NULL DEFAULT false,
  status          text NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','reviewing','approved','rejected')),
  reviewer_notes  text,
  reviewed_at     timestamptz,
  reviewed_by     text
);

-- 索引
CREATE INDEX ON applications (status);
CREATE INDEX ON applications (created_at DESC);
CREATE INDEX ON applications (email);

-- Row Level Security：只允許 service role 讀寫，公開只能新增
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允許公開提交申請"
  ON applications FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "只有管理員可查看申請"
  ON applications FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "只有管理員可更新申請狀態"
  ON applications FOR UPDATE
  TO service_role
  USING (true);

-- 通知 email（optional，若有設定 Supabase Edge Function 寄信）
-- CREATE TRIGGER on_new_application
--   AFTER INSERT ON applications
--   FOR EACH ROW EXECUTE FUNCTION notify_new_application();

-- 完成
SELECT 'Schema 建立成功 ✅' AS result;
