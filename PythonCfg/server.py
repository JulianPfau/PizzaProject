# coding=utf-8

import base64
import http.server
import json
import mimetypes
import os
import ssl
import sys
from socketserver import ThreadingMixIn

from PythonCfg import ajaxGoogleAPI
from PythonCfg import requestsJSON
from PythonCfg import sessionid

'''
Sets all necessary paths to global variables.
'''
server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
img_dir = server_root + "/img/"
json_dir = server_root + "/json/"
pdf_dir = server_root + "/pdf/"


# commit


def saveJSON(request):
    '''
    Saves a transmitted json to the specified file.
    !!Caution!! The file will be overwritten.
    Functions for future expansion to backup and restore 
    json-files.
    
    Function not possible to call because of security concerns.
    
    Args:
        request (dict): contains the new json string 
                        which will be written to the file
    
    Returns:
        dict:   if successful: OK
                Write not successful: Error    
    '''
    global json_dir
    try:
        with open(json_dir + request["fileName"] + ".json", "w") as file:
            file.write(json.dumps(request["jsonData"]))

        response = {
            'STATUS': 'OK'
        }

    except IOError:
        response = {
            'STATUS': 'ERROR'
        }
    response = json.dumps(response)
    return response


def jsondata(request):
    '''
    Reads the whole json-string out of the specified file and sets
    ist as the response.
    
    Security Issue: Can leak all stored Informations because the ist no 
    security check for the post-request yet.
    
    Args:
        request (dict): contains the filename of the selected json-file
    
    Returns:
        dict:   if successful: set the response to the containment of the file
    '''
    try:
        global json_dir
        # f = open(json_dir + request['file'] + ".json", 'r')  # Datei wird erstellt
        with open(json_dir + request['file'] + ".json") as json_data:
            d = json.load(json_data)
        response = {
            'STATUS': 'OK',
            'jsonData': d
        }
        response = json.dumps(response)
        return response
    except IOError:
        return False


def fileupload(request):
    try:
        en_string = request['fileData']
        global img_dir
        f = open(img_dir + "/menu/" + request['name'], 'wb')  # Datei wird erstellt
        de_string = en_string.split(',')[1]
        f.write(base64.b64decode(de_string))  # String wird in die Datei geschrieben
        f.close()  # und abgespeichert
        response = {
            'STATUS': 'OK',
            'imgPath': str("../img/menu/" + request['name'])
        }
    except IOError:
        response = {
            'STATUS': 'ERROR',
            'img': request['name']
        }

    response = json.dumps(response)
    return response


def pdfupload(request):
    try:
        pdf = request.decode("utf-8")
        global pdf_dir
        f = open(pdf_dir + pdf[pdf.find("name=") + 6: pdf.find(".pdf")] + ".pdf", 'wb')  # Datei wird erstellt
        f.write(request)
        f.close()  # und abgespeichert
        response = {
            'STATUS': 'OK',
            'imgPath': str("../pdf/")
        }
    except IOError:
        response = {
            'STATUS': 'ERROR',
            'img': ''
        }

    response = json.dumps(response)
    return response


def imglist():
    global img_dir
    imglist = os.listdir(server_root + "/img/menu/")
    return json.dumps(imglist)


def login(request):
    try:
        global json_dir
        with open(json_dir + "customers.json") as json_data:
            customers = json.load(json_data)

        response = {
            'STATUS': 'ERROR'
        }
        for customer in customers:
            if (request["value"]["username"] == customer["email"]
                    and request["value"]["password"] == customer["password"]):
                response = {
                    'STATUS': 'OK',
                    'sid': sessionid.createSessionID()
                }
        response = json.dumps(response)
        return response

    except IOError:
        return False


def register(request):
    global json_dir

    try:
        with open(json_dir + "customers.json", "r+") as file:
            contacts = json.loads(file.read())
            number = 0
            value = request["value"]
            found = False

            for contact in contacts:
                if (value["email"] == contact["email"]):
                    response = {
                        'STATUS': 'ERROR'
                    }
                    found = True
                    break

                if (number < int(contact["id"])):
                    number = int(contact["id"])

            if (not found):
                data = {
                    "id": (number + 1),
                    "firstname": value["firstname"],
                    "lastname": value["lastname"],
                    "email": value["email"],
                    "password": value["password"],
                    "contact": {
                        "name": value["firstname"] + " " + value["lastname"],
                        "postcode": value["postcode"],
                        "street": value["street"],
                        "city": value["city"],
                        "nr": value["streetNr"],
                        "phone": value["phone"]
                    }
                }
                contacts.append(data)
                file.seek(0)
                file.truncate()
                file.write(json.dumps(contacts))
                response = {
                    'STATUS': 'OK'
                }

        file.close()

    except IOError:
        response = {
            'STATUS': 'ERROR'
        }
    response = json.dumps(response)
    return response


class MyServer(http.server.BaseHTTPRequestHandler):
    key = "Basic:test"  # Benutzer & Kennwort für admin Bereich
    key = base64.b64encode(bytes(key, "UTF8"))

    def do_AUTHHEAD(self):
        print("send header")
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm=\"test\"')
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        global server_root
        # rootdir = server_root

        if (self.path == "/"):
            self.path = "/speisekarte.html"

        if (not (self.path.endswith(".html") or self.path.endswith(".css") or self.path.endswith(
                ".json") or self.path.endswith(".js") or self.path.endswith(".gif") or self.path.endswith(
            ".png") or self.path.endswith(".jpg") or self.path.endswith(".ico"))):
            self.path += ".html"

        mime, encoding = mimetypes.guess_type(self.path)
        if ("admin" in self.path):
            if ('Basic ' + MyServer.key.decode("utf-8") != self.headers['Authorization'] or self.headers[
                'Authorization'] == None):
                self.do_AUTHHEAD()
                self.wfile.write(bytes(open(server_root + "/401.html").read(), "UTF8"))
                pass
            elif (self.headers['Authorization'] in 'Basic ' + MyServer.key.decode("utf-8")):
                print("passed")
                self.__set_header(mime)
                self.__getfile(self.path, encoding, mime)
                pass
        else:
            self.__set_header(mime)
            self.__getfile(self.path, encoding, mime)
            pass

    def __getfile(self, path, encoding, mime):
        global server_root
        try:
            if encoding is None:
                f = open(server_root + self.path, 'rb')  # open requested file
                self.wfile.write(bytes(f.read()))
            else:
                f = open(server_root + self.path)
                self.wfile.write(bytes(f.read(), "UTF8"))
                f.close()
        except IOError:
            self.wfile.write(bytes(open(server_root + "/404.html").read(), "UTF8"))

    def __set_header(self, mime):
        self.send_response(200)
        self.send_header('Content-type', mime)
        self.end_headers()

    def delete_header(self):
        self.send_response(200)
        self.send_header("Authorization", " ")
        self.end_headers()
        return "OK"

    def __convertHTML(self, path, encoding='UTF8'):
        return bytes(open(path, 'r').read(), encoding)

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*  ')
        self.end_headers()
        request = self.rfile.read(int(self.headers['Content-Length']))
        try:
            data = json.loads(request)
            try:
                if data['request'] == 'fileUpload':
                    response = fileupload(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'images':
                    response = imglist()
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'jsonRequest':
                    response = jsondata(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'ajaxGoogleAPI':
                    response = ajaxGoogleAPI.calcDistance(data['plz_pizza'], data['plz_user'])
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'saveJSON':
                    response = saveJSON(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'deleteHeader':
                    response = MyServer.delete_header(self)
                    self.wfile.write(bytes(response, "UTF8"))
                if data['request'] == 'newOrder':
                    response = requestsJSON.appendOrder(json_dir, data)
                    self.wfile.write(bytes(response, "UTF8"))
                if data['request'] == 'getOrderbyId':
                    response = requestsJSON.getOrderbyId(json_dir, data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'login':
                    response = login(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'register':
                    response = register(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'checkSID':
                    response = sessionid.checkSessionID(data['value']['id'])
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'getOrderbyMail':
                    response = requestsJSON.getOrderbyMail(json_dir, data)
                    self.wfile.write(bytes(response, 'UTF8'))
            except IOError:
                self.send_error(404, "Something went wrong")
        except json.decoder.JSONDecodeError:
            pdfupload(request);


class ThreadingSimpleServer(ThreadingMixIn, http.server.HTTPServer):
    pass


'''
This sets the listening port, default port 8080
'''

if sys.argv[1:]:
    PORT = int(sys.argv[1])
else:
    PORT = 8080
server = ThreadingSimpleServer(('localhost', PORT), MyServer)
server.socket = ssl.wrap_socket(server.socket,
                                server_side=True,
                                certfile=server_dir + '/server_org.pem',
                                ssl_version=ssl.PROTOCOL_TLSv1
                                )
print("running..")
try:
    while 1:
        sys.stdout.flush()
        server.handle_request()

except KeyboardInterrupt:
print("Shutting down server per users request.")
