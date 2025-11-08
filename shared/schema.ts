import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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
  "company_culture"
]);

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
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
  applicationId: varchar("application_id").notNull(),
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
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  url: text("url"),
  category: resourceCategoryEnum("category").notNull(),
  notes: text("notes"),
  isReviewed: boolean("is_reviewed").default(false),
  linkedApplicationId: varchar("linked_application_id"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const questions = pgTable("questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  questionText: text("question_text").notNull(),
  answerText: text("answer_text"),
  questionType: questionTypeEnum("question_type").notNull(),
  isFavorite: boolean("is_favorite").default(false),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  createdAt: true,
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
