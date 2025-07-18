-- Create sessions table for storing session data
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  session_data TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on expires for cleanup queries
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (sessions are managed by the app)
CREATE POLICY "Allow all operations on sessions" ON sessions
  FOR ALL USING (true);

-- Create a function to clean up expired sessions (can be called manually)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: You can manually run this to clean up expired sessions:
-- SELECT cleanup_expired_sessions(); 