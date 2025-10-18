name: CI/CD Deploy to Windows

on:
  push:
    branches:
      - develop
      - testing
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      # 1️⃣ Checkout your code
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # 2️⃣ Detect environment based on branch
      - name: Set environment paths
        id: set-env
        run: |
          if [[ "${GITHUB_REF##*/}" == "develop" ]]; then
            echo "env=development" >> $GITHUB_OUTPUT
          elif [[ "${GITHUB_REF##*/}" == "testing" ]]; then
            echo "env=testing" >> $GITHUB_OUTPUT
          else
            echo "env=production" >> $GITHUB_OUTPUT
          fi

      # 3️⃣ Clean remote folders (PowerShell on Windows)
      - name: Clean remote backend and frontend folders
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.WIN_SERVER_HOST }}
          username: ${{ secrets.WIN_SERVER_USER }}
          password: ${{ secrets.WIN_SERVER_PASS }}
          port: 22
          script: |
            powershell -Command "
              $envFolder = '${{ steps.set-env.outputs.env }}'
              $basePath = \"C:\github\ticketing-system\$envFolder\psba-ticket-management-portal\"
              
              if (Test-Path \"$basePath\Ticketing-Management-System-Backend-\") {
                Remove-Item -Recurse -Force \"$basePath\Ticketing-Management-System-Backend-\"
              }
              if (Test-Path \"$basePath\Ticketing-Management-System-Frontend\") {
                Remove-Item -Recurse -Force \"$basePath\Ticketing-Management-System-Frontend\"
              }
            "

      # 4️⃣ Upload Backend files
      - name: Upload Backend via SCP
        uses: appleboy/scp-action@v1.0.0
        with:
          host: ${{ secrets.WIN_SERVER_HOST }}
          username: ${{ secrets.WIN_SERVER_USER }}
          password: ${{ secrets.WIN_SERVER_PASS }}
          port: 22
          source: "Ticketing-Management-System-Backend-/**"
          target: "C:\\github\\ticketing-system\\${{ steps.set-env.outputs.env }}\\psba-ticket-management-portal\\Ticketing-Management-System-Backend-"
          overwrite: true
          rm: false
          debug: true

      # 5️⃣ Upload Frontend files
      - name: Upload Frontend via SCP
        uses: appleboy/scp-action@v1.0.0
        with:
          host: ${{ secrets.WIN_SERVER_HOST }}
          username: ${{ secrets.WIN_SERVER_USER }}
          password: ${{ secrets.WIN_SERVER_PASS }}
          port: 22
          source: "Ticketing-Management-System-Frontend/**"
          target: "C:\\github\\ticketing-system\\${{ steps.set-env.outputs.env }}\\psba-ticket-management-portal\\Ticketing-Management-System-Frontend"
          overwrite: true
          rm: false
          debug: true

      # 6️⃣ Rebuild and restart backend with PM2
      - name: Restart Backend via PM2
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.WIN_SERVER_HOST }}
          username: ${{ secrets.WIN_SERVER_USER }}
          password: ${{ secrets.WIN_SERVER_PASS }}
          port: 22
          script: |
            powershell -Command "
              $envFolder = '${{ steps.set-env.outputs.env }}'
              $backendPath = \"C:\github\ticketing-system\$envFolder\psba-ticket-management-portal\Ticketing-Management-System-Backend-\"
              cd $backendPath
              npm install --legacy-peer-deps
              pm2 restart backend || pm2 start index.js --name backend
            "
