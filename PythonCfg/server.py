import sys, os, json, http.server, mimetypes, ssl,base64
from socketserver import ThreadingMixIn
import ajaxGoogleAPI
server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
img_dir = server_root + "/img/"
json_dir = server_root + "/json/"
# commit


def saveJSON(request):
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


def jsonData(request):
    print(request)
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
        f = open(img_dir + request['name'], 'wb')  # Datei wird erstellt
        de_string = en_string.split(',')[1]
        f.write(base64.b64decode(de_string))  # String wird in die Datei geschrieben
        f.close()							 # und abgespeichert
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


def imglist():
    global img_dir
    imglist = os.listdir(server_root+"/img/menu/")
    return json.dumps(imglist)


class MyServer(http.server.BaseHTTPRequestHandler):
    key = "Basic:test" #Benutzer & Kennwort für admin Bereich
    key = base64.b64encode(bytes(key, "UTF8"))

    def do_AUTHHEAD(self):
        print("send header")
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm=\"test\"')
        self.send_header('Content-type', 'text/html')
        self.end_headers()


    def do_GET(self):
        global server_root
        rootdir = server_root
        mime, encoding = mimetypes.guess_type(self.path)
        if ("admin" in self.path):
            if('Basic '+ MyServer.key.decode("utf-8") != self.headers['Authorization'] or self.headers['Authorization'] == None):
                self.do_AUTHHEAD()
                self.wfile.write(bytes('no auth header received',"UTF8"))
                pass
            elif(self.headers['Authorization'] in 'Basic '+ MyServer.key.decode("utf-8")):
                print("passed")
                self.__set_header(mime)
                self.__getfile(self.path,encoding,mime)
                pass
        else:
            self.__set_header(mime)
            self.__getfile(self.path,encoding,mime)
            pass

    def __getfile(self,path,encoding,mime):
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
            self.send_error(404, "FILE NOT FOUND")

    def __set_header(self, mime):
        self.send_response(200)
        self.send_header('Content-type', mime)
        self.end_headers()

    def delete_header(self):
        self.send_response(200)
        self.send_header("Authorization"," ")
        self.end_headers()
        return "OK"

    def __convertHTML(self, path, encoding = 'UTF8'):
        return bytes(open(path, 'r').read(), encoding)

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*  ')
        self.end_headers()
        request = self.rfile.read(int(self.headers['Content-Length']))
        data = json.loads(request)
        #print(type(data['request']))
        try:
            if data['request'] == 'fileUpload':
                response = fileupload(data)
                self.wfile.write(bytes(response, 'UTF8'))
            if data['request'] == 'images':
                response = imglist()
                self.wfile.write(bytes(response, 'UTF8'))
            if data['request'] == 'jsonRequest':
                response = jsonData(data)
                #print(response)
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
        except IOError:
            self.send_error(404, "Something went wrong")


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
try:
    while 1:
        sys.stdout.flush()
        server.handle_request()
except KeyboardInterrupt:
    print("Shutting down server per users request.")

