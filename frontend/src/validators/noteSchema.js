import * as yup from "yup";

const noteSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(5, " Title must be at least 5 characters")
    .max(20, " Title must be at most 20 characters"),
  content: yup
    .string()
    .trim()
    .min(10, " Content must be at least 10 characters"),
});

export default noteSchema;
