# Proyecto Brain: Sistema de Memoria Permanente con IA

## Descripción General

**Brain** es un sistema de memoria permanente con inteligencia artificial, diseñado para interactuar con el usuario a través de Telegram. A diferencia de un chatbot tradicional, Brain está construido para recordar información útil de forma indefinida, organizar el conocimiento automáticamente y utilizarlo para proporcionar respuestas contextualizadas. El proyecto está completamente desarrollado en TypeScript y utiliza la API de Google Gemini para sus capacidades de IA.

## Objetivos

El objetivo principal de Brain es actuar como una extensión de la memoria del usuario, permitiéndole interactuar de forma natural a través de Telegram. Sus funciones clave incluyen:

-   **Respuestas Naturales**: Generar respuestas coherentes y contextualizadas.
-   **Memoria Permanente**: Almacenar información relevante de forma indefinida.
-   **Contexto Temporal**: Olvidar automáticamente el contexto conversacional no esencial.
-   **Organización Automática**: Clasificar y organizar el conocimiento sin intervención manual del usuario.
-   **Búsqueda de Conocimiento**: Consultar la memoria existente antes de formular una respuesta.

## Arquitectura

La arquitectura de Brain está diseñada para ser modular y escalable, permitiendo una fácil integración y abstracción de los componentes clave. El flujo de información principal es el siguiente:

Telegram → Webhook → Brain API → Memory Engine → Gemini API → Telegram Reply

El **Memory Engine** es el corazón del sistema y se compone de los siguientes módulos:

-   **Memoria Corta**: Almacena conversaciones recientes, temas actuales y tareas temporales. Implementada con Supabase (PostgreSQL).
-   **Memoria Larga**: Contiene el conocimiento permanente, almacenado en un **Obsidian Vault** utilizando archivos Markdown. Cada nota de memoria larga sigue un formato específico y se organiza en carpetas temáticas, almacenadas en Supabase Storage.
-   **Embedding Index**: Índice de embeddings generados a partir de las notas de memoria larga, utilizado para la búsqueda semántica.
-   **Search Engine**: Motor de búsqueda que utiliza los embeddings para recuperar las notas más relevantes antes de responder a una consulta.

### Diagrama de Arquitectura

![Diagrama de Arquitectura](docs/architecture.png)

## Componentes Clave

### Memoria Corta

-   **Propósito**: Mantener la continuidad de la conversación y el contexto temporal.
-   **Almacenamiento**: Conversaciones recientes, temas actuales, tareas temporales, contexto reciente.
-   **Expiración**: 30 días (configurable mediante variable de entorno `SHORT_MEMORY_EXPIRATION`).
-   **Implementación**: Supabase (PostgreSQL).

### Memoria Larga

-   **Propósito**: Almacenar conocimiento permanente y estructurado.
-   **Almacenamiento**: Dentro de un Obsidian Vault, donde cada memoria es un archivo Markdown, almacenado en Supabase Storage.
-   **Ejemplos de Contenido**: Estrategias de negocio, decisiones de CRM, automatizaciones, ideas, lecciones, errores, procesos, experimentos, prompts, arquitectura.
-   **Regla Clave**: Nunca guardar conversaciones inútiles.

### Clasificador Automático de Memoria

Para cada mensaje recibido, el sistema decide si debe convertirse en conocimiento permanente. Si la decisión es YES, se genera o actualiza un archivo Markdown. Si es NO, se responde normalmente.

### Obsidian Vault (en Supabase Storage)

-   **Estructura del Vault**:
    ```
    Vault/
    ├── CRM/
    ├── Sales/
    ├── Automation/
    ├── Prompts/
    ├── Ideas/
    ├── Projects/
    ├── Bugs/
    ├── Experiments/
    ├── Processes/
    ├── Knowledge/
    ├── Meetings/
    ├── AI/
    ├── Architecture/
    └── Daily/
    ```
-   La IA elige automáticamente la carpeta correcta para cada nota.

### Formato Markdown

Cada nota Markdown debe contener:

-   **Frontmatter**: Título, Creado, Actualizado, Etiquetas, Alias.
-   **Secciones**: Resumen, Contexto, Conocimiento, Notas Relacionadas, Próximos Pasos.
-   **Enlaces Wiki**: Creación automática de enlaces wiki (ej. `[[CRM]]`, `[[Cloudflare]]`, `[[Telegram]]`).

### Detección de Duplicados

-   Nunca se deben crear notas duplicadas.
-   Si existe una nota similar, se debe actualizar la existente.

### Búsqueda

-   Antes de responder a cualquier pregunta, se realiza una búsqueda en la memoria semántica.
-   Se recuperan las notas más relevantes y se inyectan en el modelo Gemini.
-   La respuesta se genera utilizando este conocimiento. Nunca se responde solo desde la memoria del modelo si Brain ya tiene conocimiento relevante.

### Embeddings

-   Cada nota Markdown genera embeddings.
-   Cuando una nota cambia, sus embeddings se regeneran automáticamente.

### Telegram

-   **Soporte Actual**: Texto, Voz.
-   **Soporte Futuro**: Imágenes, Documentos.

### Voz

El flujo para mensajes de voz es:

Voz → Speech to Text → Memory Engine → Gemini → Respuesta

## Configuración

Todas las configuraciones se gestionan a través de variables de entorno. Se ha creado un archivo `.env.example` para facilitar la configuración inicial.

## Calidad del Código

-   Arquitectura modular.
-   Inyección de dependencias.
-   Sin lógica duplicada.
-   Código limpio.
-   Listo para producción.
-   Documentación completa.

## Preparado para el Futuro

El proveedor de LLM está abstraído, permitiendo cambiar entre Gemini (actual), OpenAI, Claude, Grok, etc., sin modificar el resto del código.

## Entregables

-   Proyecto completo.
-   Estructura de carpetas.
-   README.
-   Guía de instalación.
-   Guía de despliegue.
-   Variables de entorno.
-   Explicación de la arquitectura.
-   Diagramas de secuencia.
-   Código completo.

## Estado Actual del Proyecto

El proyecto **Brain** ha sido migrado para ser compatible con Vercel y Supabase, incluyendo:

-   **Memoria Corta**: Refactorizada para usar Supabase (PostgreSQL).
-   **Memoria Larga**: Refactorizada para usar Supabase Storage.
-   **Telegram**: Adaptado para funcionar con Webhooks.
-   **Vercel**: Archivo `vercel.json` añadido para configuración de despliegue.

## Guía de Despliegue en Vercel con Supabase

Sigue estos pasos para desplegar tu proyecto Brain en Vercel y usar Supabase para la persistencia de datos:

### 1. Configuración en Supabase

Antes de desplegar en Vercel, necesitas configurar tu proyecto en Supabase:

1.  **Crea un Proyecto en Supabase**: Si aún no lo has hecho, ve a [Supabase](https://supabase.com/) y crea una cuenta gratuita y un nuevo proyecto.

2.  **Crea la Tabla `messages` (para Memoria Corta)**:
    *   En el dashboard de tu proyecto Supabase, ve a **Table Editor**.
    *   Haz clic en `New table`.
    *   Nombra la tabla `messages`.
    *   Añade las siguientes columnas:
        *   `id`: `TEXT`, `Primary Key`, `Not Null`
        *   `role`: `TEXT`, `Not Null`
        *   `content`: `TEXT`, `Not Null`
        *   `timestamp`: `TIMESTAMP WITH TIME ZONE`, `Not Null`, `Default: now()`
    *   Asegúrate de que los permisos de `RLS` (Row Level Security) permitan `INSERT`, `SELECT`, `UPDATE`, `DELETE` para el rol `service_role` (esto es importante para que tu aplicación pueda interactuar con la tabla).

3.  **Crea el Bucket `brain-vault` (para Memoria Larga)**:
    *   En el dashboard de tu proyecto Supabase, ve a **Storage**.
    *   Haz clic en `New bucket`.
    *   Nombra el bucket `brain-vault`.
    *   Asegúrate de que los permisos de `RLS` permitan `UPLOAD`, `DOWNLOAD`, `UPDATE`, `DELETE` para el rol `service_role`.

4.  **Obtén tus Credenciales de Supabase**:
    *   En el dashboard de tu proyecto Supabase, ve a **Project Settings** (icono de engranaje) -> **API**.
    *   Copia los valores de:
        *   `URL` (será tu `SUPABASE_URL`)
        *   `Service Role (secret)` (será tu `SUPABASE_SERVICE_ROLE_KEY`)

### 2. Despliegue en Vercel

Ahora que tu proyecto Supabase está listo, puedes desplegar Brain en Vercel:

1.  **Conecta tu Repositorio de GitHub**: Ve a [Vercel](https://vercel.com/) y crea un nuevo proyecto. Conecta tu repositorio de GitHub (`https://github.com/chadhellkerley-code/socio`).

2.  **Configura las Variables de Entorno en Vercel**:
    *   Durante el proceso de despliegue en Vercel, o yendo a **Project Settings** -> **Environment Variables** de tu proyecto, añade las siguientes variables:
        *   `TELEGRAM_TOKEN`: Tu token de bot de Telegram.
        *   `GEMINI_API_KEY`: Tu clave de API de Google Gemini.
        *   `SUPABASE_URL`: La URL de tu proyecto Supabase (obtenida en el paso 1.4).
        *   `SUPABASE_SERVICE_ROLE_KEY`: La clave secreta de rol de servicio de Supabase (obtenida en el paso 1.4).
        *   `WEBHOOK_URL`: La URL de tu despliegue en Vercel, seguida de `/api/webhook`. Por ejemplo, si tu dominio de Vercel es `https://brain-ai.vercel.app`, entonces `WEBHOOK_URL` sería `https://brain-ai.vercel.app/api/webhook`.
        *   `SHORT_MEMORY_EXPIRATION`: `30` (o el número de días que desees).
        *   `LLM_PROVIDER`: `gemini`.
        *   `PORT`: `3000` (aunque Vercel lo gestiona, es bueno tenerlo).

3.  **Despliega el Proyecto**: Vercel detectará el archivo `vercel.json` y el código TypeScript. Inicia el despliegue. Una vez completado, Vercel te proporcionará una URL pública para tu aplicación.

### 3. Configura el Webhook de Telegram

Finalmente, debes decirle a Telegram dónde enviar los mensajes de tu bot:

1.  **Abre Telegram** y busca a `@BotFather`.
2.  Usa el comando `/setwebhook`.
3.  Selecciona tu bot.
4.  Cuando te pida la URL, introduce la `WEBHOOK_URL` que configuraste en Vercel (ej. `https://brain-ai.vercel.app/api/webhook`).

¡Y listo! Tu bot Brain debería estar funcionando 24/7 en Vercel, usando Supabase para su memoria. Ahora puedes probarlo enviando mensajes a tu bot de Telegram.
