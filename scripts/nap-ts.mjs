/**
 * Nạp file TypeScript của dự án từ script Node thuần (Node ≥ 23.6 tự bỏ kiểu).
 *
 * Hook chỉ làm hai việc Node không tự làm:
 *   - hiểu alias "@/..." và import không ghi đuôi ("./config" → ./config.ts)
 *   - import JSON không kèm `with { type: "json" }` (data/jobs.ts làm vậy)
 * Không cần cài thêm gói nào.
 *
 * Giới hạn: Node chạy ở chế độ chỉ-bỏ-kiểu, nên file được nạp KHÔNG được dùng
 * enum, namespace, hay "parameter property" (constructor(public x)).
 * Không nạp được file .tsx / file import CSS — chỉ dùng cho data/ và lib/.
 */
import { registerHooks } from "node:module";
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

export const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DUOI = [".ts", ".tsx", ".js", ".mjs", ".json", "/index.ts", ""];

function tim(tuyetDoi) {
  for (const d of DUOI) {
    const p = tuyetDoi + d;
    if (existsSync(p) && statSync(p).isFile()) return p;
  }
  return null;
}

let daDangKy = false;
function dangKy() {
  if (daDangKy) return;
  daDangKy = true;
  // package.json không có "type": "module" (Next không cần) → Node in cảnh
  // báo MODULE_TYPELESS_PACKAGE_JSON cho từng file .ts. Vô hại, tắt cho gọn.
  const phat = process.emitWarning.bind(process);
  process.emitWarning = (w, ...a) => {
    if (String(w).includes("Module type of")) return;
    return phat(w, ...a);
  };
  registerHooks({
    resolve(spec, ctx, next) {
      let dich = null;
      if (spec.startsWith("@/")) dich = tim(path.join(GOC, spec.slice(2)));
      else if ((spec.startsWith("./") || spec.startsWith("../")) && ctx.parentURL?.startsWith("file:")) {
        dich = tim(path.resolve(path.dirname(fileURLToPath(ctx.parentURL)), spec));
      }
      if (dich) return { url: pathToFileURL(dich).href, shortCircuit: true };
      return next(spec, ctx);
    },
    load(url, ctx, next) {
      if (url.endsWith(".json")) {
        const src = readFileSync(fileURLToPath(url), "utf8");
        return { format: "module", source: `export default ${src};`, shortCircuit: true };
      }
      return next(url, ctx);
    },
  });
}

/** napTs("lib/i18n/routes.ts") → module */
export async function napTs(duongDanTuGoc) {
  dangKy();
  return import(pathToFileURL(path.join(GOC, duongDanTuGoc)).href);
}
