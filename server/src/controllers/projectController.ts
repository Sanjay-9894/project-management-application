import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";


console.log('🛠  [projectController] DATABASE_URL:', process.env.DATABASE_URL);
const prisma = new PrismaClient();

export const getProjects = async (
    req: Request,
    res: Response
):Promise<void> =>{
    try{
        const projects = await prisma.project.findMany();
    
        res.json(projects);
    }catch(err){
        console.log("Error",err);
        res.status(500).json({
            success: false,
            message :"Error retriving projects"
        })

    }
}


export const createProject = async (req: Request, res: Response) => {
    try {
      const { name, description, startDate, endDate } = req.body;
      
    // Just to be safe: delete 'id' if it somehow came in
    if ("id" in req.body) delete req.body.id;
    
      const newProject = await prisma.project.create({
        data: {
          name,
          description,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      });
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error in creating project", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  };