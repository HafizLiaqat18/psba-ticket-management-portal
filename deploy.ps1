Set-StrictMode -Version Latest

# cd to the folder where this script lives
$envPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
cd $envPath

npm ci --no-audit --no-fund
npm run build

switch ($envPath.Split('\')[-1]) {
    'dev'     { pm2 restart myapp-dev -f }
    'testing' { pm2 restart myapp-testing -f }
    'production' { pm2 restart myapp-prod -f }
}
