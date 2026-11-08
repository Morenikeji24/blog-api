import z from "zod";

export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1),
  published: z.boolean().optional(),
});

export const updatePostSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().min(1),
  })
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: "Provide title and/or content",
  });

export const publishSchema = z.object({ published: z.boolean() });
