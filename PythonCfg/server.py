import sys, os, json, http.server, mimetypes, ssl,codecs,base64
from socketserver import ThreadingMixIn
server_dir = os.path.dirname(os.path.abspath(__file__))
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
        self.end_headers()
        try:
            length = int(self.headers['Content-Length'])
            content = self.rfile.read(length)
            data = json.loads(content)
            en_string = data['fileData']
            global server_dir
            img_dir = os.path.sep.join(server_dir.split(os.path.sep)[:-1]) + "/img/"
            f = open(img_dir + data['name'], 'wb')  # Datei wird erstellt
            de_string = en_string.split(',')[1]
            f.write(base64.b64decode(de_string))  # String wird in die Datei geschrieben
            f.close()                             # und abgespeichert
            self.wfile.write(bytes(data['name'] + " was saved successfully", "UTF8"))
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
