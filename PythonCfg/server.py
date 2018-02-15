import sys, os, json, http.server, mimetypes, ssl,base64
from socketserver import ThreadingMixIn
server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
img_dir = server_root + "/img/"
json_dir = server_root + "/json/"


def jsonData(request):
    try:
        global json_dir
        f = open(json_dir + request['file'], 'r')  # Datei wird erstellt
        json_data = f.read(f)
        response = {
            'STATUS': 'OK',
            'jsonData': json_data
        }
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
        f.close()                             # und abgespeichert
        response = {
            'STATUS': 'OK',
            'imgPath': str("./img/" + request['name'])
        }
        return json.dumps(response)
    except IOError:
        return False


def imglist():
    global img_dir
    imglist = os.listdir(img_dir)
    return json.dumps(imglist)


class MyServer(http.server.BaseHTTPRequestHandler):

    def do_GET(self):
        rootdir = '/Users/Julian/WE1/'  # file location
        mime, encoding = mimetypes.guess_type(self.path)

        try:
            self.send_response(200)
            if encoding is None:
                f = open(rootdir + self.path, 'rb')  # open requested file
                self.send_header('Content-type', mime)
                self.end_headers()
                self.wfile.write(bytes(f.read()))
            else:
                f = open(rootdir + self.path)
                self.send_header('Content-type', mime)
                self.end_headers()
                self.wfile.write(bytes(f.read(), "UTF8"))
                f.close()

            return

        except IOError:
            self.send_error(404, "FILE NOT FOUND")

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.send_header('Access-Control-Allow-Origin', '*  ')
        self.end_headers()
        request = self.rfile.read(int(self.headers['Content-Length']))
        data = json.loads(request)
        try:
            if data['request'] == 'fileUpload':
                response = fileupload(data)
                self.wfile.write(bytes(response, 'UTF8'))
            if data['request'] == 'images':
                response = imglist()
                self.wfile.write(bytes(response, 'UTF8'))
            if data['request'] == 'jsonRequest':
                response = jsonData(data)
                self.wfile.writeby(bytes(response, 'UTF8'))

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

