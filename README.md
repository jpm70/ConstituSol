# 🏛️ ConstituSol — Simulador Mnemotécnico de la Constitución Española (1978)

**[▶ Abrir ConstituSol](https://jpm70.github.io/ConstituSol/)** · versión sin React: [simulador_mesa.html](https://jpm70.github.io/ConstituSol/simulador_mesa.html)

**ConstituSol** es una aplicación web interactiva diseñada específicamente para **opositores** (Administración General del Estado, Justicia, Fuerzas y Cuerpos de Seguridad, Administración Local y Autonómica) que combina el **Sistema Mayor (Casillero Mental)** con el **texto íntegro oficial consolidado del BOE** de los **169 artículos** de la Constitución Española de 1978.

---

## ✨ Características Principales

### 🧠 6 Modos de Estudio y Entrenamiento
1. **🃏 Modo 1: Descubrimiento (Flashcards 3D con BOE por Apartados)**
   - Tarjetas interactivas con giro 3D libre de inversión especular (`rotateY`).
   - **Anverso**: Número del artículo, estado de dominio, tema general y resumen de apartados.
   - **Reverso**: Escena surrealista (`./assets/images/art_{id_articulo}.webp`), palabra del Casillero Mental, historia absurda y desglose completo por apartados con botón interactivo **`📖 Ver BOE`** para desplegar/ocultar el texto literal de cada apartado sin voltear la tarjeta.

2. **🎯 Modo 2: El Reto del Casillero (Adivinanza Inversa + BOE)**
   - Muestra la escena mnemotécnica, la palabra del casillero, la historia absurda y un **cuadro destacado con el Contenido Oficial del Artículo (BOE)** antes del formulario de respuesta.
   - Si el opositor acierta el número de artículo (1–169) **al primer intento**, el artículo queda marcado automáticamente como **Dominado (`🟢`)** en `localStorage`. Si falla, se registra en la lista de **Artículos con fallos (`⚠️`)**.

3. **⚡ Modo 3: Lluvia de Conceptos (Emparejamiento Rápido)**
   - Tablero de agilidad mental para emparejar números de artículo y su palabra del casillero con su tema general correspondiente.

4. **🕵️ Modo 4: Cazador de Trampas (Simulador de Examen Oficial)**
   - Preguntas tipo test de 4 opciones mezcladas aleatoriamente centradas en las trampas clásicas de los tribunales de oposición (*plazos cambiados, mayorías alteradas, órganos constitucionales cruzados o excepciones literales*).
   - 31 preguntas escritas a mano para los artículos más preguntados y, para el resto, preguntas generadas desde el **texto literal del BOE** (`scripts/trampas_literales.ts`). Cada opción incorrecta es la misma frase con **un solo detalle cambiado**: un plazo («setenta y dos horas» por «cuarenta y ocho»), una mayoría, un órgano (Rey/Presidente del Gobierno, Congreso/Senado, Tribunal Constitucional/Supremo…), «podrá» por «deberá», «ley orgánica» por «ley», «garantiza» por «reconoce»… Cuando el artículo no da para tres cambios, la pregunta es de localización: «¿En qué artículo se establece…?», con artículos vecinos como opciones.
   - Incluye el botón **`🧠 Ver anclaje mental`** para desplegar la pista mnemotécnica sin revelar la letra correcta.
   - Al responder, muestra una alerta detallada explicando la trampa exacta junto con el **fragmento literal del BOE vulnerado**.

5. **🗺️ Modo 5: Mapa Constitucional (Índice Estructural Interactivo)**
   - Navegación jerárquica completa: **Preámbulo, Título Preliminar y Títulos I a X**, además de las **Disposiciones Adicionales, Transitorias, Derogatoria y Final**.
   - Acordeones colapsables con contadores de progreso por Título y cuadrícula de **minitarjetas semafóricas**:
     - 🟢 **Verde**: Artículo dominado.
     - 🟡 **Amarillo**: Artículo en repaso.
     - ⚪ **Gris**: Artículo no estudiado.
   - Clic en cualquier minitarjeta para abrir el **Modal Rápido de Consulta** (cambio manual de estado, escena mnemotécnica, texto íntegro del BOE y acceso directo al Modo Descubrimiento).

6. **📝 Modo 6: Simulacro de Examen**
   - Examen de **10, 25, 50 o 100 preguntas** al azar entre los artículos del filtro activo (todos, no dominados, dominados o solo los fallados), **sin ver la solución hasta entregar**.
   - **Cronómetro** de 10 a 100 minutos (o sin límite) que entrega solo al llegar a cero, **penalización por error** configurable (−1/3, −1/4 o ninguna) y opción de **dejar preguntas en blanco**.
   - Navegación libre: anterior/siguiente y rejilla numerada para saltar a cualquier pregunta, con las contestadas marcadas.
   - Al entregar: **nota sobre 10**, aciertos, fallos, en blanco y tiempo empleado, y **corrección** de cada fallo con tu respuesta, la correcta y la explicación de la trampa.
   - Los artículos fallados pasan a **«Repasar solo artículos con fallos»**, con un botón que abre directamente el Cazador de Trampas filtrado. Se guardan los **últimos 10 simulacros** con su nota.

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

La aplicación carga dinámicamente las ilustraciones mnemotécnicas en formato **WebP** (900 × 600 px) siguiendo el patrón de nombres:

```text
public/assets/images/art_{id_articulo}.webp
```

Por ejemplo:
- `public/assets/images/art_1.webp` → Artículo 1 (*Té*)
- `public/assets/images/art_14.webp` → Artículo 14 (*Taco*)
- `public/assets/images/art_42.webp` → Artículo 42 (*Cuna*)
- `public/assets/images/art_169.webp` → Artículo 169 (*Taza-Sapo*)

Están las 169 (`art_1.webp` … `art_169.webp`). Para cambiar una, sustituye el archivo con el mismo nombre.

> **Gestor de errores integrado (`onerror`)**: si falta algún `art_X.webp`, el atributo `onerror` de la etiqueta `<img>` oculta el icono de imagen rota y muestra en su lugar un **cuadro de sustitución** con la palabra del casillero y el título del artículo, sin romper la maquetación.

---

## 📂 Estructura del Proyecto

El repositorio incluye tanto la aplicación modular en **React + TypeScript + Vite** como una versión **Vanilla HTML/CSS/JS autocontenida** lista para abrir o servir estáticamente:

```text
constitusol/
├── public/
│   ├── assets/
│   │   └── images/                 # Las 169 escenas: art_1.webp ... art_169.webp
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
  "imagen_url": "./assets/images/art_17.webp",
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

Requisitos: **[Bun](https://bun.sh/)** (el proyecto usa `bun.lock`).

```bash
git clone https://github.com/jpm70/ConstituSol.git
cd ConstituSol
bun install
bun run dev          # http://localhost:3000 (y /simulador_mesa.html para la versión sin React)
bun run build        # genera ./dist para publicar
bun run rebuild:db   # regenera datos_ce.js y src/datos_ce.ts si editas el script fuente
```

---

## 🌐 Publicación en GitHub Pages

El flujo [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) se ejecuta en cada `push` a `main`: instala con Bun, compila `./dist` y lo publica en **https://jpm70.github.io/ConstituSol/** (en **Settings → Pages**, la fuente es **GitHub Actions**).

La compilación usa rutas relativas (`base: './'`), así que funciona en la subcarpeta `/ConstituSol/` de GitHub Pages y en cualquier otro alojamiento estático.

---

## 🛠️ Cambios de esta versión

- **Imágenes visibles.** Las 169 escenas se subieron en `.webp`, pero la app las buscaba como `.jpg`, así que todas las tarjetas mostraban «Escena en preparación». Ahora se cargan las `.webp` en los cinco modos y en la versión sin React.
- **Lista para GitHub Pages.** Faltaba `base: './'` en Vite y había rutas absolutas (`/datos_ce.js`, `/simulador_mesa.html`…), así que en la subcarpeta de Pages la página salía en blanco. Además, se añade el workflow de despliegue.
- **Texto literal verificado.** Se ha comparado el texto de los 169 artículos con el BOE consolidado incluido en el repositorio y coincide palabra por palabra, incluidas las reformas de los artículos 135 (2011) y 49 (2024).
- **Preguntas trampa de tribunal.** 138 preguntas usaban la misma plantilla con distractores absurdos (siempre «mayoría de dos tercios en 48 horas» y «el CGPJ a propuesta del Defensor del Pueblo»). Ahora salen del texto literal del BOE con un solo detalle cambiado por opción, o son de localización del artículo.
- **Modo 6: Simulacro de Examen** con tiempo, penalización por error, nota sobre 10, corrección e historial; los fallos pasan a la lista de repaso.
- **Las preguntas de localización no delatan la respuesta.** En el Cazador de Trampas, la cabecera («Artículo N») y el anclaje mental se ocultan hasta responder.
- **Barra superior solo para estudiar.** «Código ConstituSol», «JSON Puro (Apartados)» y «Descargar ConstituSol» pasan a un desplegable al pie, «Para docentes y desarrolladores»; desde esas vistas, «← Volver al estudio» regresa a la mesa.
- **Limpieza.** Fuera las dependencias de AI Studio sin uso (Gemini, Express, `motion`, `dotenv`), `metadata.json` y `.env.example`. La página se declara en español (`lang="es"`).

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [`LICENSE`](./LICENSE) para más información.
