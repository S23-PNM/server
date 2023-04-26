import { PrismaClient } from "@prisma/client";
import express, { json } from "express";
async function main() {
  const app = express();
  app.use(json())
  const prisma = new PrismaClient();
  app.get("/", (_, res) => {
    return res.json({ hello: "hi" });
  });
  app.post("/api/ingest", async (req, res) => {
    console.log(req.body)
    const { location, time, direction } = req.body;
    await prisma.event.create({
      data: {
        location: location,
        time: new Date(Math.round(time)),
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
