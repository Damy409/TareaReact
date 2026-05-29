@echo off
where gradle >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  gradle %*
  exit /b %ERRORLEVEL%
)

echo Gradle no esta instalado o no esta en el PATH.
echo Instala Gradle o usa un proyecto con Gradle Wrapper completo.
exit /b 1
