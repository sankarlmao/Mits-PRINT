import os
import time
import subprocess

PRINT_DIR = "PRINT"
CHECK_INTERVAL = 5  # seconds between folder checks

os.makedirs(PRINT_DIR, exist_ok=True)


def get_pdf_queue():
    """Return PDFs sorted by oldest first (FIFO)."""
    files = [
        os.path.join(PRINT_DIR, f)
        for f in os.listdir(PRINT_DIR)
        if f.lower().endswith(".pdf")
    ]
    files.sort(key=os.path.getctime)  # oldest first
    return files


def print_pdf(file_path):
    """Send PDF to default printer."""
    print(f"[→] Printing: {file_path}")
    subprocess.run(
        ["cmd", "/c", "start", "/wait", "", file_path],
        shell=True
    )
    print(f"[✓] Printed: {file_path}")


def main():
    print("📄 Printer queue service started...")

    while True:
        queue = get_pdf_queue()

        if not queue:
            time.sleep(CHECK_INTERVAL)
            continue

        pdf = queue[0]

        try:
            print_pdf(pdf)
            os.remove(pdf)
            print(f"[🗑] Deleted: {pdf}")
        except Exception as e:
            print(f"[!] Error processing {pdf}: {e}")
            time.sleep(5)


if __name__ == "__main__":
    main()
