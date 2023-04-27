import { PrismaClient } from "@prisma/client";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function getRandomDateLastWeek() {
  const now = new Date();
  const lastWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  );
  const startTime = lastWeek.getTime();
  const endTime = now.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}
async function seed() {
  const prisma = new PrismaClient();
  for (const _ of Array(100).keys()) {
    const enter = Math.random() >= 0.5;
    const date = getRandomDateLastWeek();
    await prisma.event.create({
      data: {
        enter,
        location: "FOOD_PANTRY",
        time: date,
      },
    });
    await sleep(20);
    console.log(
      `Generated ${enter ? "Enter" : "Exit"} Event at ${date.toLocaleString()}`
    );
  }
}
seed();
