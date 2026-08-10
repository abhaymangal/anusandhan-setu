import { createServer } from "node:http";
import { readFile, mkdir, stat, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { resolve, extname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from "node:crypto";

const ROOT = resolve(import.meta.dirname);
const DIST = join(ROOT, "dist");
const PRIVATE_FILES = join(ROOT, ".setu-data", "files");
await mkdir(PRIVATE_FILES, { recursive: true });
const db = new DatabaseSync(join(ROOT, ".setu-data", "setu.db"));
db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");

const statements = [
  `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('researcher','company','officer','manager')), organisation_id TEXT, confirmation_status TEXT NOT NULL DEFAULT 'needed', orcid_id TEXT, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS organisations (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), extra_checked_at TEXT, expires_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS permissions (user_id TEXT PRIMARY KEY REFERENCES users(id), can_upload INTEGER NOT NULL DEFAULT 0, can_approve_sharing INTEGER NOT NULL DEFAULT 0, can_agree_test INTEGER NOT NULL DEFAULT 0, can_approve_payment INTEGER NOT NULL DEFAULT 0, confirmed_by TEXT, confirmed_at TEXT)`,
  `CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, record_id TEXT NOT NULL, owner_id TEXT NOT NULL REFERENCES users(id), name TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL, checksum TEXT NOT NULL, access_level TEXT NOT NULL CHECK(access_level IN ('public','signed_in','agreement','named')), version INTEGER NOT NULL, replaces_id TEXT, scan_status TEXT NOT NULL, path TEXT NOT NULL, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS file_access (id TEXT PRIMARY KEY, file_id TEXT NOT NULL REFERENCES files(id), user_id TEXT REFERENCES users(id), purpose TEXT NOT NULL, outcome TEXT NOT NULL, opened_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS file_grants (file_id TEXT NOT NULL REFERENCES files(id), user_id TEXT NOT NULL REFERENCES users(id), expires_at TEXT, PRIMARY KEY(file_id,user_id))`,
  `CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, context_type TEXT NOT NULL, context_id TEXT NOT NULL, kind TEXT NOT NULL, author_id TEXT NOT NULL REFERENCES users(id), body TEXT NOT NULL, due_at TEXT, created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS approvals (id TEXT PRIMARY KEY, record_id TEXT NOT NULL, step TEXT NOT NULL, record_version TEXT NOT NULL, status TEXT NOT NULL, reason TEXT NOT NULL, limits_text TEXT, ends_at TEXT, decided_by TEXT NOT NULL REFERENCES users(id), created_at TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS service_cache (cache_key TEXT PRIMARY KEY, value_json TEXT NOT NULL, source_url TEXT NOT NULL, checked_at TEXT NOT NULL, expires_at TEXT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_messages_context ON messages(context_type,context_id,created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_approvals_record ON approvals(record_id,created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_files_record ON files(record_id,version)`,
];
for (const sql of statements) db.prepare(sql).run();

const now = () => new Date().toISOString();
const json = (res, status, body, headers = {}) => { res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...headers }); res.end(JSON.stringify(body)); };
const cookies = (req) => Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map((v) => v.trim().split(/=(.*)/s).slice(0,2).map(decodeURIComponent)));
const hashToken = (token) => createHash("sha256").update(token).digest("hex");
const passwordHash = (password) => { const salt = randomBytes(16); return `${salt.toString("hex")}:${scryptSync(password, salt, 64).toString("hex")}`; };
const passwordOk = (password, stored) => { const [saltHex, keyHex] = stored.split(":"); const actual = scryptSync(password, Buffer.from(saltHex, "hex"), 64); return timingSafeEqual(actual, Buffer.from(keyHex, "hex")); };

async function body(req, max = 10_000_000) {
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > max) throw new Error("Request too large"); chunks.push(chunk); }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
}

function currentUser(req) {
  const token = cookies(req).setu_session; if (!token) return null;
  return db.prepare(`SELECT u.id,u.email,u.name,u.role,u.organisation_id AS organisationId,u.confirmation_status AS confirmationStatus,u.orcid_id AS orcidId,s.extra_checked_at AS extraCheckedAt FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`).get(hashToken(token), now()) || null;
}

function requireUser(req, res, roles) {
  const user = currentUser(req); if (!user) { json(res, 401, { error: "Please sign in first." }); return null; }
  if (roles && !roles.includes(user.role)) { json(res, 403, { error: "Your role cannot do this action." }); return null; }
  return user;
}

function requireExtraCheck(user, res) {
  if (!user.extraCheckedAt || Date.now() - Date.parse(user.extraCheckedAt) > 10 * 60_000) { json(res, 403, { error: "extra_check_needed" }); return false; }
  return true;
}

function requireConfirmed(user, res) {
  if (user.confirmationStatus !== "confirmed" && user.role !== "manager") { json(res, 403, { error: "Your organisation must confirm this account first." }); return false; }
  return true;
}

async function api(req, res, url) {
  if (url.pathname === "/api/account/signup" && req.method === "POST") {
    const input = await body(req); if (!input.email || !input.name || String(input.password).length < 10) return json(res, 400, { error: "Use your name, email and a password of at least 10 characters." });
    if (!["researcher","company","officer"].includes(input.role)) return json(res, 400, { error: "Choose a valid account type." });
    const isBootstrapManager = process.env.SETU_BOOTSTRAP_MANAGER_EMAIL?.toLowerCase() === input.email.toLowerCase() && !db.prepare("SELECT 1 FROM users WHERE role='manager'").get();
    const role = isBootstrapManager ? "manager" : input.role;
    const id = randomUUID();
    try { db.prepare("INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?)").run(id, input.email.toLowerCase(), input.name, passwordHash(input.password), role, null, role === "manager" ? "confirmed" : "needed", null, now()); db.prepare("INSERT INTO permissions(user_id) VALUES(?)").run(id); }
    catch { return json(res, 409, { error: "An account with this email already exists." }); }
    return json(res, 201, { ok: true });
  }
  if (url.pathname === "/api/account/login" && req.method === "POST") {
    const input = await body(req); const row = db.prepare("SELECT * FROM users WHERE email=?").get(String(input.email || "").toLowerCase());
    if (!row || !passwordOk(String(input.password || ""), row.password_hash)) return json(res, 401, { error: "Email or password is incorrect." });
    const token = randomBytes(32).toString("base64url"); db.prepare("INSERT INTO sessions VALUES(?,?,NULL,?)").run(hashToken(token), row.id, new Date(Date.now()+7*86400000).toISOString());
    return json(res, 200, { ok: true }, { "set-cookie": `setu_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800` });
  }
  if (url.pathname === "/api/account/logout" && req.method === "POST") { const token = cookies(req).setu_session; if (token) db.prepare("DELETE FROM sessions WHERE token_hash=?").run(hashToken(token)); return json(res, 200, { ok:true }, { "set-cookie":"setu_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" }); }
  if (url.pathname === "/api/account/me" && req.method === "GET") { const user = currentUser(req); return json(res, 200, { user }); }
  if (url.pathname === "/api/account/extra-check" && req.method === "POST") { const user=requireUser(req,res); if(!user)return; const input=await body(req); const row=db.prepare("SELECT password_hash FROM users WHERE id=?").get(user.id); if(!passwordOk(input.password||"",row.password_hash))return json(res,401,{error:"Password is incorrect."}); db.prepare("UPDATE sessions SET extra_checked_at=? WHERE user_id=?").run(now(),user.id); return json(res,200,{ok:true}); }

  if (url.pathname === "/api/organisation/people" && req.method === "GET") { const user=requireUser(req,res,["officer","manager"]); if(!user||!requireConfirmed(user,res))return; return json(res,200,{people:db.prepare("SELECT id,name,email,role,confirmation_status AS confirmationStatus FROM users ORDER BY created_at DESC").all()}); }
  if (url.pathname.startsWith("/api/organisation/people/") && req.method === "POST") { const user=requireUser(req,res,["officer","manager"]); if(!user||!requireConfirmed(user,res)||!requireExtraCheck(user,res))return; const id=url.pathname.split("/").at(-1); const input=await body(req); db.prepare("UPDATE users SET confirmation_status=? WHERE id=?").run(input.confirm ? "confirmed":"rejected",id); db.prepare("UPDATE permissions SET can_upload=?,can_approve_sharing=?,can_agree_test=?,can_approve_payment=?,confirmed_by=?,confirmed_at=? WHERE user_id=?").run(input.canUpload?1:0,input.canApproveSharing?1:0,input.canAgreeTest?1:0,input.canApprovePayment?1:0,user.id,now(),id); return json(res,200,{ok:true}); }

  if (url.pathname === "/api/messages" && req.method === "GET") { const user=requireUser(req,res); if(!user)return; return json(res,200,{messages:db.prepare("SELECT m.*,u.name AS authorName FROM messages m JOIN users u ON u.id=m.author_id WHERE context_type=? AND context_id=? ORDER BY created_at").all(url.searchParams.get("contextType"),url.searchParams.get("contextId"))}); }
  if (url.pathname === "/api/messages" && req.method === "POST") { const user=requireUser(req,res); if(!user)return; const input=await body(req); db.prepare("INSERT INTO messages VALUES(?,?,?,?,?,?,?,?)").run(randomUUID(),input.contextType,input.contextId,input.kind,user.id,input.body,input.dueAt||null,now()); return json(res,201,{ok:true}); }

  if (url.pathname === "/api/approvals" && req.method === "GET") { const user=requireUser(req,res); if(!user)return; return json(res,200,{approvals:db.prepare("SELECT a.*,u.name AS decidedByName FROM approvals a JOIN users u ON u.id=a.decided_by WHERE record_id=? ORDER BY created_at").all(url.searchParams.get("recordId"))}); }
  if (url.pathname === "/api/approvals" && req.method === "POST") { const user=requireUser(req,res,["officer","manager"]); if(!user||!requireConfirmed(user,res)||!requireExtraCheck(user,res))return; const input=await body(req); db.prepare("INSERT INTO approvals VALUES(?,?,?,?,?,?,?,?,?,?)").run(randomUUID(),input.recordId,input.step,input.recordVersion,input.status,input.reason,input.limits||null,input.endsAt||null,user.id,now()); return json(res,201,{ok:true}); }

  if (url.pathname === "/api/files" && req.method === "GET") { const user=requireUser(req,res); if(!user)return; return json(res,200,{files:db.prepare("SELECT id,record_id AS recordId,name,content_type AS contentType,size,checksum,access_level AS accessLevel,version,replaces_id AS replacesId,scan_status AS scanStatus,created_at AS createdAt FROM files WHERE record_id=? ORDER BY version DESC").all(url.searchParams.get("recordId"))}); }
  if (url.pathname === "/api/files" && req.method === "POST") { const user=requireUser(req,res); if(!user)return; const input=await body(req,12_000_000); const bytes=Buffer.from(input.dataBase64||"","base64"); if(!bytes.length||bytes.length>8_000_000)return json(res,400,{error:"Choose a file smaller than 8 MB."}); const allowed=["application/pdf","text/plain","text/csv","application/json","image/png","image/jpeg"]; if(!allowed.includes(input.contentType))return json(res,400,{error:"This file type is not allowed."}); const id=randomUUID(), checksum=createHash("sha256").update(bytes).digest("hex"), safeName=id+extname(input.name).slice(0,8); await writeFile(join(PRIVATE_FILES,safeName),bytes,{flag:"wx"}); const last=db.prepare("SELECT MAX(version) AS v FROM files WHERE record_id=?").get(input.recordId); db.prepare("INSERT INTO files VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)").run(id,input.recordId,user.id,input.name,input.contentType,bytes.length,checksum,input.accessLevel,(last.v||0)+1,input.replacesId||null,"basic_check_passed",safeName,now()); return json(res,201,{ok:true,id,checksum}); }
  if (url.pathname.startsWith("/api/files/") && req.method === "GET") { const user=requireUser(req,res); if(!user)return; const id=url.pathname.split("/").at(-1), file=db.prepare("SELECT * FROM files WHERE id=?").get(id); if(!file)return json(res,404,{error:"File not found."}); const permitted=file.access_level==="public"||file.access_level==="signed_in"||file.owner_id===user.id||db.prepare("SELECT 1 FROM file_grants WHERE file_id=? AND user_id=? AND (expires_at IS NULL OR expires_at>?)").get(id,user.id,now()); db.prepare("INSERT INTO file_access VALUES(?,?,?,?,?,?)").run(randomUUID(),id,user.id,"user_open",permitted?"allowed":"denied",now()); if(!permitted)return json(res,403,{error:"You do not have access to this file."}); res.writeHead(200,{"content-type":file.content_type,"content-disposition":`attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,"cache-control":"private, no-store"}); return createReadStream(join(PRIVATE_FILES,file.path)).pipe(res); }

  if (url.pathname === "/api/openalex/search" && req.method === "GET") { const user=requireUser(req,res); if(!user)return; const q=(url.searchParams.get("q")||"").slice(0,200), key=`openalex:${q.toLowerCase()}`; const cached=db.prepare("SELECT * FROM service_cache WHERE cache_key=? AND expires_at>?").get(key,now()); if(cached)return json(res,200,{...JSON.parse(cached.value_json),cached:true}); if(!process.env.OPENALEX_API_KEY)return json(res,503,{error:"OpenAlex is ready but needs OPENALEX_API_KEY."}); const source=`https://api.openalex.org/works?search=${encodeURIComponent(q)}&per-page=8&api_key=${encodeURIComponent(process.env.OPENALEX_API_KEY)}`; const response=await fetch(source); if(!response.ok)return json(res,502,{error:"OpenAlex could not be reached."}); const raw=await response.json(), value={results:raw.results.map((w)=>({id:w.id,title:w.title,year:w.publication_year,doi:w.doi,authors:(w.authorships||[]).slice(0,4).map(a=>a.author.display_name),source:w.primary_location?.source?.display_name,checkedAt:now()}))}; db.prepare("INSERT OR REPLACE INTO service_cache VALUES(?,?,?,?,?)").run(key,JSON.stringify(value),source,now(),new Date(Date.now()+86400000).toISOString()); return json(res,200,value); }
  if (url.pathname === "/api/orcid/start" && req.method === "GET") { const user=requireUser(req,res,["researcher"]); if(!user)return; if(!process.env.ORCID_CLIENT_ID||!process.env.ORCID_REDIRECT_URI)return json(res,503,{error:"ORCID is ready but needs its client ID and return address."}); const state=randomBytes(18).toString("base64url"); const token=cookies(req).setu_session; db.prepare("UPDATE sessions SET extra_checked_at=? WHERE token_hash=?").run(`orcid:${state}`,hashToken(token)); return json(res,200,{url:`https://orcid.org/oauth/authorize?client_id=${encodeURIComponent(process.env.ORCID_CLIENT_ID)}&response_type=code&scope=%2Fauthenticate&redirect_uri=${encodeURIComponent(process.env.ORCID_REDIRECT_URI)}&state=${state}`}); }
  if (url.pathname === "/api/orcid/callback" && req.method === "GET") { const user=requireUser(req,res,["researcher"]); if(!user)return; const session=db.prepare("SELECT extra_checked_at FROM sessions WHERE user_id=?").get(user.id); if(session?.extra_checked_at!==`orcid:${url.searchParams.get("state")}`)return json(res,400,{error:"ORCID connection expired."}); const tokenRes=await fetch("https://orcid.org/oauth/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded","accept":"application/json"},body:new URLSearchParams({client_id:process.env.ORCID_CLIENT_ID,client_secret:process.env.ORCID_CLIENT_SECRET,grant_type:"authorization_code",code:url.searchParams.get("code")||"",redirect_uri:process.env.ORCID_REDIRECT_URI})}); const result=await tokenRes.json(); if(!result.orcid)return json(res,400,{error:"ORCID connection failed."}); db.prepare("UPDATE users SET orcid_id=? WHERE id=?").run(result.orcid,user.id); res.writeHead(302,{location:"/#workspace"}); return res.end(); }
  return json(res,404,{error:"Not found"});
}

const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".woff2":"font/woff2"};
createServer(async(req,res)=>{ try { const url=new URL(req.url,"http://localhost"); if(url.pathname.startsWith("/api/"))return await api(req,res,url); let path=join(DIST,url.pathname==="/"?"index.html":url.pathname); try { if((await stat(path)).isDirectory())path=join(path,"index.html"); } catch { path=join(DIST,"index.html"); } res.writeHead(200,{"content-type":mime[extname(path)]||"application/octet-stream","x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin","content-security-policy":"default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'"}); createReadStream(path).pipe(res); } catch(error){ console.error(error); json(res,500,{error:"Something went wrong."}); } }).listen(Number(process.env.PORT||4173),"127.0.0.1",()=>console.log(`Setu ready at http://127.0.0.1:${process.env.PORT||4173}`));
