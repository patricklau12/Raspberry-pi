"""
For receiving UART command from other devices, by TX RX pins
"""

#Import libraries
import serial
from time import sleep



ser = serial.Serial ("/dev/ttyS0", 9600)    #Open port with baud rate,
                                            #serial0: ttyS0; serial1: ttyAMA0
print(ser.name)
while True:
    received_data = ser.read()              #read serial port
    sleep(0.03)
    data_left = ser.inWaiting()             #check for remaining byte
    received_data += ser.read(data_left)
    #print (received_data.decode('utf-8'))   #print received data, decode with utf-8
    ser.write(received_data)                #transmit data serially
    
    decoded_data = received_data.decode('utf-8')
    print (decoded_data)
    if decoded_data == '1':
        print ('one')


