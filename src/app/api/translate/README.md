# `translate`

Endpoint local para traducir textos desde español a los idiomas soportados por la UI.

## Responsabilidad

Evitar llamadas directas desde el cliente a servicios externos y centralizar la traducción automática con validación de entrada.

## Uso

- método: `POST`
- payload: `{ text, targetLanguage }`
- respuesta: `{ translatedText }`
