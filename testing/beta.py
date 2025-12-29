import time
import requests
import subprocess
import cups
from pathlib import Path
from collections import deque

# ================= CONFIG =================

API_URL = "https://mitsprint.vercel.app/api/file?SECRET_KEY=mitsprint123456789"
ERROR_REPORT_URL = "https://xyz.com/printer-error"

PRINTER_NAME = "Xerox"   # EXACT name from lpstat -p
CHECK_INTERVAL = 5       # seconds

TEST_MODE_HOLD_QUEUE = True  # keeps jobs visible in lpq

BASE_DIR = Path("PRINT")
COLOR_DIR = BASE_DIR / "COLOR"
BW_DIR = BASE_DIR / "BLACK_WHITE"

# ================= INIT =================

BASE_DIR.mkdir(exist_ok=True)
COLOR_DIR.mkdir(exist_ok=True)
BW_DIR.mkdir(exist_ok=True)

cups_conn = cups.Connection()
print_queue = deque()
seen_print_ids = set()
last_reported_error = None

# ================= SERVER =================

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


# ================= QUEUE =================

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
        print("[i] No new printable jobs")


# ================= PRINTER DRIVER =================

def get_printer_error():
    printers = cups_conn.getPrinters()

    if PRINTER_NAME not in printers:
        return "PRINTER_NOT_FOUND"

    printer = printers[PRINTER_NAME]
    state = printer.get("printer-state")
    reasons = printer.get("printer-state-reasons", [])

    # state 5 = stopped
    if state == 5:
        return ", ".join(reasons)

    error_reasons = [
        r for r in reasons
        if r not in ("none", "printer-idle", "job-printing")
    ]

    if error_reasons:
        return ", ".join(error_reasons)

    return None


def report_printer_error(error_msg):
    payload = {
        "printer": PRINTER_NAME,
        "error": error_msg,
        "timestamp": int(time.time())
    }

    try:
        requests.post(ERROR_REPORT_URL, json=payload, timeout=10)
        print(f"[!] Error forwarded → {error_msg}")
    except Exception as e:
        print("[ERROR] Failed to report error:", e)


def monitor_printer_errors():
    global last_reported_error

    error = get_printer_error()

    if error and error != last_reported_error:
        report_printer_error(error)
        last_reported_error = error

    if error is None:
        last_reported_error = None


# ================= PRINT =================

def download_pdf(url, path):
    if path.exists():
        return

    r = requests.get(url, timeout=30)
    r.raise_for_status()
    path.write_bytes(r.content)


def print_job(job):
    print(f"[-] Printing {job['id']} | copies={job['copies']}")

    cmd = [
        "lp",
        "-d", PRINTER_NAME,
        "-n", str(job["copies"])
    ]

    if TEST_MODE_HOLD_QUEUE:
        cmd += ["-o", "job-hold-until=indefinite"]

    cmd.append(str(job["path"]))

    subprocess.run(cmd, check=True)
    print(f"[✓] Job sent to CUPS → {job['id']}")


def process_queue():
    if not print_queue:
        return

    job = print_queue.popleft()
    download_pdf(job["url"], job["path"])
    print_job(job)


# ================= MAIN =================

def main():
    print("🖨️ Xerox Print Queue Agent")
    print("====================================")
    print("→ Driver-aware | Error forwarding ON")
    print("→ FIFO queue | Copies respected\n")

    while True:
        try:
            monitor_printer_errors()

            error = get_printer_error()
            if error:
                print(f"[!] Printer error active: {error}")
                time.sleep(CHECK_INTERVAL)
                continue

            response = fetch_raw_response()
            orders = extract_orders(response)

            enqueue_jobs(orders)
            process_queue()

            time.sleep(CHECK_INTERVAL)

        except KeyboardInterrupt:
            print("\n[!] Agent stopped by user")
            break

        except Exception as e:
            print("[ERROR]", e)
            time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
