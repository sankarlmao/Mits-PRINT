import time
import requests
import subprocess
from pathlib import Path
from collections import deque

API_URL = "https://mitsprint.vercel.app/api/file?SECRET_KEY=mitsprint123456789"
CHECK_INTERVAL = 5  # seconds

# ---------------- PRINTER STATUS CONFIG ----------------

STATUS_POST_URL = "https://xyz.com/status"
PRINTER_SECRET_KEY = "mitsprint123456789"
XEROX_PRINTER_ID = "XEROX_01"
XEROX_PRINTER_NAME = "Xerox"

# ---------------- FILE UPDATE CONFIG ------------------

FILE_UPDATE_URL = "https://mitsprint.vercel.app/api/file/update"

# ------------------------------------------------------

BASE_DIR = Path("PRINT")
COLOR_DIR = BASE_DIR / "COLOR"
BW_DIR = BASE_DIR / "BLACK_WHITE"

TEST_MODE_HOLD_QUEUE = True

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


# ---------------- FILE DOWNLOAD + UPDATE ----------------

def notify_file_downloaded(order_id):
    payload = {
        "secret_key": PRINTER_SECRET_KEY,
        "orderid": order_id,
        "status": "DOWNLOADED"
    }

    try:
        r = requests.post(FILE_UPDATE_URL, json=payload, timeout=10)
        r.raise_for_status()
        print(f"[✓] Server updated: {order_id} DOWNLOADED")

    except Exception as e:
        print("[ERROR] File update POST failed:", e)


def download_pdf(url, path, order_id):
    if path.exists():
        return

    r = requests.get(url, timeout=30)
    r.raise_for_status()
    path.write_bytes(r.content)

    notify_file_downloaded(order_id)


# ---------------- PRINT ----------------

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
    download_pdf(job["url"], job["path"], job["id"])
    print_job(job)


# ---------------- PRINTER STATUS ----------------

def get_xerox_printer_status():
    try:
        result = subprocess.run(
            ["lpstat", "-p", XEROX_PRINTER_NAME],
            capture_output=True,
            text=True,
            check=True
        )

        output = result.stdout.lower()

        if "printing" in output:
            return "PRINTING", "Printer is actively printing"
        if "idle" in output:
            return "IDLE", "Printer is idle and ready"
        if "disabled" in output or "stopped" in output:
            return "STOPPED", "Printer is disabled or stopped"

        return "UNKNOWN", "Unable to determine printer state"

    except subprocess.CalledProcessError:
        return "OFFLINE", "Printer not reachable via CUPS"


def post_printer_status():
    printer_status, printer_reason = get_xerox_printer_status()

    payload = {
        "secret_key": PRINTER_SECRET_KEY,
        "printer_id": XEROX_PRINTER_ID,
        "printer_status": printer_status,
        "printer_reason": printer_reason
    }

    try:
        r = requests.post(STATUS_POST_URL, json=payload, timeout=10)
        r.raise_for_status()
        print("[✓] Printer status sent")

    except Exception as e:
        print("[ERROR] Printer status POST failed:", e)


# ---------------- MAIN ----------------

def main():
    print("🖨️ FIFO Printer Queue Agent (TEST MODE)")
    print("=======================================")
    print("→ Jobs HELD for lpq inspection\n")

    while True:
        try:
            print("[*] Fetching orders from server...")
            response = fetch_raw_response()

            orders = extract_orders(response)
            enqueue_jobs(orders)

            process_queue()
            post_printer_status()

            time.sleep(CHECK_INTERVAL)

        except KeyboardInterrupt:
            print("\n[!] Stopped by user")
            break

        except Exception as e:
            print("[ERROR]", e)
            time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
