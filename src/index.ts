import { PrismaClient } from "@prisma/client";
import express, { json } from "express";
import morgan from "morgan";
import { groupBy } from "lodash";
const levels = { 30: "empty", 100: "moderate", 150: "crowded" };
function getOccupancyLevel(value: number) {
  let result = "crowded";

  const sortedKeys = Object.keys(levels)
    .map(Number)
    .sort((a, b) => a - b);

  for (let i = 0; i < sortedKeys.length; i++) {
    if (value <= sortedKeys[i]) {
      // @ts-ignore
      result = levels[sortedKeys[i]];
      break;
    }
  }

  return result;
}
async function main() {
  const app = express();
  app.use(json());
  app.use(morgan("dev"));
  const prisma = new PrismaClient();
  app.get("/", (_, res) => {
    return res.json({ hello: "hi" });
  });
  app.post("/api/ingest", async (req, res) => {
    console.log(req.body);
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
  const b = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  app.get("/api/data/mobile", async (req, res) => {
    const b = new Date();
    b.setHours(0, 0, 0, 0);
    const e = new Date();
    e.setHours(23, 59, 59, 999);
    const result = await prisma.event.findMany({
      where: { time: { gte: b, lte: e } },
      select: { enter: true, location: true },
    });

    const data = Object.entries(groupBy(result, "location")).map(
      ([location, data]) => {
        const enter = data.filter((d) => d.enter).length;
        const info = {
          enter,
          exit: data.length - enter,
        };
        const pop = Math.abs(info.enter - info.exit);
        console.log(location, pop);
        return {
          location,
          count: pop,
          level: getOccupancyLevel(pop),
        };
      }
    );

    return res.json({ data: data });
  });
  const port = 8000 || process.env.PORT;
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
  });
}
main();
