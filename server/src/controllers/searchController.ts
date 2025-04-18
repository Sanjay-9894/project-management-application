import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import { promises } from "dns";

const prisma = new PrismaClient();

export const search = async (
    req: Request,
    res: Response
): Promise<void> =>{
    const {query} = req.query;

    try{
        const tasks = await prisma.task.findMany({
            where:{
                OR:[
                    {title: {contains: query as string}},
                    {description : {contains: query as string}}
                ]
            }
        })

        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    {name : {contains :query as string}},
                    {description : {contains: query as string}}
                ]
            }
        })

        const users = await prisma.user.findMany({
            where: {
              OR: [{ username: { contains: query as string } }],
            },
        });

       
    res.status(201).json({ tasks, projects, users });

    }catch(err: any){
        console.log("error in searching with query word",err);
        res.status(500).json({
            success: false,
            message: `Error in performing search ${err.message}`
        })
    }

}