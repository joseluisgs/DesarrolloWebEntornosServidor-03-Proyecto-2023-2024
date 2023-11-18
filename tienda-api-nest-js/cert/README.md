# Certificados con OpenSSL

## Crear un certificado autofirmado

```bash
openssl genrsa -out keystore.p12 2048
openssl req -new -x509 -key keystore.p12 -out cert.pem -days 365
```

## Instalar OpenSSL en Windows

Ir a: https://slproweb.com/products/Win32OpenSSL.html

Seleccionar la versión de acuerdo a la arquitectura del sistema operativo.

Se recomienda la version light.

Luego usar la consola de OpenSSL que se instala en el menú de inicio.

## Instalar OpenSSL en Linux

```bash
sudo apt-get install openssl
```
