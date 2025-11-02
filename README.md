<img width="1024" height="1024" alt="Gemini_Generated_Image_ou2soiou2soiou2s" src="https://github.com/user-attachments/assets/3970bd94-df1a-411e-b470-b31f36296dab" />
```mermaid
graph TD
    A[Student Portal - Sender Website] --> B{Upload Document & Select Options};
    B --> C{Process Payment};
    C --> D[Backend Server - API & Storage];
    D --> E[Database - Job Management];
    E --> F{Job Status: Pending};
    F --> G[Printer PC - Receiver Website];
    G --> H{Check for New Jobs};
    H --> I{Download Document};
    I --> J{Trigger Print Command};
    J --> K[Physical Printer];
    K --> L{Print Complete};
    L --> E;
    E --> D;
    D --> G;
    G --> A;
