import { createComponentSchema } from "@repo/api/models";
import z from "zod";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { db } from "@repo/db";

const gpuSchema = createComponentSchema.extend({
  specifications: z.object({
    chipset: z.string(), // NVIDIA GeForce RTX 4090, AMD Radeon RX 7900 XTX
    memory: z.string(), // 24GB GDDR6X, 16GB GDDR6
    memoryType: z.string().optional(), // GDDR6, GDDR6X
    coreClock: z.string().optional(),
    boostClock: z.string().optional(),
    memoryClock: z.string().optional(),
    cudaCores: z.string().optional(),
    streamProcessors: z.string().optional(),
    tdp: z.string().optional(),
    length: z.string().optional(),
    width: z.string().optional(),
    slots: z.string().optional(), // 2.5 slot, 3 slot
    powerConnectors: z.string().optional(),
    recommendedPsu: z.string().optional(),
    outputs: z.string().optional(),
    rayTracing: z.string().optional(),
    dlss: z.string().optional(),
  }),
});

type GpuSchema = z.infer<typeof gpuSchema>;

const url = "https://www.pc-kombo.com/ca/components/gpu";

const storeToJsonFile = async (gpu: GpuSchema) => {
  const fs = await import("fs/promises");
  const path = `./scraped-data/gpus.json`;

  // store to json file
  let existingData: GpuSchema[] = [];
  try {
    const fileData = await fs.readFile(path, "utf-8");
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.log("No existing data found, creating new file.");
  }

  existingData.push(gpu);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2), "utf-8");
};

const scrapeGpuDetail = async (gpuUrl: string) => {
  const { data } = await axios.get(gpuUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  const $ = cheerio(data);

  const rawPrice = $('span[itemprop="price"]').first().text().trim();
  const price = rawPrice ? parseFloat(rawPrice) : 0;

  // Helper function to get spec value
  const getSpec = (label: string): string => {
    return $("dt")
      .filter((i, el) => $(el).text().trim() === label)
      .next()
      .text()
      .trim();
  };

  const gpu: GpuSchema = {
    name: $("h1[itemprop='name']").first().text().trim(),
    type: "GPU",
    imageUrl: null,
    manufacturer: getSpec("Producer") || null,
    price: price,
    specifications: {
      chipset: getSpec("Chipset") || getSpec("GPU"),
      memory: getSpec("Memory") || getSpec("VRAM"),
      memoryType: getSpec("Memory Type") || getSpec("VRAM Type"),
      coreClock: getSpec("Core Clock") || getSpec("Base Clock"),
      boostClock: getSpec("Boost Clock") || getSpec("GPU Clock"),
      memoryClock: getSpec("Memory Clock"),
      cudaCores: getSpec("CUDA Cores") || getSpec("Cores"),
      streamProcessors: getSpec("Stream Processors") || getSpec("Shaders"),
      tdp: getSpec("TDP") || getSpec("Power Consumption"),
      length: getSpec("Length") || getSpec("Card Length"),
      width: getSpec("Width") || getSpec("Card Width"),
      slots: getSpec("Slots") || getSpec("Slot Width"),
      powerConnectors:
        getSpec("Power Connectors") || getSpec("Power Connector"),
      recommendedPsu: getSpec("Recommended PSU") || getSpec("PSU Requirement"),
      outputs: getSpec("Outputs") || getSpec("Display Outputs"),
      rayTracing: getSpec("Ray Tracing"),
      dlss: getSpec("DLSS") || getSpec("Technology"),
    },
  };

  return gpu;
};

const scrapeGpu = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio(data);

    const gpuElements = $("#hardware li");

    console.log("Found GPU elements count:", gpuElements.length);

    for (let i = 0; i < gpuElements.length; i++) {
      const element = gpuElements[i];
      const url = $(element).find("a").attr("href") || "";

      const gpu = await scrapeGpuDetail(url);
      try {
        const validatedGpu = gpuSchema.parse(gpu);

        const isExisting = await db.component.findFirst({
          where: { name: validatedGpu.name },
        });

        if (isExisting) {
          console.log(`GPU already exists, skipping: ${validatedGpu.name}`);
          continue;
        }

        await db.component.create({
          data: validatedGpu,
        });
        console.log(`Upserted GPU: ${validatedGpu.name}`);
      } catch (error) {
        console.error("Error processing GPU element:", error);
        await storeToJsonFile(gpu);
      }
    }
  } catch (error) {
    console.error("Error scraping GPU data:", error);
  }
};

scrapeGpu();
