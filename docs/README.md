# docs/

Esta carpeta es para documentación **técnica del proyecto** — lo que necesitaría leer alguien que quiere usar, integrar o desplegar Trident-AI sin haber participado en su desarrollo.

> Si es algo que aprendiste mientras codificabas → va en `apuntes/`
> Si es algo que alguien necesita para usar el proyecto → va aquí

---

## Qué documentar aquí

### Por cada servicio (backend-python, backend-java, frontend)

- **Setup**: cómo instalar dependencias y levantar el servicio
- **Variables de entorno**: qué variables existen, qué hacen, valores por defecto
- **Endpoints**: ruta, método HTTP, parámetros, body esperado, respuesta, ejemplo
- **Errores comunes**: qué puede salir mal y cómo solucionarlo

### A nivel de proyecto

- **Arquitectura**: cómo se comunican los servicios entre sí
- **Flujo de datos**: qué pasa desde que el usuario escribe hasta que recibe respuesta
- **Requisitos**: versiones de Python, Java, Node, Ollama, modelos necesarios

---

## Estructura sugerida

```
docs/
├── README.md               ← este archivo
├── arquitectura.md         ← diagrama y explicación general del sistema
├── backend-python/
│   ├── setup.md            ← instalación y arranque
│   ├── endpoints.md        ← referencia de la API REST
│   └── variables-entorno.md
├── backend-java/
│   ├── setup.md
│   └── endpoints.md
└── frontend/
    ├── setup.md
    └── componentes.md      ← solo si son componentes reutilizables complejos
```

---

## Lo que NO va aquí

- Explicaciones de "¿por qué usamos X librería?" → `apuntes/`
- Notas personales de aprendizaje → `apuntes/`
- Código de ejemplo que no sea para ilustrar un endpoint → `apuntes/`