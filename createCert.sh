# openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365

openssl genpkey -algorithm RSA -out key.pem -pkeyopt rsa_keygen_bits:2048

openssl req -x509 -new -key key.pem -out cert.pem -days 365 -subj "/CN=192.168.177.132"