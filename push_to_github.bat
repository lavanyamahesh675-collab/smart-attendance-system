@echo off
echo ===================================================
echo 🚀 BioAttend GitHub Push Tool
echo Account: lavanyamahesh675-collab
echo Repo:    https://github.com/lavanyamahesh675-collab/smart-attendance-system.git
echo ===================================================
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/lavanyamahesh675-collab/smart-attendance-system.git
git branch -M main

echo Pushing all files to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================
    echo ✅ SUCCESS! BioAttend repository pushed to GitHub!
    echo URL: https://github.com/lavanyamahesh675-collab/smart-attendance-system
    echo ===================================================
) else (
    echo.
    echo [NOTE] If repository not found, please create it first at:
    echo https://github.com/new?name=smart-attendance-system
)

pause
