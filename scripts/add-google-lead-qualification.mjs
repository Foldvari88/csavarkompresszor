import { neon } from '@neondatabase/serverless';

// Additive migration; existing leads remain unqualified until explicitly reviewed.
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
try {
  const sql = neon(process.env.DATABASE_URL);
  await sql.query('ALTER TABLE leads ADD COLUMN IF NOT EXISTS ad_qualification jsonb');
  const columns = await sql.query("SELECT data_type, is_nullable FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'leads' AND column_name = 'ad_qualification'");
  if (columns.length !== 1 || columns[0].data_type !== 'jsonb') throw new Error('Column verification failed');
  console.log(JSON.stringify({ migration: 'google-lead-qualification', columnVerified: true, nullable: columns[0].is_nullable === 'YES' }));
} catch (error) {
  console.error('Qualification migration failed:', error.name);
  process.exitCode = 1;
}
