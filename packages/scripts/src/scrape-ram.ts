import { createComponentSchema } from "@repo/api/models";
import z from "zod";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { db } from "@repo/db";

const ramSchema = createComponentSchema.extend({
  specifications: z.object({
    type: z.string(), // DDR4, DDR5
    capacity: z.string(), // 8GB, 16GB, 32GB, etc
    speed: z.string(), // 3200MHz, 3600MHz, etc
    modules: z.string(), // 1x8GB, 2x8GB, etc
    casLatency: z.string().optional(),
    voltage: z.string().optional(),
    ecc: z.string().optional(),
    rgb: z.string().optional(),
  }),
});

type RamSchema = z.infer<typeof ramSchema>;

const url = "https://www.pc-kombo.com/ca/components/ram";

const storeToJsonFile = async (ram: RamSchema) => {
  const fs = await import("fs/promises");
  const path = `./scraped-data/rams.json`;

  // store to json file
  let existingData: RamSchema[] = [];
  try {
    const fileData = await fs.readFile(path, "utf-8");
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.log("No existing data found, creating new file.");
  }

  existingData.push(ram);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2), "utf-8");
};

const scrapeRamDetail = async (ramUrl: string) => {
  const { data } = await axios.get(ramUrl, {
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

  const ram: RamSchema = {
    name: $("h1[itemprop='name']").first().text().trim(),
    type: "RAM",
    imageUrl: null,
    price: price,
    specifications: {
      type: getSpec("Type") || getSpec("Memory Type"),
      capacity: getSpec("Capacity") || getSpec("Size"),
      speed: getSpec("Speed") || getSpec("Frequency"),
      modules: getSpec("Modules") || getSpec("Configuration"),
      casLatency: getSpec("CAS Latency") || getSpec("Latency"),
      voltage: getSpec("Voltage"),
      ecc: getSpec("ECC"),
      rgb: getSpec("RGB") || getSpec("Lighting"),
    },
  };

  return ram;
};

const scrapeRam = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio(data);

    const ramElements = $("#hardware li");

    console.log("Found RAM elements count:", ramElements.length);

    for (let i = 0; i < ramElements.length; i++) {
      const element = ramElements[i];
      const url = $(element).find("a").attr("href") || "";

      const ram = await scrapeRamDetail(url);
      try {
        const validatedRam = ramSchema.parse(ram);

        const isExisting = await db.component.findFirst({
          where: { name: validatedRam.name },
        });

        if (isExisting) {
          console.log(`RAM already exists, skipping: ${validatedRam.name}`);
          continue;
        }

        await db.component.create({
          data: validatedRam,
        });
        console.log(`Upserted RAM: ${validatedRam.name}`);
      } catch (error) {
        console.error("Error processing RAM element:", error);
        await storeToJsonFile(ram);
      }
    }
  } catch (error) {
    console.error("Error scraping RAM data:", error);
  }
};

scrapeRam();
