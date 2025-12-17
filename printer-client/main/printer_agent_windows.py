import os
import time
import json
import requests
import subprocess
import hashlib

# ================= CONFIG =================

API_URL = "https://mitsprint.vercel.app/api/file?SECRET_KEY=mitsprint123456789"
CHECK_INTERVAL = 30  # seconds

DOWNLOAD_DIR = "downloads"
PRINTED_LOG = "printed.log"

EPSON_PRINTER_NAME = "EPSON"
XEROX_PRINTER_NAME = "XEROX"

# ==========================================

os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def already_printed(print_id: str) -> bool:
    if not os.path.exists(PRINTED_LOG):
        return False
    with open(PRINTED_LOG, "r") as f:
        return print_id in f.read()


def mark_as_printed(print_id: str):
    with open(PRINTED_LOG, "a") as f:
        f.write(print_id + "\n")


def download_pdf(url: str) -> str:
    filename = hashlib.md5(url.encode()).hexdigest() + ".pdf"
    path = os.path.join(DOWNLOAD_DIR, filename)

    if os.path.exists(path):
        return path

    print(f"[↓] Downloading PDF")
    r = requests.get(url, timeout=30)
    r.raise_for_status()

    with open(path, "wb") as f:
        f.write(r.content)

    return path


def print_pdf_windows(
    pdf_path: str,
    printer: str,
    copies: int,
    duplex: bool
):
    duplex_flag = "duplex" if duplex else "simplex"

    for _ in range(copies):
        subprocess.run(
            [
                "powershell",
                "-Command",
                f'Start-Process -FilePath "{pdf_path}" '
                f'-Verb Print '
                f'-ArgumentList \'/d:"{printer}"\''
            ],
            shell=True
        )
        time.sleep(2)


def handle_print_job(job: dict):
    print_id = job["id"]

    if already_printed(print_id):
        return

    file_url = job["fileUrl"]
    copies = job.get("copies", 1)
    color = job.get("colorMode", "BLACK_WHITE")
    duplex = job.get("printOnBothSides", False)

    # ===== PRINTER SELECTION =====
    if color == "COLOR":
        printer = EPSON_PRINTER_NAME
        duplex = False
    else:
        printer = XEROX_PRINTER_NAME

    pdf_path = download_pdf(file_url)

    print(f"[🖨] Printing {print_id} on {printer}")
    print_pdf_windows(pdf_path, printer, copies, duplex)

    mark_as_printed(print_id)
    print(f"[✓] Completed {print_id}")


def poll_server():
    print("🖨 Printer Agent Started (Windows)")
    print("---------------------------------")

    while True:
        try:
            r = requests.get(API_URL, timeout=20)
            r.raise_for_status()
            payload = r.json()

            if not payload.get("success"):
                time.sleep(CHECK_INTERVAL)
                continue

            for order in payload.get("data", []):
                for job in order.get("prints", []):
                    if job.get("status") == "PENDING":
                        handle_print_job(job)

        except Exception as e:
            print("[ERROR]", e)

        time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    poll_server()
