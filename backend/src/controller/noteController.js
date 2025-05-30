import notesSchema from "../models/notesSchema.js";

export const addNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const existing = await notesSchema.findOne({
      // title: title,
      title: { $regex: title, $options: "i" }, //case insensitive
      userId: req.userId,
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Title already exists",
      });
    }
    const data = await notesSchema.create({
      title,
      content,
      userId: req.userId,
    });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "note created successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "could not access",
    });
  }
};

export const getAllNote = async (req, res) => {
  try {
    const data = await notesSchema.find({ userId: req.userId });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "note fetched successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "could not access",
    });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const data = await notesSchema.findOne({ userId: req.userId, _id: noteId });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "note fetched successfully",
        data: data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "no such note found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "could not access",
    });
  }
};

// export const updateNote = async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const noteId = req.params.id;
//     const data = await notesSchema.findByIdAndUpdate({
//       userId: req.userId,
//       _id: noteId,
//     });

//     data.title = title;
//     data.content = content;
//     data.updatedAt = Date.now();
//     console.log(data);

//     const existing = await notesSchema.findOne({
//       title: title,
//       userId: req.userId,
//     }).select(['-data']);

//     console.log("ex",existing);

//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Title already exists",
//       });
//     }
//     await data.save();

//     return res.status(200).json({
//       success: true,
//       message: "note updated successfully",
//       data: data,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "could not access",
//     });
//   }
// };

export const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;

    // Find the existing note first
    const data = await notesSchema.findOne({
      userId: req.userId,
      _id: noteId,
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Check if another note with the same title exists
    const existing = await notesSchema
      .findOne({
        // title:title,
        title: { $regex: title, $options: "i" },
        userId: req.userId,
        _id: { $ne: noteId }, // Exclude the current note being updated
      })
      .select("-data"); // Exclude 'data' field

    // console.log("ex", existing);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Title already exists",
      });
    }

    // Update and save the note
    data.title = title;
    data.content = content;
    data.updatedAt = Date.now();
    await data.save();

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not update note",
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const data = await notesSchema.findByIdAndDelete({
      userId: req.userId,
      _id: noteId,
    });
    if (data) {
      return res.status(200).json({
        success: true,
        message: "note deleted successfully",
        data: data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "no such note found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "could not access",
    });
  }
};

export const searchNote = async (req, res) => {
  try {
    const { searchText } = req.query;

    if (!searchText) {
      return res.status(403).json({
        success: false,
        message: "searchText is required.",
      });
    }

    const notes = await notesSchema.find({
      userId: req.userId,
      title: { $regex: searchText, $options: "i" },
    });

    if (notes.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Notes fetched successfully.",
        notes,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No notes found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sortNote = async (req, res) => {
  try {
    const sortCriteria = {
      [req.query.sortField]: req.query.sortOrder === "asc" ? 1 : -1,
      [req.query.create]: req.query.sortOrder === "desc" ? -1 : 1,
    };
    // console.log("sort", req.query.sortField, req.query.sortOrder);

    const sortedDocuments = await notesSchema
      .find({ userId: req.userId })
      .sort(sortCriteria);
    // console.log("sorted", sortedDocuments);
    return res.status(200).json({
      success: true,
      sortedDocuments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//paginated notes
export const paginateNote = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 5; // 5 notes per page

    // Calculating the skip value
    const skip = (page - 1) * limit;

    // Getting notes with pagination
    const notes = await notesSchema
      .find({ userId: req.userId })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Notes fetched as per query",
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: "Internal server error",
    });
  }
};

//All in one sort search paginate

export const searchSortPaginateNote = async (req, res) => {
  try {
    const {
      sortField = "title",
      sortOrder = "asc",
      page = 1,
      limit = 6,
      searchText,
    } = req.query;

    // console.log("sewrached", searchText);

    const filter = { userId: req.userId };

    if (searchText) {
      filter.title = { $regex: searchText, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const notes = await notesSchema
      .find(filter)
      .populate("userId", "userName")
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    // console.log("notess", notes);

    const totalNotes = await notesSchema.countDocuments(filter); //total notes in schema of all user
    const totalPages = Math.ceil(totalNotes / limit);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully.",
      notes,
      pagination: {
        totalNotes,
        currentPage: parseInt(page),
        totalPages,
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
