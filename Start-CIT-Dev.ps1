# CIT Dev Autostart Script with Docker Launch and Auto Vercel Deploy

Add-Type -AssemblyName System.Windows.Forms

function Start-DockerIfNotRunning {
    $dockerRunning = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
    if (-not $dockerRunning) {
        [System.Windows.Forms.MessageBox]::Show("Starting Docker Desktop... waiting 20s", "Docker Startup")
        Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
        Start-Sleep -Seconds 20
    }
}

# Start Docker if not running
Start-DockerIfNotRunning

# Change directory to project folder
cd "C:\Users\admin\Desktop\cit-system"

# Start Supabase local Docker
Start-Process powershell -ArgumentList "supabase start" -NoNewWindow

# Start Cloudflare Tunnel
Start-Process powershell -ArgumentList "cloudflared tunnel run cit-tunnel" -NoNewWindow

# Start Next.js dev server
Start-Process powershell -ArgumentList "npm run dev" -NoNewWindow

# Optional: Git commit and push to trigger Vercel deployment
git add .
git commit -m "Auto-deploy from CIT startup script" -m "Includes Supabase & Tunnel start"
git push

# Notify user
[System.Windows.Forms.MessageBox]::Show("✅ CIT Dev environment started and Vercel auto-deploy triggered.", "CIT Dev Startup")
