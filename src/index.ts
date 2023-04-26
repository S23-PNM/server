import express from "express";
async function main() {
  const app = express();
  app.get("/", (_, res) => {
    return res.json({ hello: "hi" });
  });
  const port = 3000 || process.env.PORT;
  app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
  });
}
main();
