import socket

#creating a socket object
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

#sending a dummy packet to a public DNS server
s.connect(("8.8.8.8", 80))

#getting the local IP address
ip = s.getsockname()[0]

#printing the IP address
print("Your IP address is:", ip)

#closing the socket connection
s.close()
