import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, insertInterviewSchema, insertResourceSchema, insertQuestionSchema } from "@shared/schema";
import { z } from "zod";
import { authenticateUser, type AuthRequest } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Applications routes
  app.get("/api/applications", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { status, search } = req.query;
      const applications = await storage.getApplications(req.userId!, {
        status: status as string,
        search: search as string,
      });
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/stats", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const stats = await storage.getApplicationStats(req.userId!);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/applications/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const application = await storage.getApplication(req.userId!, req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  app.post("/api/applications", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(req.userId!, validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid application data", details: error.errors });
      }
      console.error("Error creating application:", error);
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  app.patch("/api/applications/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const allowedFields: (keyof typeof insertApplicationSchema._type)[] = [
        "companyName", "positionTitle", "jobUrl", "logoUrl", "status", "salaryMin",
        "salaryMax", "location", "isRemote", "applicationDate", "notes"
      ];
      const updates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      // Convert date strings to Date objects
      if (updates.applicationDate && typeof updates.applicationDate === 'string') {
        updates.applicationDate = new Date(updates.applicationDate);
      }
      
      const application = await storage.updateApplication(req.userId!, req.params.id, updates);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  app.delete("/api/applications/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const success = await storage.deleteApplication(req.userId!, req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // Interviews routes
  app.get("/api/interviews", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { applicationId, status } = req.query;
      const interviews = await storage.getInterviews(req.userId!, {
        applicationId: applicationId as string,
        status: status as string,
      });
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ error: "Failed to fetch interviews" });
    }
  });

  app.get("/api/interviews/upcoming", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const interviews = await storage.getUpcomingInterviews(req.userId!, limit);
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching upcoming interviews:", error);
      res.status(500).json({ error: "Failed to fetch upcoming interviews" });
    }
  });

  app.get("/api/interviews/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const interview = await storage.getInterview(req.userId!, req.params.id);
      if (!interview) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      console.error("Error fetching interview:", error);
      res.status(500).json({ error: "Failed to fetch interview" });
    }
  });

  app.post("/api/interviews", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertInterviewSchema.parse(req.body);
      const interview = await storage.createInterview(req.userId!, validatedData);
      res.status(201).json(interview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid interview data", details: error.errors });
      }
      console.error("Error creating interview:", error);
      res.status(500).json({ error: "Failed to create interview" });
    }
  });

  app.patch("/api/interviews/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const allowedFields: (keyof typeof insertInterviewSchema._type)[] = [
        "applicationId", "interviewType", "interviewDate", "durationMinutes",
        "interviewerNames", "platform", "status", "prepNotes", "interviewNotes",
        "questionsAsked", "rating", "followUpActions"
      ];
      const updates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      
      // Convert date strings to Date objects
      if (updates.interviewDate && typeof updates.interviewDate === 'string') {
        updates.interviewDate = new Date(updates.interviewDate);
      }
      
      const interview = await storage.updateInterview(req.userId!, req.params.id, updates);
      if (!interview) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      console.error("Error updating interview:", error);
      res.status(500).json({ error: "Failed to update interview" });
    }
  });

  app.delete("/api/interviews/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const success = await storage.deleteInterview(req.userId!, req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting interview:", error);
      res.status(500).json({ error: "Failed to delete interview" });
    }
  });

  // Resources routes
  app.get("/api/resources", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { category } = req.query;
      const resources = await storage.getResources(req.userId!, {
        category: category as string,
      });
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const resource = await storage.getResource(req.userId!, req.params.id);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  app.post("/api/resources", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(req.userId!, validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid resource data", details: error.errors });
      }
      console.error("Error creating resource:", error);
      res.status(500).json({ error: "Failed to create resource" });
    }
  });

  app.patch("/api/resources/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const allowedFields: (keyof typeof insertResourceSchema._type)[] = [
        "title", "url", "category", "notes", "isReviewed", "linkedApplicationId"
      ];
      const updates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      const resource = await storage.updateResource(req.userId!, req.params.id, updates);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error("Error updating resource:", error);
      res.status(500).json({ error: "Failed to update resource" });
    }
  });

  app.delete("/api/resources/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const success = await storage.deleteResource(req.userId!, req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting resource:", error);
      res.status(500).json({ error: "Failed to delete resource" });
    }
  });

  // Questions routes
  app.get("/api/questions", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const { type, search } = req.query;
      const questions = await storage.getQuestions(req.userId!, {
        type: type as string,
        search: search as string,
      });
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  app.get("/api/questions/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const question = await storage.getQuestion(req.userId!, req.params.id);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ error: "Failed to fetch question" });
    }
  });

  app.post("/api/questions", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(req.userId!, validatedData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid question data", details: error.errors });
      }
      console.error("Error creating question:", error);
      res.status(500).json({ error: "Failed to create question" });
    }
  });

  app.patch("/api/questions/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const allowedFields: (keyof typeof insertQuestionSchema._type)[] = [
        "questionText", "answerText", "questionType", "isFavorite", "tags"
      ];
      const updates: any = {};
      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }
      const question = await storage.updateQuestion(req.userId!, req.params.id, updates);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ error: "Failed to update question" });
    }
  });

  app.delete("/api/questions/:id", authenticateUser, async (req: AuthRequest, res) => {
    try {
      const success = await storage.deleteQuestion(req.userId!, req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: "Failed to delete question" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
