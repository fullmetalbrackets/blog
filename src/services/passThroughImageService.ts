import type { LocalImageService } from "astro";
import { baseService } from "astro/assets";

// Image service ("sharp") not supported by Cloudflare pages
// https://github.com/withastro/astro/issues/4109
const service: LocalImageService = {
  ...baseService,
  getURL({ src }) {
    const path = typeof src === "string" ? src : src.src;
    return path;
  },
  async transform(buffer, transform) {
    return {
      data: buffer,
      format: transform.format,
    };
  },
};

export default service;