import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username"),
  email: text("email").notNull().unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const applicationStatusEnum = pgEnum("application_status", [
  "applied",
  "phone_screen",
  "technical",
  "onsite",
  "final",
  "offer",
  "rejected",
  "withdrawn"
]);

export const interviewTypeEnum = pgEnum("interview_type", [
  "phone_screen",
  "technical",
  "system_design",
  "behavioral",
  "final",
  "other"
]);

export const interviewStatusEnum = pgEnum("interview_status", [
  "scheduled",
  "completed",
  "cancelled"
]);

export const resourceCategoryEnum = pgEnum("resource_category", [
  "algorithms",
  "system_design",
  "behavioral",
  "company_specific",
  "resume",
  "other"
]);

export const questionTypeEnum = pgEnum("question_type", [
  "behavioral",
  "technical",
  "system_design",
  "company_culture",
  "experience"
]);

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  positionTitle: text("position_title").notNull(),
  jobUrl: text("job_url"),
  logoUrl: text("logo_url"),
  status: applicationStatusEnum("status").notNull().default("applied"),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  location: text("location"),
  isRemote: boolean("is_remote").default(false),
  applicationDate: timestamp("application_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
  interviewType: interviewTypeEnum("interview_type").notNull(),
  interviewDate: timestamp("interview_date").notNull(),
  durationMinutes: integer("duration_minutes"),
  interviewerNames: text("interviewer_names"),
  platform: text("platform"),
  status: interviewStatusEnum("status").notNull().default("scheduled"),
  prepNotes: text("prep_notes"),
  interviewNotes: text("interview_notes"),
  questionsAsked: text("questions_asked"),
  rating: integer("rating"),
  followUpActions: text("follow_up_actions"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  url: text("url"),
  category: resourceCategoryEnum("category").notNull(),
  notes: text("notes"),
  isReviewed: boolean("is_reviewed").default(false),
  linkedApplicationId: varchar("linked_application_id").references(() => applications.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text"),
  questionType: questionTypeEnum("question_type").notNull(),
  isFavorite: boolean("is_favorite").default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  username: true,
  googleId: true,
});

// Schema for email/password registration
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// Schema for email/password login
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
}).extend({
  applicationDate: z.union([z.string(), z.date()]).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  createdAt: true,
}).extend({
  interviewDate: z.union([z.string(), z.date()]).transform((val) => 
    typeof val === 'string' ? new Date(val) : val
  ),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Interview = typeof interviews.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
