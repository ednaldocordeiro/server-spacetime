"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/memories.ts
var memories_exports = {};
__export(memories_exports, {
  memoriesRoutes: () => memoriesRoutes
});
module.exports = __toCommonJS(memories_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query"]
});

// src/routes/memories.ts
var import_zod = require("zod");
async function memoriesRoutes(app) {
  app.addHook("preHandler", async (req) => {
    await req.jwtVerify();
  });
  app.get("/memories", async (req, res) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: req.user.sub
      },
      orderBy: {
        createdAt: "asc"
      }
    });
    return memories.map((memory) => ({
      ...memory,
      content: memory.content.substring(0, 120).concat("...")
    }));
  });
  app.get("/memories/:id", async (req, res) => {
    const paramsSchema = import_zod.z.object({
      id: import_zod.z.string().uuid()
    });
    const { id } = paramsSchema.parse(req.params);
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id
      }
    });
    if (!memory.isPublic && memory.userId !== req.user.sub) {
      return res.status(401).send();
    }
    return memory;
  });
  app.post("/memories", async (req, res) => {
    const bodySchema = import_zod.z.object({
      content: import_zod.z.string(),
      isPublic: import_zod.z.coerce.boolean().default(false),
      coverUrl: import_zod.z.string()
    });
    const { content, isPublic, coverUrl } = bodySchema.parse(req.body);
    const memory = await prisma.memory.create({
      data: {
        content,
        coveryUrl: coverUrl,
        isPublic,
        userId: req.user.sub
      }
    });
    return memory;
  });
  app.put("/memories/:id", async (req, res) => {
    const paramsSchema = import_zod.z.object({
      id: import_zod.z.string().uuid()
    });
    const { id } = paramsSchema.parse(req.params);
    const bodySchema = import_zod.z.object({
      content: import_zod.z.string(),
      isPublic: import_zod.z.coerce.boolean().default(false),
      coverUrl: import_zod.z.string()
    });
    const { content, isPublic, coverUrl } = bodySchema.parse(req.body);
    let memory = await prisma.memory.findFirstOrThrow({
      where: {
        id
      }
    });
    if (memory.userId !== req.user.sub) {
      return res.status(404).send();
    }
    memory = await prisma.memory.update({
      where: {
        id
      },
      data: {
        content,
        coveryUrl: coverUrl,
        isPublic
      }
    });
    return memory;
  });
  app.delete("/memories/:id", async (req, res) => {
    const paramsSchema = import_zod.z.object({
      id: import_zod.z.string().uuid()
    });
    const { id } = paramsSchema.parse(req.params);
    const memory = await prisma.memory.findFirstOrThrow({
      where: {
        id
      }
    });
    if (memory.userId !== req.user.sub) {
      return res.status(404).send();
    }
    await prisma.memory.delete({
      where: {
        id
      }
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  memoriesRoutes
});
