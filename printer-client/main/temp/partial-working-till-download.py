import time
import requests
from pathlib import Path

API_URL = "https://mitsprint.vercel.app/api/file?SECRET_KEY=mitsprint123456789"
CHECK_INTERVAL = 5  # seconds

BASE_DIR = Path("PRINT")
COLOR_DIR = BASE_DIR / "COLOR"
BW_DIR = BASE_DIR / "BLACK_WHITE"

COLOR_DIR.mkdir(parents=True, exist_ok=True)
BW_DIR.mkdir(parents=True, exist_ok=True)


def fetch_raw_response():
    r = requests.get(API_URL, timeout=20)
    r.raise_for_status()
    return r.json()


def extract_orders(response):
    # Case 1: API returns list directly
    if isinstance(response, list):
        return response

    # Case 2: API returns { data: [...] }
    if isinstance(response, dict) and isinstance(response.get("data"), list):
        return response["data"]

    # Case 3: API returns { orders: [...] }
    if isinstance(response, dict) and isinstance(response.get("orders"), list):
        return response["orders"]

    return []


def download_pdf(url, save_path):
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    save_path.write_bytes(r.content)


def main():
    print("🖨️  PDF Fetcher Started (Runs every 30 seconds)")
    print("------------------------------------------------")

    while True:
        try:
            print("[*] Fetching orders from server...")
            response = fetch_raw_response()
            orders = extract_orders(response)

            if not orders:
                print("[i] No orders available")
            else:
                print(f"[✓] Found {len(orders)} orders")

            for order in orders:
                prints = order.get("prints", [])

                for p in prints:
                    print_id = p.get("id")
                    file_url = p.get("fileUrl")
                    color_mode = p.get("colorMode")

                    if not print_id or not file_url or not color_mode:
                        print("[!] Skipping invalid print object")
                        continue

                    if color_mode == "COLOR":
                        target_dir = COLOR_DIR
                    elif color_mode == "BLACK_WHITE":
                        target_dir = BW_DIR
                    else:
                        print(f"[!] Unknown colorMode: {color_mode}")
                        continue

                    file_path = target_dir / f"{print_id}.pdf"

                    if file_path.exists():
                        continue  # already downloaded

                    print(f"[↓] Downloading {color_mode} → {file_path.name}")
                    download_pdf(file_url, file_path)

            print(f"[⏳] Sleeping {CHECK_INTERVAL}s\n")
            time.sleep(CHECK_INTERVAL)

        except KeyboardInterrupt:
            print("\n[!] Stopped by user")
            break

        except Exception as e:
            print("[ERROR]", e)
            print(f"[⏳] Retrying in {CHECK_INTERVAL}s\n")
            time.sleep(CHECK_INTERVAL)


if __name__ == "__main__":
    main()
