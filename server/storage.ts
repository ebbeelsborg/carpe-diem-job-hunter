import { eq, desc, and, like, sql, gte } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  applications,
  interviews,
  resources,
  questions,
  type User,
  type InsertUser,
  type Application,
  type InsertApplication,
  type Interview,
  type InsertInterview,
  type Resource,
  type InsertResource,
  type Question,
  type InsertQuestion,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Applications
  getApplications(userId: string, filters?: { status?: string; search?: string }): Promise<Application[]>;
  getApplication(userId: string, id: string): Promise<Application | undefined>;
  createApplication(userId: string, application: InsertApplication): Promise<Application>;
  updateApplication(userId: string, id: string, application: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(userId: string, id: string): Promise<boolean>;
  getApplicationStats(userId: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
  }>;

  // Interviews
  getInterviews(userId: string, filters?: { applicationId?: string; status?: string }): Promise<(Interview & { companyName?: string; positionTitle?: string; jobUrl?: string })[]>;
  getUpcomingInterviews(userId: string, limit?: number): Promise<(Interview & { companyName?: string; positionTitle?: string; jobUrl?: string })[]>;
  getInterview(userId: string, id: string): Promise<Interview | undefined>;
  createInterview(userId: string, interview: InsertInterview): Promise<Interview>;
  updateInterview(userId: string, id: string, interview: Partial<InsertInterview>): Promise<Interview | undefined>;
  deleteInterview(userId: string, id: string): Promise<boolean>;

  // Resources
  getResources(userId: string, filters?: { category?: string }): Promise<Resource[]>;
  getResource(userId: string, id: string): Promise<Resource | undefined>;
  createResource(userId: string, resource: InsertResource): Promise<Resource>;
  updateResource(userId: string, id: string, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(userId: string, id: string): Promise<boolean>;

  // Questions
  getQuestions(userId: string, filters?: { type?: string; search?: string }): Promise<Question[]>;
  getQuestion(userId: string, id: string): Promise<Question | undefined>;
  createQuestion(userId: string, question: InsertQuestion): Promise<Question>;
  updateQuestion(userId: string, id: string, question: Partial<InsertQuestion>): Promise<Question | undefined>;
  deleteQuestion(userId: string, id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Applications
  async getApplications(userId: string, filters?: { status?: string; search?: string }): Promise<Application[]> {
    let query = db.select().from(applications).where(eq(applications.userId, userId));

    const conditions = [eq(applications.userId, userId)];

    if (filters?.status && filters.status !== "all") {
      conditions.push(eq(applications.status, filters.status as any));
    }

    if (filters?.search) {
      conditions.push(
        sql`(${applications.companyName} ILIKE ${`%${filters.search}%`} OR ${applications.positionTitle} ILIKE ${`%${filters.search}%`})`
      );
    }

    const results = await db
      .select()
      .from(applications)
      .where(and(...conditions))
      .orderBy(desc(applications.applicationDate));

    return results;
  }

  async getApplication(userId: string, id: string): Promise<Application | undefined> {
    const [app] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));
    return app;
  }

  async createApplication(userId: string, application: InsertApplication): Promise<Application> {
    const [app] = await db.insert(applications).values({ ...application, userId }).returning();
    return app;
  }

  async updateApplication(userId: string, id: string, application: Partial<InsertApplication>): Promise<Application | undefined> {
    const [app] = await db
      .update(applications)
      .set({ ...application, updatedAt: new Date() })
      .where(and(eq(applications.id, id), eq(applications.userId, userId)))
      .returning();
    return app;
  }

  async deleteApplication(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getApplicationStats(userId: string): Promise<{ total: number; byStatus: Record<string, number> }> {
    const apps = await db.select().from(applications).where(eq(applications.userId, userId));
    
    const byStatus: Record<string, number> = {};
    apps.forEach(app => {
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    });

    return {
      total: apps.length,
      byStatus,
    };
  }

  // Interviews
  async getInterviews(userId: string, filters?: { applicationId?: string; status?: string }): Promise<(Interview & { companyName?: string; positionTitle?: string; jobUrl?: string })[]> {
    const conditions = [eq(applications.userId, userId)];

    if (filters?.applicationId) {
      conditions.push(eq(interviews.applicationId, filters.applicationId));
    }

    if (filters?.status) {
      conditions.push(eq(interviews.status, filters.status as any));
    }

    const results = await db
      .select({
        id: interviews.id,
        applicationId: interviews.applicationId,
        interviewType: interviews.interviewType,
        interviewDate: interviews.interviewDate,
        durationMinutes: interviews.durationMinutes,
        interviewerNames: interviews.interviewerNames,
        platform: interviews.platform,
        status: interviews.status,
        prepNotes: interviews.prepNotes,
        interviewNotes: interviews.interviewNotes,
        questionsAsked: interviews.questionsAsked,
        rating: interviews.rating,
        followUpActions: interviews.followUpActions,
        createdAt: interviews.createdAt,
        companyName: applications.companyName,
        positionTitle: applications.positionTitle,
        jobUrl: applications.jobUrl,
      })
      .from(interviews)
      .innerJoin(applications, eq(interviews.applicationId, applications.id))
      .where(and(...conditions))
      .orderBy(interviews.interviewDate);

    return results;
  }

  async getUpcomingInterviews(userId: string, limit: number = 5): Promise<(Interview & { companyName?: string; positionTitle?: string; jobUrl?: string })[]> {
    const now = new Date();
    
    const results = await db
      .select({
        id: interviews.id,
        applicationId: interviews.applicationId,
        interviewType: interviews.interviewType,
        interviewDate: interviews.interviewDate,
        durationMinutes: interviews.durationMinutes,
        interviewerNames: interviews.interviewerNames,
        platform: interviews.platform,
        status: interviews.status,
        prepNotes: interviews.prepNotes,
        interviewNotes: interviews.interviewNotes,
        questionsAsked: interviews.questionsAsked,
        rating: interviews.rating,
        followUpActions: interviews.followUpActions,
        createdAt: interviews.createdAt,
        companyName: applications.companyName,
        positionTitle: applications.positionTitle,
        jobUrl: applications.jobUrl,
      })
      .from(interviews)
      .innerJoin(applications, eq(interviews.applicationId, applications.id))
      .where(
        and(
          eq(applications.userId, userId),
          eq(interviews.status, "scheduled"),
          gte(interviews.interviewDate, now)
        )
      )
      .orderBy(interviews.interviewDate)
      .limit(limit);

    return results;
  }

  async getInterview(userId: string, id: string): Promise<Interview | undefined> {
    const [interview] = await db
      .select({
        id: interviews.id,
        applicationId: interviews.applicationId,
        interviewType: interviews.interviewType,
        interviewDate: interviews.interviewDate,
        durationMinutes: interviews.durationMinutes,
        interviewerNames: interviews.interviewerNames,
        platform: interviews.platform,
        status: interviews.status,
        prepNotes: interviews.prepNotes,
        interviewNotes: interviews.interviewNotes,
        questionsAsked: interviews.questionsAsked,
        rating: interviews.rating,
        followUpActions: interviews.followUpActions,
        createdAt: interviews.createdAt,
      })
      .from(interviews)
      .innerJoin(applications, eq(interviews.applicationId, applications.id))
      .where(and(eq(interviews.id, id), eq(applications.userId, userId)));
    return interview;
  }

  async createInterview(userId: string, interview: InsertInterview): Promise<Interview> {
    // Verify the application belongs to the user
    const app = await this.getApplication(userId, interview.applicationId);
    if (!app) {
      throw new Error("Application not found or access denied");
    }
    const [result] = await db.insert(interviews).values(interview).returning();
    return result;
  }

  async updateInterview(userId: string, id: string, interview: Partial<InsertInterview>): Promise<Interview | undefined> {
    // Verify the interview belongs to the user via application
    const existing = await this.getInterview(userId, id);
    if (!existing) {
      return undefined;
    }
    const [result] = await db
      .update(interviews)
      .set(interview)
      .where(eq(interviews.id, id))
      .returning();
    return result;
  }

  async deleteInterview(userId: string, id: string): Promise<boolean> {
    // Verify the interview belongs to the user via application
    const existing = await this.getInterview(userId, id);
    if (!existing) {
      return false;
    }
    const result = await db.delete(interviews).where(eq(interviews.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Resources
  async getResources(userId: string, filters?: { category?: string }): Promise<Resource[]> {
    const conditions = [eq(resources.userId, userId)];

    if (filters?.category && filters.category !== "all") {
      conditions.push(eq(resources.category, filters.category as any));
    }

    const results = await db
      .select()
      .from(resources)
      .where(and(...conditions))
      .orderBy(desc(resources.createdAt));

    return results;
  }

  async getResource(userId: string, id: string): Promise<Resource | undefined> {
    const [resource] = await db
      .select()
      .from(resources)
      .where(and(eq(resources.id, id), eq(resources.userId, userId)));
    return resource;
  }

  async createResource(userId: string, resource: InsertResource): Promise<Resource> {
    const [result] = await db.insert(resources).values({ ...resource, userId }).returning();
    return result;
  }

  async updateResource(userId: string, id: string, resource: Partial<InsertResource>): Promise<Resource | undefined> {
    const [result] = await db
      .update(resources)
      .set(resource)
      .where(and(eq(resources.id, id), eq(resources.userId, userId)))
      .returning();
    return result;
  }

  async deleteResource(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(resources)
      .where(and(eq(resources.id, id), eq(resources.userId, userId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Questions
  async getQuestions(userId: string, filters?: { type?: string; search?: string }): Promise<Question[]> {
    const conditions = [eq(questions.userId, userId)];

    if (filters?.type && filters.type !== "all") {
      conditions.push(eq(questions.questionType, filters.type as any));
    }

    if (filters?.search) {
      conditions.push(
        sql`${questions.questionText} ILIKE ${`%${filters.search}%`}`
      );
    }

    const results = await db
      .select()
      .from(questions)
      .where(and(...conditions))
      .orderBy(desc(questions.createdAt));

    return results;
  }

  async getQuestion(userId: string, id: string): Promise<Question | undefined> {
    const [question] = await db
      .select()
      .from(questions)
      .where(and(eq(questions.id, id), eq(questions.userId, userId)));
    return question;
  }

  async createQuestion(userId: string, question: InsertQuestion): Promise<Question> {
    const [result] = await db.insert(questions).values({ ...question, userId }).returning();
    return result;
  }

  async updateQuestion(userId: string, id: string, question: Partial<InsertQuestion>): Promise<Question | undefined> {
    const [result] = await db
      .update(questions)
      .set(question)
      .where(and(eq(questions.id, id), eq(questions.userId, userId)))
      .returning();
    return result;
  }

  async deleteQuestion(userId: string, id: string): Promise<boolean> {
    const result = await db
      .delete(questions)
      .where(and(eq(questions.id, id), eq(questions.userId, userId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
