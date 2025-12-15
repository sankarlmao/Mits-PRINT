import requests
import win32print
import win32api
import win32con
import time
import os
from urllib.parse import urlparse

SERVER_URL = "https://www.example.com/api/print-queue"
POLL_INTERVAL = 5

EPSON_PRINTER = "Epson_L3110"
XEROX_PRINTER = "Xerox_WorkCentre_5335"

DOWNLOAD_DIR = "C:\\print_jobs"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def download_pdf(url):
    filename = os.path.basename(urlparse(url).path)
    path = os.path.join(DOWNLOAD_DIR, filename)

    r = requests.get(url, timeout=30)
    r.raise_for_status()

    with open(path, "wb") as f:
        f.write(r.content)

    return path


def choose_printer(job):
    if job["colorMode"] == "COLOR":
        return EPSON_PRINTER
    return XEROX_PRINTER


def configure_printer(printer_name, job):
    hPrinter = win32print.OpenPrinter(printer_name)
    try:
        properties = win32print.GetPrinter(hPrinter, 2)
        devmode = properties["pDevMode"]

        # Copies
        devmode.Copies = job["copies"]

        # Orientation
        devmode.Orientation = (
            win32con.DMORIENT_LANDSCAPE
            if job["orientation"] == "LANDSCAPE"
            else win32con.DMORIENT_PORTRAIT
        )

        # Duplex
        if printer_name == XEROX_PRINTER and job["printOnBothSides"]:
            devmode.Duplex = win32con.DMDUP_VERTICAL
        else:
            devmode.Duplex = win32con.DMDUP_SIMPLEX

        # Color
        if printer_name == XEROX_PRINTER:
            devmode.Color = win32con.DMCOLOR_MONOCHROME
        else:
            devmode.Color = win32con.DMCOLOR_COLOR

        win32print.SetPrinter(hPrinter, 2, properties, 0)
    finally:
        win32print.ClosePrinter(hPrinter)


def print_pdf(file_path, printer_name):
    win32api.ShellExecute(
        0,
        "printto",
        file_path,
        f'"{printer_name}"',
        ".",
        0
    )


def process_print_job(job):
    printer = choose_printer(job)
    pdf_path = download_pdf(job["fileUrl"])

    print(f"[→] Sending {pdf_path} to {printer}")
    configure_printer(printer, job)
    print_pdf(pdf_path, printer)
    print("[✓] Print triggered")


def fetch_orders():
    r = requests.get(SERVER_URL, timeout=10)
    r.raise_for_status()
    return r.json()["orders"]


def main():
    print("🖨️ Windows Print Agent started")
    while True:
        try:
            orders = fetch_orders()

            for order in orders:
                for job in order["prints"]:
                    if job["status"] != "PENDING":
                        continue

                    process_print_job(job)

                    # OPTIONAL: update status
                    # requests.post("https://www.example.com/api/update-status",
                    #               json={"printId": job["id"], "status": "SUCCESS"})

        except Exception as e:
            print("⚠️ Error:", e)

        time.sleep(POLL_INTERVAL)


if __name__ == "__main__":
    main()
