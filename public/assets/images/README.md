# Imágenes Mnemotécnicas de ConstituSol

Coloca en este directorio (`public/assets/images/`) las imágenes generadas en formato JPG siguiendo la nomenclatura:

- `art_1.jpg`
- `art_2.jpg`
- ...
- `art_169.jpg`

La aplicación las cargará automáticamente mediante la ruta relativa `./assets/images/art_{id_articulo}.jpg`. Si alguna imagen aún no existe en esta carpeta, el gestor `onerror` mostrará el cuadro de sustitución limpio con la palabra del casillero y el tema del artículo.
