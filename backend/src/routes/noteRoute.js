import express from "express";
import {
  addNote,
  deleteNote,
  getAllNote,
  getNoteById,
  paginateNote,
  searchNote,
  searchSortPaginateNote,
  sortNote,
  updateNote,
} from "../controller/noteController.js";
import { hasToken } from "../middleware/hasToken.js";
import { noteSchema, validateNote } from "../validators/noteValidate.js";

const routeNote = express.Router();

routeNote.post("/create", hasToken, validateNote(noteSchema), addNote);
routeNote.get("/getAll", hasToken, getAllNote);
routeNote.get("/getById/:id", hasToken, getNoteById);
routeNote.put("/updateNote/:id", hasToken, updateNote);
routeNote.delete("/deleteNote/:id", hasToken, deleteNote);
routeNote.get("/searchNote", hasToken, searchNote);
routeNote.get("/sortNote", hasToken, sortNote);
routeNote.get("/paginateNote", hasToken, paginateNote);
routeNote.get("/searchSortPaginateNote", hasToken, searchSortPaginateNote);

export default routeNote;
