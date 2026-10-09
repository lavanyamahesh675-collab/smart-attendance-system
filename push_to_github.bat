@echo off
echo ===================================================
echo 🚀 BioAttend GitHub One-Click Repository Push Tool
echo ===================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/bioattend.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No repository URL entered. Exiting...
    pause
    exit /b
)

echo.
echo Adding Git Remote...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Renaming main branch...
git branch -M main

echo Pushing commits to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo ✅ SUCCESS! Your BioAttend repository is live on GitHub!
    echo ===================================================
) else (
    echo.
    echo [NOTE] If prompted for authentication, log in via browser or pass your GitHub Personal Access Token.
)

pause
