import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "formFactor",
    label: "Form Factor",
    type: "select",
    options: ["Full Tower", "Mid Tower", "Mini Tower", "Small Form Factor"],
    validation: z.enum([
      "Full Tower",
      "Mid Tower",
      "Mini Tower",
      "Small Form Factor",
    ]),
  },
  {
    name: "motherboardSupport",
    label: "Motherboard Support",
    placeholder: "e.g., ATX, mATX, ITX",
    type: "text",
    validation: z.string(),
  },
  {
    name: "maxGpuLength",
    label: "Max GPU Length",
    placeholder: "e.g., 380mm",
    type: "text",
    validation: z.string(),
  },
  {
    name: "maxCpuCooler",
    label: "Max CPU Cooler Height",
    placeholder: "e.g., 165mm",
    type: "text",
    validation: z.string(),
  },
  {
    name: "driveBays",
    label: "Drive Bays",
    placeholder: 'e.g., 2x 3.5", 4x 2.5"',
    type: "text",
    validation: z.string(),
  },
] satisfies SpecField[]);
