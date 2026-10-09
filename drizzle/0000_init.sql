CREATE TABLE "cv_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_session_id" text NOT NULL,
	"profile_json" jsonb NOT NULL,
	"original_file_name" text,
	"claude_model" text DEFAULT 'claude-haiku-5-5' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_session_id" text NOT NULL,
	"job_title" text NOT NULL,
	"company_name" text NOT NULL,
	"fit_score" integer NOT NULL,
	"location_requirement" text,
	"timezone_overlap" text,
	"contract_type" text,
	"salary_range" text,
	"match_result_json" jsonb NOT NULL,
	"matched_skills" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"gaps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mandatory_warnings" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'applied' NOT NULL,
	"notes" text,
	"applied_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "cv_profiles_session_uniq" ON "cv_profiles" USING btree ("user_session_id");--> statement-breakpoint
CREATE INDEX "saved_applications_session_idx" ON "saved_applications" USING btree ("user_session_id");--> statement-breakpoint
CREATE INDEX "saved_applications_applied_at_idx" ON "saved_applications" USING btree ("applied_at");