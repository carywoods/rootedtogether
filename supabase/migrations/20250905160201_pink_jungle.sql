@@ .. @@
 -- Create indexes for performance
-CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST (ll_to_earth(latitude, longitude));
+CREATE INDEX IF NOT EXISTS idx_profiles_latitude ON profiles (latitude);
+CREATE INDEX IF NOT EXISTS idx_profiles_longitude ON profiles (longitude);
 CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages (sender_id, recipient_id);