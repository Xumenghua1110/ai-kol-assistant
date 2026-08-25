-- Supabase Database Initialization for AI Outreach Hub
-- Run this in Supabase SQL Editor

-- Create KOLs table
CREATE TABLE IF NOT EXISTS kols (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  "profileUrl" TEXT,
  followers INTEGER DEFAULT 0,
  niche TEXT,
  region TEXT,
  engagement TEXT,
  status TEXT DEFAULT 'New',
  notes TEXT,
  language TEXT,
  "contactInfo" TEXT,
  priority TEXT,
  tier TEXT,
  "engagementRate" DOUBLE PRECISION,
  "avgViews" INTEGER,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "kolId" TEXT NOT NULL REFERENCES kols(id) ON DELETE CASCADE,
  "contentStyle" TEXT,
  "audienceProfile" TEXT,
  "engagementQuality" TEXT,
  "brandFitScore" DOUBLE PRECISION,
  recommendations TEXT,
  "riskFactors" TEXT,
  "rawResponse" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Emails table
CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "kolId" TEXT NOT NULL REFERENCES kols(id) ON DELETE CASCADE,
  subject TEXT,
  body TEXT NOT NULL,
  language TEXT DEFAULT 'English',
  "cooperationType" TEXT DEFAULT 'gift',
  tone TEXT DEFAULT 'professional and warm',
  channel TEXT DEFAULT 'email',
  status TEXT DEFAULT 'Draft',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Planning',
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analyses_kolid ON analyses("kolId");
CREATE INDEX IF NOT EXISTS idx_emails_kolid ON emails("kolId");
