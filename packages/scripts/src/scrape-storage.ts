import { createComponentSchema } from "@repo/api/models";
import z from "zod";
import axios from "axios";
import { load as cheerio } from "cheerio";
import { db } from "@repo/db";

const storageSchema = createComponentSchema.extend({
  specifications: z.object({
    type: z.string(), // SSD, HDD, NVMe
    capacity: z.string(), // 500GB, 1TB, 2TB, etc
    interface: z.string(), // SATA, NVMe, M.2
    formFactor: z.string().optional(), // 2.5", 3.5", M.2 2280
    readSpeed: z.string().optional(),
    writeSpeed: z.string().optional(),
    cache: z.string().optional(),
    tbw: z.string().optional(), // Terabytes Written
    nandType: z.string().optional(), // TLC, QLC, MLC
    controller: z.string().optional(),
    rpm: z.string().optional(), // For HDDs
    warranty: z.string().optional(),
  }),
});

type StorageSchema = z.infer<typeof storageSchema>;

const url = "https://www.pc-kombo.com/ca/components/storage";

const storeToJsonFile = async (storage: StorageSchema) => {
  const fs = await import("fs/promises");
  const path = `./scraped-data/storages.json`;

  // store to json file
  let existingData: StorageSchema[] = [];
  try {
    const fileData = await fs.readFile(path, "utf-8");
    existingData = JSON.parse(fileData);
  } catch (error) {
    console.log("No existing data found, creating new file.");
  }

  existingData.push(storage);

  await fs.writeFile(path, JSON.stringify(existingData, null, 2), "utf-8");
};

const scrapeStorageDetail = async (storageUrl: string) => {
  const { data } = await axios.get(storageUrl, {
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

  const storage: StorageSchema = {
    name: $("h1[itemprop='name']").first().text().trim(),
    type: "STORAGE",
    imageUrl: null,
    price: price,
    specifications: {
      type: getSpec("Type") || getSpec("Storage Type"),
      capacity: getSpec("Capacity") || getSpec("Size"),
      interface: getSpec("Interface") || getSpec("Connection"),
      formFactor: getSpec("Form Factor") || getSpec("Format"),
      readSpeed: getSpec("Read Speed") || getSpec("Sequential Read"),
      writeSpeed: getSpec("Write Speed") || getSpec("Sequential Write"),
      cache: getSpec("Cache") || getSpec("Buffer"),
      tbw: getSpec("TBW") || getSpec("Endurance"),
      nandType: getSpec("NAND Type") || getSpec("Memory Type"),
      controller: getSpec("Controller"),
      rpm: getSpec("RPM") || getSpec("Rotational Speed"),
      warranty: getSpec("Warranty"),
    },
  };

  return storage;
};

const scrapeStorage = async () => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio(data);

    const storageElements = $("#hardware li");

    console.log("Found Storage elements count:", storageElements.length);

    for (let i = 0; i < storageElements.length; i++) {
      const element = storageElements[i];
      const url = $(element).find("a").attr("href") || "";

      const storage = await scrapeStorageDetail(url);
      try {
        const validatedStorage = storageSchema.parse(storage);

        const isExisting = await db.component.findFirst({
          where: { name: validatedStorage.name },
        });

        if (isExisting) {
          console.log(
            `Storage already exists, skipping: ${validatedStorage.name}`,
          );
          continue;
        }

        await db.component.create({
          data: validatedStorage,
        });
        console.log(`Upserted Storage: ${validatedStorage.name}`);
      } catch (error) {
        console.error("Error processing Storage element:", error);
        await storeToJsonFile(storage);
      }
    }
  } catch (error) {
    console.error("Error scraping Storage data:", error);
  }
};

scrapeStorage();
