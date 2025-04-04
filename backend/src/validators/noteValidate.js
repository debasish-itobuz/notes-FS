import yup from "yup";

export const noteSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(20, "Title must be at most 20 characters"),
  content: yup.string().trim().min(5, "Content must be at least 5 characters"),
});

export const validateNote = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ errors: err.errors });
  }
};
