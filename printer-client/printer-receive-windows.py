import requests
import os
from datetime import datetime

# ================= CONFIG =================
ORDERS_API_URL = "https://mits-print-five.vercel.app/api/file?SECRET_KEY=mitsprint123456789"
DOWNLOAD_DIR = "PRINT"
TIMEOUT = 30
# =========================================

os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def get_orders():
    response = requests.get(
        ORDERS_API_URL,
        timeout=TIMEOUT
    )
    response.raise_for_status()
    return response.json()


def download_pdf(pdf_url, order_id, file_id):
    response = requests.get(pdf_url, stream=True, timeout=TIMEOUT)
    response.raise_for_status()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{order_id}_{file_id}_{timestamp}.pdf"
    file_path = os.path.join(DOWNLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

    print(f"[✓] Downloaded: {file_path}")
    return file_path


def process_orders():
    orders = get_orders()

    if not orders:
        print("No pending orders.")
        return

    for order in orders:
        order_id = order.get("order_id", "UNKNOWN_ORDER")
        prints = order.get("prints", [])

        if not prints:
            print(f"Order {order_id}: no print files.")
            continue

        for job in prints:
            file_id = job.get("file_id", "UNKNOWN_FILE")
            pdf_url = job.get("url")

            if not pdf_url:
                print(f"Order {order_id}, File {file_id}: missing URL.")
                continue

            download_pdf(pdf_url, order_id, file_id)


if __name__ == "__main__":
    process_orders()
