@echo off
start cmd /k "call venv\Scripts\activate && python server.py"
start cmd /k "cloudflared tunnel run --credentials-file "C:\Users\karth\.cloudflared\a0b5c947-d21c-4fd2-9f1f-b365c2835a61.json"
