import z from "zod";
import { SpecField, specFieldSchema } from "../../spec";

export default z.array(specFieldSchema).parse([
  {
    name: "type",
    label: "Type",
    type: "select",
    options: ["Air Cooler", "AIO Liquid Cooler", "Custom Loop"],
    validation: z.enum(["Air Cooler", "AIO Liquid Cooler", "Custom Loop"]),
  },
  {
    name: "radiatorSize",
    label: "Radiator Size",
    type: "select",
    options: ["120mm", "240mm", "280mm", "360mm", "420mm"],
    validation: z.enum(["120mm", "240mm", "280mm", "360mm", "420mm"]),
  },
  {
    name: "fanSize",
    label: "Fan Size",
    placeholder: "e.g., 3x 120mm",
    type: "text",
    validation: z.string().optional(),
  },
  {
    name: "tdp",
    label: "TDP Rating",
    placeholder: "e.g., 250W",
    type: "text",
    validation: z.string().optional(),
  },
  {
    name: "height",
    label: "Height",
    placeholder: "e.g., 165mm",
    type: "text",
    validation: z.string().optional(),
  },
] satisfies SpecField[]);
