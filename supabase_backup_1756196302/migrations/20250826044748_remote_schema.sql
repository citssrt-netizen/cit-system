

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."bags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "run_id" "uuid",
    "seal_number" "text",
    "status" "text",
    "tebag_number" "text",
    "notes" "text"
);


ALTER TABLE "public"."bags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "contact_person" "text",
    "contact_number" "text",
    "address" "text"
);


ALTER TABLE "public"."clients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fuel_receipts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "run_id" "uuid",
    "image_url" "text",
    "amount" numeric,
    "uploaded_by" "uuid",
    "uploaded_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."fuel_receipts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."incidents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "run_id" "uuid",
    "description" "text",
    "photo_url" "text",
    "reported_by" "uuid",
    "reported_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."incidents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."patrols" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "guard_id" "uuid",
    "site_id" "uuid",
    "time" timestamp without time zone,
    "type" "text",
    "lat" double precision,
    "lon" double precision,
    "notes" "text",
    "photo_url" "text"
);


ALTER TABLE "public"."patrols" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rdn_slips" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "run_id" "uuid",
    "image_url" "text",
    "uploaded_by" "uuid",
    "uploaded_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."rdn_slips" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "run_id" "uuid",
    "type" "text",
    "pdf_url" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."run_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "run_id" "uuid",
    "event_time" timestamp without time zone NOT NULL,
    "event_type" "text",
    "user_id" "uuid",
    "lat" double precision,
    "lon" double precision,
    "mileage" numeric,
    "notes" "text",
    "photo_url" "text"
);


ALTER TABLE "public"."run_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."runs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" "date" NOT NULL,
    "type" "text",
    "status" "text",
    "assigned_team" "uuid"[],
    "vehicle_id" "uuid",
    "client_id" "uuid",
    "route" "text",
    "run_charges" numeric,
    "created_by" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."runs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."signatures" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "run_id" "uuid",
    "user_id" "uuid",
    "signature_data" "text",
    "signed_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."signatures" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "client_id" "uuid",
    "name" "text",
    "address" "text",
    "qr_tag" "text",
    "nfc_tag" "text"
);


ALTER TABLE "public"."sites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "role" "text" NOT NULL,
    "phone" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vehicle_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "run_id" "uuid",
    "vehicle_id" "uuid",
    "timestamp" timestamp without time zone,
    "lat" double precision,
    "lon" double precision,
    "speed" numeric,
    "event_type" "text",
    "raw_data" "jsonb"
);


ALTER TABLE "public"."vehicle_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."vehicles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "number" "text" NOT NULL,
    "model" "text",
    "status" "text",
    "capacity" integer,
    "notes" "text"
);


ALTER TABLE "public"."vehicles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."bags"
    ADD CONSTRAINT "bags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fuel_receipts"
    ADD CONSTRAINT "fuel_receipts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."incidents"
    ADD CONSTRAINT "incidents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patrols"
    ADD CONSTRAINT "patrols_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rdn_slips"
    ADD CONSTRAINT "rdn_slips_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."run_logs"
    ADD CONSTRAINT "run_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."runs"
    ADD CONSTRAINT "runs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."signatures"
    ADD CONSTRAINT "signatures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sites"
    ADD CONSTRAINT "sites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vehicle_logs"
    ADD CONSTRAINT "vehicle_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."vehicles"
    ADD CONSTRAINT "vehicles_number_key" UNIQUE ("number");



ALTER TABLE ONLY "public"."vehicles"
    ADD CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bags"
    ADD CONSTRAINT "bags_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id");



ALTER TABLE ONLY "public"."fuel_receipts"
    ADD CONSTRAINT "fuel_receipts_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id");



ALTER TABLE ONLY "public"."fuel_receipts"
    ADD CONSTRAINT "fuel_receipts_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."incidents"
    ADD CONSTRAINT "incidents_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."incidents"
    ADD CONSTRAINT "incidents_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id");



ALTER TABLE ONLY "public"."patrols"
    ADD CONSTRAINT "patrols_guard_id_fkey" FOREIGN KEY ("guard_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."rdn_slips"
    ADD CONSTRAINT "rdn_slips_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id");



ALTER TABLE ONLY "public"."rdn_slips"
    ADD CONSTRAINT "rdn_slips_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id");



ALTER TABLE ONLY "public"."run_logs"
    ADD CONSTRAINT "run_logs_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id");



ALTER TABLE ONLY "public"."run_logs"
    ADD CONSTRAINT "run_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."runs"
    ADD CONSTRAINT "runs_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id");



ALTER TABLE ONLY "public"."runs"
    ADD CONSTRAINT "runs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."runs"
    ADD CONSTRAINT "runs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id");



ALTER TABLE ONLY "public"."signatures"
    ADD CONSTRAINT "signatures_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id");



ALTER TABLE ONLY "public"."signatures"
    ADD CONSTRAINT "signatures_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."sites"
    ADD CONSTRAINT "sites_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id");



ALTER TABLE ONLY "public"."vehicle_logs"
    ADD CONSTRAINT "vehicle_logs_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id");



ALTER TABLE ONLY "public"."vehicle_logs"
    ADD CONSTRAINT "vehicle_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id");



CREATE POLICY "Allow insert for all users" ON "public"."run_logs" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."run_logs" FOR SELECT USING (true);



ALTER TABLE "public"."run_logs" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."bags" TO "anon";
GRANT ALL ON TABLE "public"."bags" TO "authenticated";
GRANT ALL ON TABLE "public"."bags" TO "service_role";



GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";



GRANT ALL ON TABLE "public"."fuel_receipts" TO "anon";
GRANT ALL ON TABLE "public"."fuel_receipts" TO "authenticated";
GRANT ALL ON TABLE "public"."fuel_receipts" TO "service_role";



GRANT ALL ON TABLE "public"."incidents" TO "anon";
GRANT ALL ON TABLE "public"."incidents" TO "authenticated";
GRANT ALL ON TABLE "public"."incidents" TO "service_role";



GRANT ALL ON TABLE "public"."patrols" TO "anon";
GRANT ALL ON TABLE "public"."patrols" TO "authenticated";
GRANT ALL ON TABLE "public"."patrols" TO "service_role";



GRANT ALL ON TABLE "public"."rdn_slips" TO "anon";
GRANT ALL ON TABLE "public"."rdn_slips" TO "authenticated";
GRANT ALL ON TABLE "public"."rdn_slips" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON TABLE "public"."run_logs" TO "anon";
GRANT ALL ON TABLE "public"."run_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."run_logs" TO "service_role";



GRANT ALL ON TABLE "public"."runs" TO "anon";
GRANT ALL ON TABLE "public"."runs" TO "authenticated";
GRANT ALL ON TABLE "public"."runs" TO "service_role";



GRANT ALL ON TABLE "public"."signatures" TO "anon";
GRANT ALL ON TABLE "public"."signatures" TO "authenticated";
GRANT ALL ON TABLE "public"."signatures" TO "service_role";



GRANT ALL ON TABLE "public"."sites" TO "anon";
GRANT ALL ON TABLE "public"."sites" TO "authenticated";
GRANT ALL ON TABLE "public"."sites" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."vehicle_logs" TO "anon";
GRANT ALL ON TABLE "public"."vehicle_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."vehicle_logs" TO "service_role";



GRANT ALL ON TABLE "public"."vehicles" TO "anon";
GRANT ALL ON TABLE "public"."vehicles" TO "authenticated";
GRANT ALL ON TABLE "public"."vehicles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
