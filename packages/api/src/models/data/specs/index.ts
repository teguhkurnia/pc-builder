import { SpecField } from "../../spec";
import cooling from "./cooling";
import cpuData from "./cpu";
import gpu from "./gpu";
import motherboard from "./motherboard";
import psu from "./psu";
import ram from "./ram";
import storage from "./storage";
import caseData from "./case";
import { generateZodSchema } from "../../../utils/schema-helper";

export const SpecsConfig: Record<string, SpecField[]> = {
  CPU: cpuData,
  MOTHERBOARD: motherboard,
  RAM: ram,
  STORAGE: storage,
  GPU: gpu,
  PSU: psu,
  CASE: caseData,
  COOLING: cooling,
};

export const getSpecFieldSchema = (type: string) => {
  // Casting key agar TypeScript aman
  const fields = SpecsConfig[type as keyof typeof SpecsConfig];

  if (!fields) return null; // Atau z.object({})

  return generateZodSchema(fields);
};
