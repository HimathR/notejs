"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCellsRouter = void 0;
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises")); // for saving and loading files
const path_1 = __importDefault(require("path"));
const createCellsRouter = (filename, dir) => {
    // We are going to use the express router to handle all of the requests to the cells route
    const router = express_1.default.Router();
    router.use(express_1.default.json()); // this is a middleware that will parse the body of the request and turn it into a json object
    const fullPath = path_1.default.join(dir, filename);
    // Things to consider (get cells):
    // Make sure the cell storage file exists
    // If it doesn't exist, create a default list of cells
    // If it does exist, parse the list of cells from the file and send back to browser
    router.get("/cells", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isLocalApiError = (err) => {
            return typeof err.code === "string";
        };
        try {
            const result = yield promises_1.default.readFile(fullPath, { encoding: "utf-8" });
            res.send(JSON.parse(result));
        }
        catch (err) {
            if (isLocalApiError(err)) {
                if (err.code === "ENOENT") {
                    // ENOENT = file not found
                    yield promises_1.default.writeFile(fullPath, "[]", "utf-8");
                    res.send([]);
                }
            }
            else {
                throw err;
            }
        }
    }));
    // Things to consider (post cells):
    // Make sure the cell storage file exists
    // If not, create it
    router.post("/cells", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Take the list of cells from the request object
        const { cells } = req.body;
        // Serialize them - i.e. turn it into a format that can be safely written
        // Then, write cells to file
        yield promises_1.default.writeFile(filename, JSON.stringify(cells), "utf-8");
        res.send({ status: "ok" });
    }));
    return router;
};
exports.createCellsRouter = createCellsRouter;
