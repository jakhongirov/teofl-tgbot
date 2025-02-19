CREATE TABLE users (
   id bigserial PRIMARY KEY,
   name text,
   phone text,
   gender text,
   email text,
   birth_date text,
   city text,
   address text,
   passport text,
   payment_link text,
   exam_date text,
   chat_id bigint,
   step text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

