#!/usr/bin/env sh
set -e

if command -v gradle >/dev/null 2>&1; then
  exec gradle "$@"
fi

echo "Gradle no esta instalado o no esta en el PATH." >&2
echo "Instala Gradle o usa un proyecto con Gradle Wrapper completo." >&2
exit 1
