import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { cloneDeep } from "lodash";

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = (prisma as any)[modelName];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  // The order in which tables must be purged / seeded:
  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  // 1️⃣ First, delete everything
  await deleteAllData(orderedFileNames);

  // 2️⃣ Then, seed each model
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Determine the Prisma model (e.g. "user.json" → prisma.user)
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = (prisma as any)[modelName];

    try {
      for (const rawData of jsonData) {
        // 🔥 Clone & strip out any `id` before create
        const createData = cloneDeep(rawData);
        if ("id" in createData) {
          delete createData.id;
        }

        await model.create({ data: createData });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
