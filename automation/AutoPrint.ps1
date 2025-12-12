# 1. SET YOUR FOLDER PATH HERE
$watchFolder = "C:\Users\YourName\Desktop\print"

Write-Host "Monitoring $watchFolder for PDFs..."

while ($true) {
    # Find all PDF files
    $files = Get-ChildItem -Path $watchFolder -Filter *.pdf

    foreach ($file in $files) {
        Write-Host "Printing $($file.Name)..."
        
        # Start the print process using the system default printer
        Start-Process -FilePath $file.FullName -Verb Print -PassThru | ForEach-Object {
            # Wait a few seconds for the app (like Adobe Reader) to open and spool
            Start-Sleep -Seconds 10
            
            # Optional: Attempt to close the PDF reader window after printing
            # $_.CloseMainWindow() 
        }

        # Wait to ensure file is unlocked
        Start-Sleep -Seconds 5
        
        # Delete the file
        Remove-Item $file.FullName -Force
        Write-Host "Deleted $($file.Name)"
    }
    
    # Check again in 5 seconds
    Start-Sleep -Seconds 5
}
