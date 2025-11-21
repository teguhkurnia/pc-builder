import { z } from "zod";
import { SpecField } from "../models";

export const generateZodSchema = (fields: SpecField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    shape[field.name] = field.validation;
  });

  return z.object(shape);
};
