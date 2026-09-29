/**
 * Database Migration Helper: Remove Public Email
 * 
 * Usage:
 *   node scripts/remove-email.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

// Simple .env.local loader
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("\n=======================================================");
console.log("  Remove Public Email: Database Script");
console.log("=======================================================\n");

const sqlToRun = `ALTER TABLE site_settings DROP COLUMN IF EXISTS email;`;

console.log("1. Supabase SQL Query to permanently drop the column:\n");
console.log(`   ${sqlToRun}\n`);
console.log("   (Run this query in your Supabase Dashboard: SQL Editor -> New Query)\n");

if (supabaseUrl && supabaseKey) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log("2. Checking database row in 'site_settings'...");
    
    // Attempt to clear any existing email in the row if the column is still present
    const { error: updateError } = await supabase
      .from("site_settings")
      .update({ email: "" })
      .eq("id", "default");

    if (updateError) {
      if (updateError.message?.includes("column") || updateError.code === "PGRST204") {
        console.log("   ✓ Column 'email' is already removed or inaccessible via API.");
      } else {
        console.log(`   Note on data update: ${updateError.message}`);
      }
    } else {
      console.log("   ✓ Successfully cleared any stored email data from 'site_settings'.");
    }
  } catch (err) {
    console.log(`   Could not connect to Supabase: ${err instanceof Error ? err.message : String(err)}`);
  }
} else {
  console.log("   Note: Supabase credentials not found in environment. Please execute the SQL query above directly in the Supabase SQL editor.");
}

console.log("\n=======================================================\n");
