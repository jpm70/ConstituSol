# 🏛️ ConstituSol — Simulador Mnemotécnico de la Constitución Española (1978)

**ConstituSol** es una aplicación web interactiva diseñada específicamente para **opositores** (Administración General del Estado, Justicia, Fuerzas y Cuerpos de Seguridad, Administración Local y Autonómica) que combina el **Sistema Mayor (Casillero Mental)** con el **texto íntegro oficial consolidado del BOE** de los **169 artículos** de la Constitución Española de 1978.

---

## ✨ Características Principales

### 🧠 5 Modos de Estudio y Entrenamiento
1. **🃏 Modo 1: Descubrimiento (Flashcards 3D con BOE por Apartados)**
   - Tarjetas interactivas con giro 3D libre de inversión especular (`rotateY`).
   - **Anverso**: Número del artículo, estado de dominio, tema general y resumen de apartados.
   - **Reverso**: Escena surrealista (`./assets/images/art_{id_articulo}.jpg`), palabra del Casillero Mental, historia absurda y desglose completo por apartados con botón interactivo **`📖 Ver BOE`** para desplegar/ocultar el texto literal de cada apartado sin voltear la tarjeta.

2. **🎯 Modo 2: El Reto del Casillero (Adivinanza Inversa + BOE)**
   - Muestra la escena mnemotécnica, la palabra del casillero, la historia absurda y un **cuadro destacado con el Contenido Oficial del Artículo (BOE)** antes del formulario de respuesta.
   - Si el opositor acierta el número de artículo (1–169) **al primer intento**, el artículo queda marcado automáticamente como **Dominado (`🟢`)** en `localStorage`. Si falla, se registra en la lista de **Artículos con fallos (`⚠️`)**.

3. **⚡ Modo 3: Lluvia de Conceptos (Emparejamiento Rápido)**
   - Tablero de agilidad mental para emparejar números de artículo y su palabra del casillero con su tema general correspondiente.

4. **🕵️ Modo 4: Cazador de Trampas (Simulador de Examen Oficial)**
   - Preguntas tipo test de 4 opciones mezcladas aleatoriamente centradas en las trampas clásicas de los tribunales de oposición (*plazos cambiados, mayorías alteradas, órganos constitucionales cruzados o excepciones literales*).
   - Incluye el botón **`🧠 Ver anclaje mental`** para desplegar la pista mnemotécnica sin revelar la letra correcta.
   - Al responder, muestra una alerta detallada explicando la trampa exacta junto con el **fragmento literal del BOE vulnerado**.

5. **🗺️ Modo 5: Mapa Constitucional (Índice Estructural Interactivo)**
   - Navegación jerárquica completa: **Preámbulo, Título Preliminar y Títulos I a X**, además de las **Disposiciones Adicionales, Transitorias, Derogatoria y Final**.
   - Acordeones colapsables con contadores de progreso por Título y cuadrícula de **minitarjetas semafóricas**:
     - 🟢 **Verde**: Artículo dominado.
     - 🟡 **Amarillo**: Artículo en repaso.
     - ⚪ **Gris**: Artículo no estudiado.
   - Clic en cualquier minitarjeta para abrir el **Modal Rápido de Consulta** (cambio manual de estado, escena mnemotécnica, texto íntegro del BOE y acceso directo al Modo Descubrimiento).

---

### 🔥 Gamificación, Rachas y Analítica (`localStorage`)
- **Sistema de Rachas Diarias (`Streak System`)**:
  - Control automático al iniciar la aplicación mediante las claves `ultimo_acceso` (`YYYY-MM-DD`), `racha_actual` y `mejor_racha`.
  - Si accedes en días consecutivos, tu racha aumenta (`+1`); si pasas más de un día sin estudiar, se reinicia a `1` conservando tu récord histórico.
- **Dashboard de Estadísticas en Tiempo Real**:
  1. 🔥 **Racha Activa** y mejor marca personal.
  2. 🎯 **Porcentaje Global Completado** sobre los 169 artículos de la CE.
  3. ✅ **Balance de Progreso**: Artículos Dominados vs. En Repaso vs. Pendientes.
  4. ⚠️ **Artículos con Fallos Frecuentes**: Contador de artículos fallados en el Modo Reto o en el Modo Cazador de Trampas.
- **Filtro Rápido de Repaso**:
  - Botón directo **`⚠️ Repasar solo artículos con fallos`** que filtra cualquier modo de estudio para practicar exclusivamente los artículos en los que has cometido errores.

---

### 📱 Diseño Responsive y Mobile-First
- **Móvil (`< 768px`)**: Contenedores al 100% de ancho útil, tipografía fluida mediante `clamp()`, controles táctiles de mínimo `44×44px` y formularios apilados en vertical para uso cómodo con una sola mano.
- **Tablet (`768px – 1023px`)**: Tarjetas centradas (`max-w-2xl`) y rejillas adaptadas a 2–3 columnas.
- **Escritorio (`>= 1024px`)**: Tapete de estudio en 3 columnas para el Modo Descubrimiento y 5 columnas para las minitarjetas del Mapa Constitucional.

---

## 🖼️ Gestión de Imágenes Mnemotécnicas (`./assets/images/`)

La aplicación carga dinámicamente las ilustraciones mnemotécnicas en formato JPG siguiendo el patrón de nombres:

```text
public/assets/images/art_{id_articulo}.jpg
```

Por ejemplo:
- `public/assets/images/art_1.jpg` → Artículo 1 (*Hada*)
- `public/assets/images/art_14.jpg` → Artículo 14 (*Toro*)
- `public/assets/images/art_42.jpg` → Artículo 42 (*Cuna*)
- `public/assets/images/art_169.jpg` → Artículo 169 (*Tuerca Vuelta*)

> **Gestor de errores integrado (`onerror`)**: Si algún archivo `art_X.jpg` aún no se ha copiado a la carpeta `public/assets/images/`, el atributo `onerror` de la etiqueta `<img>` oculta automáticamente el icono de imagen rota y renderiza en su lugar un **cuadro de sustitución limpio** con la palabra del casillero y el título del artículo, manteniendo intacta la maquetación (`height: 200px–240px`, `object-fit: cover` y bordes redondeados).

---

## 📂 Estructura del Proyecto

El repositorio incluye tanto la aplicación modular en **React + TypeScript + Vite** como una versión **Vanilla HTML/CSS/JS autocontenida** lista para abrir o servir estáticamente:

```text
constitusol/
├── public/
│   ├── assets/
│   │   └── images/                 # Carpeta para las imágenes art_1.jpg ... art_169.jpg
│   ├── app_mnemotecnia.js          # Lógica completa en Vanilla JavaScript (ES6+)
│   ├── datos_ce.js                 # Base de datos global (window.constitucion_db)
│   ├── simulador_mesa.html         # Aplicación standalone en HTML5 + CSS3 + JS
│   ├── constitucion_db.json        # Exportación JSON de los 169 artículos
│   └── constitucion_apartados.json # Desglose literal de apartados del BOE
├── scripts/
│   └── build_datos_ce.ts           # Script generador/sincronizador de los 169 artículos
├── src/
│   ├── App.tsx                     # Interfaz principal React + Inspector de Código y JSON
│   ├── datos_ce.ts                 # Base de datos tipada en TypeScript (169 artículos)
│   ├── estructura_ce.ts            # Jerarquía oficial de Títulos, Capítulos y Disposiciones
│   ├── mesa_juego.css              # Sistema de diseño Mobile-First, 3D Flip y Dashboard
│   ├── standalone_template.ts      # Plantilla sincronizada para descarga en 1 clic
│   └── main.tsx                    # Punto de entrada React
├── datos_ce.js                     # Copia raíz de la base de datos para uso directo
├── index.html                      # Entrada principal Vite
├── package.json                    # Dependencias y scripts de compilación
├── tsconfig.json                   # Configuración de TypeScript
└── vite.config.ts                  # Configuración de Vite
```

---

## 🗄️ Esquema JSON de Cada Artículo (`datos_ce.js`)

Cada uno de los 169 artículos sigue estrictamente este esquema estructurado:

```json
{
  "id_articulo": "17",
  "tema_general": "Derecho a la libertad y seguridad y plazo de detención",
  "palabra_casillero": "Taco",
  "historia_mnemotecnica": "Un TACO gigante de billar rompe los barrotes de un calabozo exactamente a las 72 horas para liberar a un detenido con un cartel de Habeas Corpus.",
  "prompt_imagen": "Surrealist digital art of a giant billiard cue breaking prison bars with a glowing 72 hours clock, vivid colors",
  "imagen_url": "./assets/images/art_17.jpg",
  "apartados": [
    {
      "id_apartado": "17.1",
      "concepto_clave": "Derecho a la libertad y a la seguridad personal",
      "texto_oficial": "Toda persona tiene derecho a la libertad y a la seguridad. Nadie puede ser privado de su libertad, sino con la observancia de lo establecido en este artículo y en los casos y en la forma previstos en la ley."
    },
    {
      "id_apartado": "17.2",
      "concepto_clave": "Detención preventiva máxima de 72 horas",
      "texto_oficial": "La detención preventiva no podrá durar más del tiempo estrictamente necesario para la realización de las averiguaciones tendentes al esclarecimiento de los hechos, y, en todo caso, en el plazo máximo de setenta y dos horas, el detenido deberá ser puesto en libertad o a disposición de la autoridad judicial."
    }
  ],
  "test_trampa": {
    "enunciado": "Según el artículo 17.2 de la Constitución Española, la detención preventiva:",
    "opciones": [
      "No podrá durar más de cuarenta y ocho horas antes de pasar a disposición del Ministerio Fiscal.",
      "No podrá durar más del tiempo estrictamente necesario para las averiguaciones y, en todo caso, en el plazo máximo de setenta y dos horas el detenido deberá ser puesto en libertad o a disposición de la autoridad judicial.",
      "Tendrá una duración fija de setenta y dos horas prorrogables por otras cuarenta y ocho mediante resolución gubernativa.",
      "Requerirá autorización previa del Defensor del Pueblo cuando supere las veinticuatro horas."
    ],
    "indice_correcta": 1,
    "trampa_explicacion": "Ojo: el tribunal suele sustituir «setenta y dos horas» por «48 horas» o cambiar «autoridad judicial» por «Ministerio Fiscal». Además, las 72 horas son un límite máximo («no más del tiempo estrictamente necesario»), no una duración fija."
  }
}
```

---

## 🚀 Instalación y Uso Local

### Requisitos previos
- **Node.js** `>= 18.x`
- **npm** `>= 9.x` (o `bun` / `pnpm`)

### Pasos de instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jpm70/constitusol.git
   cd constitusol
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo (puerto 3000):**
   ```bash
   npm run dev
   ```
   Abre `http://localhost:3000` en tu navegador.
   *(También puedes acceder directamente a la versión Vanilla JS en `http://localhost:3000/simulador_mesa.html`).*

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los archivos optimizados se generarán en la carpeta `dist/`.

5. **Regenerar la base de datos (`datos_ce.js` y `src/datos_ce.ts`) si editas el script fuente:**
   ```bash
   npm run rebuild:db
   ```

---

## 🌐 Cómo Subir a GitHub y Desplegar

### Subir el proyecto a tu cuenta de GitHub

```bash
git init
git add .
git commit -m "feat: lanzamiento inicial de ConstituSol (169 artículos CE + Casillero Mental)"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/constitusol.git
git push -u origin main
```

### Despliegue gratuito en 1 clic
- **Vercel / Netlify**: Importa el repositorio desde GitHub. El comando de compilación es `npm run build` y el directorio de salida es `dist`.
- **GitHub Pages (modo estático)**: Puedes publicar el contenido compilado de `dist/` o servir directamente la carpeta `public/` abriendo `simulador_mesa.html`.

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para más información.
