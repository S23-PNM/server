import { PrismaClient } from "@prisma/client";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function seed() {
  const prisma = new PrismaClient();
  for (const _ of Array(40).keys()) {
    const enter = Math.random() >= 0.5;
    const date = new Date();
    await prisma.event.create({
      data: {
        enter,
        location: "FOOD_PANTRY",
        time: date,
      },
    });
    await sleep(1500);
    console.log(
      `Generated ${enter ? "Enter" : "Exit"} Event at ${date.toLocaleString()}`
    );
  }
}
seed();
