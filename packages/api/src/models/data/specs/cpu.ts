import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "cores",
    label: "Cores",
    type: "number",
    placeholder: "e.g., 24",
    validation: z
      .number("Number of cores must be between 1 and 128")
      .min(1)
      .max(128),
  },
  {
    name: "threads",
    label: "Threads",
    type: "number",
    placeholder: "e.g., 32",
    validation: z

      .number("Number of threads must be between 1 and 256")
      .min(1)
      .max(256),
  },
  {
    name: "baseClock",
    label: "Base Clock",
    type: "text",
    placeholder: "e.g., 3.0 GHz",
    validation: z
      .string("Base clock must be in the format of a number followed by GHz")
      .regex(/^\d+(\.\d+)?\s?GHz$/, "Must be in GHz format"),
  },
  {
    name: "boostClock",
    label: "Boost Clock",
    type: "text",
    placeholder: "e.g., 5.8 GHz",
    validation: z
      .string("Boost clock must be in the format of a number followed by GHz")
      .regex(/^\d+(\.\d+)?\s?GHz$/, "Must be in GHz format"),
  },
  {
    name: "tdp",
    label: "TDP",
    placeholder: "e.g., 125W",
    validation: z
      .string("TDP must be in the format of a number followed by W")
      .regex(/^\d+\s?W$/, "Must be in Watts format"),
    type: "text",
  },
  {
    name: "socket",
    label: "Socket",
    type: "select",
    options: ["LGA1700", "LGA1200", "AM5", "AM4", "LGA2066"],
    validation: z.enum(["LGA1700", "LGA1200", "AM5", "AM4", "LGA2066"]),
  },
] satisfies SpecField[]);
