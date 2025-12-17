import time
import requests
import subprocess
from pathlib import Path
from collections import deque

API_URL = "https://mitsprint.vercel.app/api/file?SECRET_KEY=mitsprint123456789"
CHECK_INTERVAL = 5  # seconds

BASE_DIR = Path("PRINT")
COLOR_DIR = BASE_DIR / "COLOR"
BW_DIR = BASE_DIR / "BLACK_WHITE"

TEST_MODE_HOLD_QUEUE = True  # keep jobs visible in lpq

COLOR_DIR.mkdir(parents=True, exist_ok=True)
BW_DIR.mkdir(parents=True, exist_ok=True)

print_queue = deque()
seen_print_ids = set()


# ---------------- SERVER ----------------

def fetch_raw_response():
    r = requests.get(API_URL, timeout=20)
    r.raise_for_status()
    return r.json()


def extract_orders(response):
    if isinstance(response, list):
        return response
    if isinstance(response, dict):
        if isinstance(response.get("data"), list):
            return response["data"]
        if isinstance(response.get("orders"), list):
            return response["orders"]
    return []


# ---------------- QUEUE ----------------

def enqueue_jobs(orders):
    added = 0

    for order in orders:
        for p in order.get("prints", []):
            pid = p.get("id")
            url = p.get("fileUrl")
            color = p.get("colorMode")
            copies = int(p.get("copies", 1))
            status = p.get("status")

            # 🔴 IMPORTANT: only pending jobs
            if status != "PENDING":
                continue

            if not pid or not url or not color:
                continue

            if pid in seen_print_ids:
                continue

            target_dir = COLOR_DIR if color == "COLOR" else BW_DIR
            path = target_dir / f"{pid}.pdf"

            print_queue.append({
                "id": pid,
                "url": url,
                "path": path,
                "copies": copies
            })

            seen_print_ids.add(pid)
            added += 1
            print(f"[+] Queued {pid} | copies={copies}")

    if added == 0:
        print("[i] No new printable jobs found")


# ---------------- PRINT ----------------

def download_pdf(url, path):
    if path.exists():
        return
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    path.write_bytes(r.content)


def print_job(job):
    print(f"[-] Printing {job['id']} | copies={job['copies']}")

    cmd = ["lp", "-n", str(job["copies"])]

    if TEST_MODE_HOLD_QUEUE:
        cmd += ["-o", "job-hold-until=indefinite"]

    cmd.append(str(job["path"]))

    subprocess.run(cmd, check=True)
    print(f"[✓] Job sent to CUPS: {job['id']}")


def process_queue():
    if not print_queue:
        return

    job = print_queue.popleft()
    download_pdf(job["url"], job["path"])
    print_job(job)


# ---------------- MAIN ----------------

def main():
    print("🖨️ FIFO Printer Queue Agent (TEST MODE)")
    print("=======================================")
    print("→ Jobs HELD for lpq inspection\n")

    while True:
        try:
            print("[*] Fetching orders from server...")
            response = fetch_raw_response()
            print("[DEBUG] Raw response keys:", response.keys() if isinstance(response, dict) else "list")

            orders = extract_orders(response)
            print(f"[DEBUG] Orders received: {len(orders)}")

            enqueue_jobs(orders)
            process_queue()

            time.sleep(CHECK_INTERVAL)

        except KeyboardInterrupt:
            print("\n[!] Stopped by user")
            break

        except Exception as e:
            print("[ERROR]", e)
            time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
