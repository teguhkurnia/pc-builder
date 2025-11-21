import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "capacity",
    label: "Capacity",
    type: "select",
    options: ["8GB", "16GB", "32GB", "64GB", "128GB"],
    validation: z.string().regex(/^\d+GB$/),
  },
  {
    name: "speed",
    label: "Speed",
    placeholder: "e.g., 3200MHz",
    type: "text",
    validation: z.string().regex(/^\d+MHz$/),
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    options: ["DDR4", "DDR5"],
    validation: z.enum(["DDR4", "DDR5"]),
  },
  {
    name: "cas",
    label: "CAS Latency",
    placeholder: "e.g., CL16",
    type: "text",
    validation: z.string().regex(/^CL\d+$/),
  },
  {
    name: "voltage",
    label: "Voltage",
    placeholder: "e.g., 1.35V",
    type: "text",
    validation: z.string().regex(/^\d+(\.\d+)?V$/),
  },
] satisfies SpecField[]);
