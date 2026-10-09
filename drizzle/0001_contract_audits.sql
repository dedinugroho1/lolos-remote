CREATE TABLE "contract_audits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_session_id" text NOT NULL,
	"contract_name" text NOT NULL,
	"safety_score" integer NOT NULL,
	"red_flags_count" integer DEFAULT 0 NOT NULL,
	"audit_summary_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contract_audits_session_idx" ON "contract_audits" USING btree ("user_session_id");--> statement-breakpoint
CREATE INDEX "contract_audits_created_at_idx" ON "contract_audits" USING btree ("created_at");