import os
import time
import win32api
import win32print

# 1. SET YOUR FOLDER PATH HERE
# Use 'r' before the string to handle backslashes correctly
path_to_watch = r"C:\Users\YourName\Desktop\print"

print(f"Monitoring {path_to_watch} for PDFs...")

while True:
    try:
        # List all files in the directory
        files = os.listdir(path_to_watch)
        
        for filename in files:
            if filename.lower().endswith(".pdf"):
                full_path = os.path.join(path_to_watch, filename)
                
                print(f"Printing: {filename}")
                
                # Command to print to the Default Printer
                # This uses the Windows native "Print" verb (same as right-click > Print)
                win32api.ShellExecute(0, "print", full_path, None, ".", 0)
                
                # WAIT TIME (Important!)
                # Give the printer time to spool the job before deleting the file.
                # Increase this if you print very large files.
                time.sleep(10) 
                
                # Delete the file
                os.remove(full_path)
                print(f"Deleted: {filename}")
                
        # Check folder every 5 seconds
        time.sleep(5)

    except Exception as e:
        print(f"Error: {e}")
        time.sleep(5)
