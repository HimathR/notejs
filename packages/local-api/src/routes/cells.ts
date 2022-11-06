import express from "express";
import fs from "fs/promises"; // for saving and loading files
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

interface LocalApiError {
  code: string;
}

export const createCellsRouter = (filename: string, dir: string) => {
  // We are going to use the express router to handle all of the requests to the cells route
  const router = express.Router();
  router.use(express.json()); // this is a middleware that will parse the body of the request and turn it into a json object
  const fullPath = path.join(dir, filename);

  // Things to consider (get cells):
  // Make sure the cell storage file exists
  // If it doesn't exist, create a default list of cells
  // If it does exist, parse the list of cells from the file and send back to browser
  router.get("/cells", async (req: any, res: any) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === "string";
    };

    try {
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      res.send(JSON.parse(result));
    } catch (err) {
      if (isLocalApiError(err)) {
        if (err.code === "ENOENT") {
          // ENOENT = file not found
          await fs.writeFile(fullPath, "[]", "utf-8");
          res.send([]);
        }
      } else {
        throw err;
      }
    }
  });

  // Things to consider (post cells):
  // Make sure the cell storage file exists
  // If not, create it
  router.post("/cells", async (req: any, res: any) => {
    // Take the list of cells from the request object
    const { cells }: { cells: Cell[] } = req.body;

    // Serialize them - i.e. turn it into a format that can be safely written
    // Then, write cells to file
    await fs.writeFile(filename, JSON.stringify(cells), "utf-8");
    res.send({ status: "ok" });
  });
  return router;
};
