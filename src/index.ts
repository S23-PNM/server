import { PrismaClient } from "@prisma/client";
import express from "express";
async function main() {
  const app = express();
  const prisma = new PrismaClient();
  app.get("/", (_, res) => {
    return res.json({ hello: "hi" });
  });
  app.post("/api/ingest", async (req, res) => {
    const { location, time, direction } = req.body;
    await prisma.event.create({
      data: {
        location: location,
        time: new Date(Math.round(time) * 1000),
        enter: direction === "right",
      },
    });
    res.status(204).send("");
  });
  const port = 3000 || process.env.PORT;
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
  });
}
main();
