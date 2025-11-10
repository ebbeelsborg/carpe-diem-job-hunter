CREATE TYPE "public"."application_status" AS ENUM('applied', 'phone_screen', 'technical', 'onsite', 'final', 'offer', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('scheduled', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."interview_type" AS ENUM('phone_screen', 'technical', 'system_design', 'behavioral', 'final', 'other');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('behavioral', 'technical', 'system_design', 'company_culture', 'experience');--> statement-breakpoint
CREATE TYPE "public"."resource_category" AS ENUM('algorithms', 'system_design', 'behavioral', 'company_specific', 'resume', 'other');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"company_name" text NOT NULL,
	"position_title" text NOT NULL,
	"job_url" text,
	"logo_url" text,
	"status" "application_status" DEFAULT 'applied' NOT NULL,
	"salary_min" integer,
	"salary_max" integer,
	"location" text,
	"is_remote" boolean DEFAULT false,
	"application_date" timestamp NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" varchar NOT NULL,
	"interview_type" "interview_type" NOT NULL,
	"interview_date" timestamp NOT NULL,
	"duration_minutes" integer,
	"interviewer_names" text,
	"platform" text,
	"status" "interview_status" DEFAULT 'scheduled' NOT NULL,
	"prep_notes" text,
	"interview_notes" text,
	"questions_asked" text,
	"rating" integer,
	"follow_up_actions" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"question_text" text NOT NULL,
	"answer_text" text,
	"question_type" "question_type" NOT NULL,
	"is_favorite" boolean DEFAULT false,
	"tags" text[],
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" text NOT NULL,
	"url" text,
	"category" "resource_category" NOT NULL,
	"notes" text,
	"is_reviewed" boolean DEFAULT false,
	"linked_application_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"password" text,
	"google_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_linked_application_id_applications_id_fk" FOREIGN KEY ("linked_application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;