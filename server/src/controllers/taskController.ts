import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";




const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.query;
    console.log("projectId from query:", projectId);

  
    if (!projectId || isNaN(Number(projectId))) {
      res.status(400).json({
        success: false,
        message: "Invalid or missing projectId in query.",
      });
      return;
    }
  
    try {
      const tasks = await prisma.task.findMany({
        where: {
          projectId: Number(projectId),
        },
        include: {
          author: true,
          assignee: true,
          comments: true,
          attachments: true,
        },
      });
  
      res.json(tasks);
    } catch (err: any) {
      console.error("Error retrieving tasks:", err);
      res.status(500).json({
        success: false,
        message: `Error retrieving tasks: ${err.message}`,
      });
    }
  };

  export const createTask = async (
    req: Request,
    res: Response
  ): Promise<void> => {

    console.log("Incoming Task Data:", req.body);
  
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorUserId,
      assignedUserId,
    } = req.body;
  
    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          status,
          priority,
          tags,
          startDate: new Date(startDate),
          dueDate: new Date(dueDate),
          points,
          projectId,
          authorUserId,
          assignedUserId,
        },
      });
  
      res.status(201).json(newTask);
    } catch (error: any) {
      console.error("❌ Prisma create error:", error);
      res
        .status(500)
        .json({ message: `Error creating a task: ${error.message}` });
    }
  };
  
  
export const updateTaskStatus = async (
    req:Request,
    res:Response
): Promise<void> => {
    const {taskId} = req.params;
    const {status} = req.body;

    try{
        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId)
            },
            data :{
                status: status
            }
        })

        res.json(updatedTask)
    }catch(err : any){
        res.status(500).json({ message: `Error updating task: ${err.message}` });
    }
}