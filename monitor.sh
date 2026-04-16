#!/bin/bash

RESET="\033[0m"
BOLD="\033[1m"
GREEN="\033[32m"
RED="\033[31m"
CYAN="\033[36m"
YELLOW="\033[33m"

check_service() {
  local name=$1
  local url=$2
  if curl -s --max-time 2 "$url" > /dev/null 2>&1; then
    echo -e "  ${GREEN}● $name${RESET} — UP"
  else
    echo -e "  ${RED}● $name${RESET} — DOWN"
  fi
}

while true; do
  clear
  echo -e "${BOLD}${CYAN}=== Trident-AI Monitor ===${RESET}"
  echo -e "$(date '+%H:%M:%S')\n"

  echo -e "${BOLD}Servicios:${RESET}"
  check_service "Ollama    :11434" "http://localhost:11434"
  check_service "Python    :8000 " "http://localhost:8000/health"
  check_service "Java      :8080 " "http://localhost:8080/actuator/health"
  check_service "Frontend  :3000 " "http://localhost:3000"

  echo ""
  echo -e "${BOLD}CPU:${RESET}"
  top -bn1 | grep "Cpu(s)" | awk '{print "  Uso: " $2 "%"}'

  echo ""
  echo -e "${BOLD}RAM:${RESET}"
  free -h | awk 'NR==2{printf "  Usada: %s / Total: %s (libre: %s)\n", $3, $2, $4}'

  echo ""
  echo -e "${BOLD}GPU (VRAM):${RESET}"
  if command -v rocm-smi &> /dev/null; then
    rocm-smi --showmeminfo vram 2>/dev/null | grep -E "Used|Total" | awk '{print "  " $0}'
  else
    echo -e "  ${YELLOW}rocm-smi no disponible${RESET}"
  fi

  echo ""
  echo -e "${BOLD}Modelo Ollama cargado:${RESET}"
  loaded=$(curl -s http://localhost:11434/api/ps 2>/dev/null | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [ -n "$loaded" ]; then
    echo -e "  ${GREEN}$loaded${RESET}"
  else
    echo -e "  ${YELLOW}ninguno${RESET}"
  fi

  echo ""
  echo -e "  ${YELLOW}Ctrl+C para salir — refresca cada 3s${RESET}"
  sleep 3
done
