import { createComponentSchema } from "@repo/api/models";
import z from "zod";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { db } from "@repo/db";

const cpuSchema = createComponentSchema.extend({
  specifications: z.object({
    // Clock speeds
    baseClock: z.string(), // Base/Core clock
    boostClock: z.string().optional(), // Turbo/Boost clock
    unlockedMultiplier: z.string().optional(), // Yes/No or checkmark

    // Cores & Threads
    cores: z.number().min(1).max(128),
    threads: z.number().min(1).max(256),

    // Cache
    l1Cache: z.string().optional(),
    l2Cache: z.string().optional(),
    l3Cache: z.string().optional(),

    // Power & Socket
    tdp: z.string(), // Thermal Design Power
    socket: z.string(), // CPU socket type

    // Graphics
    integratedGraphics: z.string().optional(), // GPU model or "No"

    // Additional Info
    architecture: z.string().optional(), // Zen 4, Raptor Lake, etc
    process: z.string().optional(), // 5nm, 7nm, etc
    maxMemory: z.string().optional(), // Max RAM support
    memoryChannels: z.string().optional(), // Dual/Quad channel
    pcieVersion: z.string().optional(), // PCIe 4.0, 5.0, etc
    productPage: z.string().optional(), // Manufacturer URL
  }),
});

type CpuSchema = z.infer<typeof cpuSchema>;

const url = "https://www.pc-kombo.com/ca/components/cpus";

const storeToJsonFile = async (cpu: CpuSchema) => {
  const fs = await import("fs/promises");
  const path = `./scraped-data/cpus.json`;

  // store to json file
  let existingData: CpuSchema[] = [];
  try {
    const fileData = await fs.readFile(path, "utf-8");
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.log("No existing data found, creating new file.");
  }

  existingData.push(cpu);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2), "utf-8");
};

const scrapeCpuDetail = async (cpuUrl: string) => {
  const { data } = await axios.get(cpuUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  const $ = cheerio(data);

  const rawPrice = $('span[itemprop="price"]').first().text().trim();
  const price = rawPrice ? parseFloat(rawPrice) : 0;

  // Helper function to get spec value by label
  const getSpec = (label: string): string => {
    return $("dt")
      .filter((i, el) => $(el).text().trim() === label)
      .next()
      .text()
      .trim();
  };

  // Helper function to parse number from string
  const parseNumber = (value: string): number => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Get integrated graphics (handle checkmark or text)
  const integratedGraphics = getSpec("Integrated graphics");
  const hasIntegratedGraphics =
    integratedGraphics &&
    integratedGraphics !== "✘" &&
    integratedGraphics !== "No"
      ? integratedGraphics
      : undefined;

  const cpu: CpuSchema = {
    name: $("h1[itemprop='name']").first().text().trim(),
    type: "CPU",
    imageUrl: null,
    manufacturer: getSpec("Producer") || null,
    price: price,
    specifications: {
      // Clock speeds
      baseClock: getSpec("Base Clock") || getSpec("Clock"),
      boostClock: getSpec("Turbo Clock") || getSpec("Boost Clock") || undefined,
      unlockedMultiplier: getSpec("Unlocked Multiplier") || undefined,

      // Cores & Threads
      cores: parseNumber(getSpec("Cores")),
      threads: parseNumber(getSpec("Threads")),

      // Cache
      l1Cache: getSpec("L1 Cache") || undefined,
      l2Cache: getSpec("L2 Cache") || undefined,
      l3Cache: getSpec("L3 Cache") || getSpec("Cache") || undefined,

      // Power & Socket
      tdp: getSpec("TDP"),
      socket: getSpec("Socket"),

      // Graphics
      integratedGraphics: hasIntegratedGraphics,

      // Additional Info
      architecture:
        getSpec("Architecture") || getSpec("Microarchitecture") || undefined,
      process:
        getSpec("Process") || getSpec("Manufacturing Process") || undefined,
      maxMemory:
        getSpec("Max Memory") || getSpec("Memory Support") || undefined,
      memoryChannels: getSpec("Memory Channels") || undefined,
      pcieVersion:
        getSpec("PCIe Version") || getSpec("PCI Express") || undefined,
      productPage: getSpec("Product Page") || undefined,
    },
  };

  return cpu;
};

const scrapeCpu = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio(data);

    const cpuElements = $("#hardware li");

    console.log("Found CPU elements count:", cpuElements.length);

    for (let i = 371; i < cpuElements.length; i++) {
      const element = cpuElements[i];
      const url = $(element).find("a").attr("href") || "";

      const cpu = await scrapeCpuDetail(url);
      try {
        const validatedCpu = cpuSchema.parse(cpu);

        const isExisting = await db.component.findFirst({
          where: { name: validatedCpu.name },
        });

        if (isExisting) {
          console.log(`CPU already exists, skipping: ${validatedCpu.name}`);
          continue;
        }

        await db.component.create({
          data: validatedCpu,
        });
        console.log(`Upserted CPU: ${validatedCpu.name}`);
      } catch (error) {
        console.error("Error processing CPU element:", error);
        await storeToJsonFile(cpu);
      }
    }
  } catch (error) {
    console.error("Error scraping CPU data:", error);
  }
};

scrapeCpu();
