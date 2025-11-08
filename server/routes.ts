import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertApplicationSchema, insertInterviewSchema, insertResourceSchema, insertQuestionSchema } from "@shared/schema";
import { z } from "zod";

// Temporary mock user ID until auth is implemented
const MOCK_USER_ID = "mock-user-123";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Applications routes
  app.get("/api/applications", async (req, res) => {
    try {
      const { status, search } = req.query;
      const applications = await storage.getApplications(MOCK_USER_ID, {
        status: status as string,
        search: search as string,
      });
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.get("/api/applications/stats", async (req, res) => {
    try {
      const stats = await storage.getApplicationStats(MOCK_USER_ID);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/applications/:id", async (req, res) => {
    try {
      const application = await storage.getApplication(MOCK_USER_ID, req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(MOCK_USER_ID, validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid application data", details: error.errors });
      }
      console.error("Error creating application:", error);
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
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
      const application = await storage.updateApplication(MOCK_USER_ID, req.params.id, updates);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const success = await storage.deleteApplication(MOCK_USER_ID, req.params.id);
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
  app.get("/api/interviews", async (req, res) => {
    try {
      const { applicationId, status } = req.query;
      const interviews = await storage.getInterviews(MOCK_USER_ID, {
        applicationId: applicationId as string,
        status: status as string,
      });
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ error: "Failed to fetch interviews" });
    }
  });

  app.get("/api/interviews/upcoming", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const interviews = await storage.getUpcomingInterviews(MOCK_USER_ID, limit);
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching upcoming interviews:", error);
      res.status(500).json({ error: "Failed to fetch upcoming interviews" });
    }
  });

  app.get("/api/interviews/:id", async (req, res) => {
    try {
      const interview = await storage.getInterview(MOCK_USER_ID, req.params.id);
      if (!interview) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      console.error("Error fetching interview:", error);
      res.status(500).json({ error: "Failed to fetch interview" });
    }
  });

  app.post("/api/interviews", async (req, res) => {
    try {
      const validatedData = insertInterviewSchema.parse(req.body);
      const interview = await storage.createInterview(MOCK_USER_ID, validatedData);
      res.status(201).json(interview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid interview data", details: error.errors });
      }
      console.error("Error creating interview:", error);
      res.status(500).json({ error: "Failed to create interview" });
    }
  });

  app.patch("/api/interviews/:id", async (req, res) => {
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
      const interview = await storage.updateInterview(MOCK_USER_ID, req.params.id, updates);
      if (!interview) {
        return res.status(404).json({ error: "Interview not found" });
      }
      res.json(interview);
    } catch (error) {
      console.error("Error updating interview:", error);
      res.status(500).json({ error: "Failed to update interview" });
    }
  });

  app.delete("/api/interviews/:id", async (req, res) => {
    try {
      const success = await storage.deleteInterview(MOCK_USER_ID, req.params.id);
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
  app.get("/api/resources", async (req, res) => {
    try {
      const { category } = req.query;
      const resources = await storage.getResources(MOCK_USER_ID, {
        category: category as string,
      });
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.getResource(MOCK_USER_ID, req.params.id);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(MOCK_USER_ID, validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid resource data", details: error.errors });
      }
      console.error("Error creating resource:", error);
      res.status(500).json({ error: "Failed to create resource" });
    }
  });

  app.patch("/api/resources/:id", async (req, res) => {
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
      const resource = await storage.updateResource(MOCK_USER_ID, req.params.id, updates);
      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      console.error("Error updating resource:", error);
      res.status(500).json({ error: "Failed to update resource" });
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const success = await storage.deleteResource(MOCK_USER_ID, req.params.id);
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
  app.get("/api/questions", async (req, res) => {
    try {
      const { type, search } = req.query;
      const questions = await storage.getQuestions(MOCK_USER_ID, {
        type: type as string,
        search: search as string,
      });
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  app.get("/api/questions/:id", async (req, res) => {
    try {
      const question = await storage.getQuestion(MOCK_USER_ID, req.params.id);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      console.error("Error fetching question:", error);
      res.status(500).json({ error: "Failed to fetch question" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const validatedData = insertQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(MOCK_USER_ID, validatedData);
      res.status(201).json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid question data", details: error.errors });
      }
      console.error("Error creating question:", error);
      res.status(500).json({ error: "Failed to create question" });
    }
  });

  app.patch("/api/questions/:id", async (req, res) => {
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
      const question = await storage.updateQuestion(MOCK_USER_ID, req.params.id, updates);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(question);
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ error: "Failed to update question" });
    }
  });

  app.delete("/api/questions/:id", async (req, res) => {
    try {
      const success = await storage.deleteQuestion(MOCK_USER_ID, req.params.id);
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
