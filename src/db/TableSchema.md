| table_name       | column_name  | data_type                | is_nullable | column_default    |
| ---------------- | ------------ | ------------------------ | ----------- | ----------------- |
| asset_categories | id           | uuid                     | NO          | gen_random_uuid() |
| asset_categories | asset_id     | uuid                     | NO          | null              |
| asset_categories | category_id  | uuid                     | NO          | null              |
| asset_categories | created_at   | timestamp with time zone | NO          | now()             |
| assets           | id           | uuid                     | NO          | gen_random_uuid() |
| assets           | user_id      | uuid                     | NO          | null              |
| assets           | filename     | text                     | NO          | null              |
| assets           | asset_type   | text                     | NO          | null              |
| assets           | asset_status | text                     | NO          | 'inventory'::text |
| assets           | category     | text                     | YES         | null              |
| assets           | title        | text                     | YES         | null              |
| assets           | description  | text                     | YES         | null              |
| assets           | price        | numeric                  | YES         | null              |
| assets           | asset_url    | text                     | NO          | null              |
| assets           | created_at   | timestamp with time zone | NO          | now()             |
| assets           | updated_at   | timestamp with time zone | NO          | now()             |
| categories       | id           | uuid                     | NO          | gen_random_uuid() |
| categories       | user_id      | uuid                     | NO          | null              |
| categories       | category     | text                     | NO          | null              |
| categories       | created_at   | timestamp with time zone | NO          | now()             |
| categories       | updated_at   | timestamp with time zone | NO          | now()             |
| user_profiles    | id           | uuid                     | NO          | null              |
| user_profiles    | email        | text                     | NO          | null              |
| user_profiles    | full_name    | text                     | YES         | null              |
| user_profiles    | role         | text                     | NO          | 'user'::text      |
| user_profiles    | is_approved  | boolean                  | YES         | false             |
| user_profiles    | created_at   | timestamp with time zone | NO          | now()             |
| user_profiles    | updated_at   | timestamp with time zone | NO          | now()             |