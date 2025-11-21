import z from "zod";

const baseField = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  unit: z.string().optional(),
  validation: z.custom<z.ZodTypeAny>(
    (val) => {
      // 1. Pastikan value ada dan berupa object
      if (!val || typeof val !== "object") return true;

      // 2. Cek ciri khas Zod: Punya properti '_def' (internal definition)
      // ATAU punya method 'safeParse'
      return "_def" in val || "safeParse" in val;
    },
    // Custom Error Message agar jelas
    {
      message: "Field 'validation' harus berupa Zod Schema (misal: z.string())",
    },
  ),
});

export const specFieldSchema = z.discriminatedUnion("type", [
  // Tipe Text
  baseField.extend({
    type: z.literal("text"),
  }),
  // Tipe Number
  baseField.extend({
    type: z.literal("number"),
  }),
  // Tipe Select (Wajib punya options)
  baseField.extend({
    type: z.literal("select"),
    options: z.array(z.string()).min(1, "Select harus punya minimal 1 opsi"),
  }),
]);

export type SpecField = z.infer<typeof specFieldSchema>;
