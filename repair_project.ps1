# Script de réparation pour BankScore AI
Write-Host "Nettoyage des fichiers temporaires de l'IDE..." -ForegroundColor Cyan

# Suppression des dossiers de configuration IDE
Remove-Item -Recurse -Force .vscode, .settings, .project, .classpath -ErrorAction SilentlyContinue

# Nettoyage Maven
./mvnw clean compile

Write-Host "Terminé ! Veuillez redémarrer VS Code en ouvrant UNIQUEMENT le dossier 'demo'." -ForegroundColor Green
