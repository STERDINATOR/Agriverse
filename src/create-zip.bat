@echo off
REM AgriVerse ZIP Creation Script for Windows
REM This script creates a distributable ZIP file of the project

echo 🌱 Creating AgriVerse ZIP package...
echo.

set PROJECT_NAME=agriverse-climate-game
set OUTPUT_FILE=%PROJECT_NAME%.zip

REM Check if 7-Zip is installed (common on Windows)
where 7z >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Using 7-Zip to create archive...
    
    REM Remove old zip if exists
    if exist "%OUTPUT_FILE%" del "%OUTPUT_FILE%"
    
    REM Create ZIP excluding unnecessary files
    7z a -tzip "%OUTPUT_FILE%" * ^
        -xr!node_modules ^
        -xr!.git ^
        -xr!dist ^
        -xr!build ^
        -xr!.cache ^
        -xr!.vscode ^
        -xr!.idea ^
        -x!*.log ^
        -x!*.tmp ^
        -x!*.temp ^
        -x!.DS_Store ^
        -x!Thumbs.db
    
    echo.
    echo ✅ Success! Created: %OUTPUT_FILE%
    echo 📍 Location: %CD%\%OUTPUT_FILE%
    goto :end
)

REM Fallback: Use PowerShell (built into Windows)
echo Using PowerShell to create archive...
powershell -Command "& { ^
    $exclude = @('node_modules', '.git', 'dist', 'build', '.cache', '.vscode', '.idea'); ^
    Get-ChildItem -Path . -Recurse ^| ^
    Where-Object { ^
        $item = $_; ^
        -not ($exclude ^| Where-Object { $item.FullName -like \"*$_*\" }) ^
    } ^| ^
    Compress-Archive -DestinationPath '%OUTPUT_FILE%' -Force ^
}"

echo.
echo ✅ Success! Created: %OUTPUT_FILE%
echo 📍 Location: %CD%\%OUTPUT_FILE%

:end
echo.
echo Next steps:
echo 1. Share the ZIP file directly
echo 2. Or upload to GitHub for easy sharing
echo.
pause
