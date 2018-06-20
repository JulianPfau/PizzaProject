# coding=utf-8

import base64
import http.server
import json
import mimetypes
import os
import ssl
import sys
from socketserver import ThreadingMixIn

# from PythonCfg import ajaxGoogleAPI
# from PythonCfg import requestsJSON
# from PythonCfg import sessionid
import telegramBot
import ajaxGoogleAPI
import requestsJSON
import sessionid

'''
Sets all necessary paths to global variables.
'''
server_dir = os.path.dirname(os.path.abspath(__file__))
server_root = os.path.sep.join(server_dir.split(os.path.sep)[:-1])
img_dir = server_root + "/img/"
json_dir = server_root + "/json/"
pdf_dir = server_root + "/pdf/"


# commit


def save_json(request):
    """
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
    """
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


def get_json_data(request):
    """
    Reads the whole json-string out of the specified file and sets
    ist as the response.
    
    Security Issue: Can leak all stored information because the ist no
    security check for the post-request yet.
    
    Args:
        request (dict): contains the filename of the selected json-file
    
    Returns:
        dict:   if successful: set the response to the containment of the file
    """
    try:
        global json_dir
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
    """
    Function handles the image upload to the server.
    The file ist transmitted  via a base64 encoded string
    and on the server encodes it bag to the original format.
    
    Args:
        request (dict): contains the image string and image name
    
    Return:
        dict    successful: OK, image path
                else: error, image name
    """
    try:
        en_string = request['fileData']
        global img_dir
        f = open(img_dir + "/menu/" + request['name'], 'wb')
        de_string = en_string.split(',')[1]
        f.write(base64.b64decode(de_string))
        f.close()
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


def pdf_upload(request):
    """
    Handles the pdf upload. The pdf ist encoded with utf8
    and on the server decoded again.
    
    Args:
        request (dict): contains the name and content of the pdf
    
    Return:
        dict    if successful: ok, path to directory
                else: Error
    """
    try:
        pdf = request.decode("utf-8")
        global pdf_dir
        f = open(pdf_dir + pdf[pdf.find("name=") + 6: pdf.find(".pdf")] + ".pdf", 'wb')  # File is created
        f.write(request)
        f.close()  # and saved
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


def img_list():
    """
    Lists all the pictures stored in the folder menu
    on the server.
    
    Args:
    
    Return:
        dict    List of the Pictures as a json-string
    """
    global img_dir
    img_list_data = os.listdir(server_root + "/img/menu/")
    return json.dumps(img_list_data)


def login(request):
    """
    Handles the login of the server and creates a session id.
    
    Args:
        request (dict)  contains the username/email-address and password
                        in this structure:
                        {
                            "request" : "login",
                            "username" : "",
                            "password" : ""
                        }
    
    Return:
        if successful: OK, SessionId
        else: False
    """
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
                    'sid': sessionid.create_session_id()
                }
        response = json.dumps(response)
        return response

    except IOError:
        return False


def register(request):
    """
    Handles a register request to the server.
    Function tests if email address is already registered.
    If not the new account information are stored.
    
    Args:
        request (dict): Contains all information of the
                        new customer 
                        in this structure:
                        {
                            "id": ,
                            "firstname": "",
                            "lastname": "",
                            "email": "",
                            "password": "",
                            "contact": {
                                "name": "firstname" + " " + "lastname",
                                "postcode": "",
                                "street": "",
                                "city": "",
                                "nr": "",
                                "phone": "",
                                "chat_id": ""
                            }
                        }
    
    Return:
        if email exist: Error
        if successful stored: Ok
        else: Error
    """
    global json_dir

    try:
        with open(json_dir + "customers.json", "r+") as file:
            contacts = json.loads(file.read())
            number = 0
            value = request["value"]
            found = False

            for contact in contacts:
                if value["email"] == contact["email"]:
                    response = {
                        'STATUS': 'ERROR'
                    }
                    found = True
                    break

                if number < int(contact["id"]):
                    number = int(contact["id"])

            if not found:
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
                        "phone": value["phone"],
                        "chat_id": value["chat_id"]
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
    """
    Server class, handles all the requests made by clients.
    
    Args:
        http.server.BaseHTTPRequestHandler (handler)
        
    Return:
        to the client:
            different web pages via "get"
            different actions via "post"
            error messages,...
    """
    key = "Basic:test"  # User & Password for admin Page
    key = base64.b64encode(bytes(key, "UTF8"))

    def do_AUTHHEAD(self):
        """
        Sends a error message by a wrong authentication.
        
        Args:
            self (class): contains the reference 
                          information to the own class
        
        Return:
            Error 401
        """
        print("send header")
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm=\"test\"')
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        """
        Handles the "GET" requests to the server.
        And a basic authentication for the admin page.
        
        Args:
            self (class): contains the reference 
                          information to the own class
        
        Return:
            different web pages to the client
        """
        global server_root

        if self.path == "/":
            self.path = "/index.html"

        '''
        appends to a file ".html" if no file extension is given
        '''
        if (not (self.path.endswith(".html") or self.path.endswith(".css") or self.path.endswith(
                ".json") or self.path.endswith(".js") or self.path.endswith(".gif") or self.path.endswith(".png")
                 or self.path.endswith(".jpg") or self.path.endswith(".ico"))):
            self.path += ".html"

        mime, encoding = mimetypes.guess_type(self.path)
        if "admin" in self.path:
            if ('Basic ' + MyServer.key.decode("utf-8") != self.headers['Authorization'] or
                    self.headers['Authorization'] is None):
                self.do_AUTHHEAD()
                self.wfile.write(bytes(open(server_root + "/401.html").read(), "UTF8"))
                pass
            elif self.headers['Authorization'] in 'Basic ' + MyServer.key.decode("utf-8"):
                print("passed")
                self.__set_header(mime)
                self.__getfile(self.path, encoding, mime)
                pass
        else:
            self.__set_header(mime)
            self.__getfile(self.path, encoding, mime)
            pass

    def __getfile(self, path, encoding, mime):
        """
        Loads requested files and sends it to the customer.
        
        Args:
            self (class)  : contains the reference 
                            information to the own class
            path (str)    : contains the requested path
            encoding (str): if given: contains the encoding
            mime (str)    : holds information of the mime-type
        """
        global server_root
        try:
            if encoding is None:
                f = open(server_root + path, 'rb')  # open requested file
                self.wfile.write(bytes(f.read()))
            else:
                f = open(server_root + path)
                self.wfile.write(bytes(f.read(), "UTF8"))
                f.close()
        except IOError:
            self.wfile.write(bytes(open(server_root + "/404.html").read(), "UTF8"))

    def __set_header(self, mime):
        """
        Sets the header for a response to the client
        if the request was successful.
        
        Args:
            self (class)  : contains the reference 
                            information to the own class
            mime (str)    : holds information of the mime-type
        
        Return:
            Code 200, mime type
        """
        self.send_response(200)
        self.send_header('Content-type', mime)
        self.end_headers()

    def delete_header(self):
        self.send_response(200)
        self.send_header("Authorization", " ")
        self.end_headers()
        return "OK"

    @staticmethod
    def __convertHTML(path, encoding='UTF8'):
        """
        Converts a html file to bytes.
        
        Args:
            self (class)  : contains the reference 
                            information to the own class
            path (str)    : contains the requested path
            encoding (str): contains the encoding, 
                            if not given sets it tp "UTF")
        
        Return:
            encoded file content
        """
        return bytes(open(path, 'r').read(), encoding)

    def do_POST(self):
        """
        Handles the "POST" requests to the server
        based on the information stored in the "request" 
        segment of the request.
        
        Args:
            self (class): contains the reference 
                          information to the own class
        
        Return:
            different information to the client
        """
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
                    response = img_list()
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'jsonRequest':
                    response = get_json_data(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'ajaxGoogleAPI':
                    response = ajaxGoogleAPI.calc_distance(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'save_json':
                    response = save_json(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'deleteHeader':
                    response = MyServer.delete_header(self)
                    self.wfile.write(bytes(response, "UTF8"))
                if data['request'] == 'newOrder':
                    response = requestsJSON.append_order(json_dir, data)
                    self.wfile.write(bytes(response, "UTF8"))
                if data['request'] == 'get_order_by_id':
                    response = requestsJSON.get_order_by_id(json_dir, data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'login':
                    response = login(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'logout':
                    response = sessionid.logout(data['value']['sid'])
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'register':
                    response = register(data)
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'checkSID':
                    response = sessionid.check_session_id(data['value']['sid'])
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'getUserData':
                    response = requestsJSON.get_customer_data_by_mail(json_dir, data['value']['email'])
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'updateData':
                    response = requestsJSON.update_user_data(json_dir, data['value'])
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'delete_user':
                    response = requestsJSON.delete_user(json_dir, data['value'])
                    self.wfile.write(bytes(response, 'UTF8'))
                if data['request'] == 'get_order_by_mail':
                    print("order by email request")
                    response = requestsJSON.get_order_by_mail(json_dir, data['value'])
                    self.wfile.write(bytes(response, 'UTF8'))
            except IOError:
                self.send_error(404, "Something went wrong")
        except json.decoder.JSONDecodeError:
            pdf_upload(request)


class ThreadingSimpleServer(ThreadingMixIn, http.server.HTTPServer):
    """
    Handles the multithreading of the web server.
    
    Args:
        ThreadingMixIn (tuple): information about the ip and port
        http.server.HTTPServer (handler)
    
    return:
    """
    pass


if __name__ == '__main__':
    '''
    This sets the listening port, default port 8080
    '''
    if sys.argv[1:]:
        PORT = int(sys.argv[1])
    else:
        PORT = 8080

    server = ThreadingSimpleServer(('localhost', PORT), MyServer)

    '''
    Changes the usual socket from the handler to a encrypted socket.
    '''
    server.socket = ssl.wrap_socket(server.socket,
                                    server_side=True,
                                    certfile=server_dir + '/server_org.pem',
                                    ssl_version=ssl.PROTOCOL_TLSv1
                                    )

    print("running on https://localhost:" + str(PORT))
    try:
        while 1:
            sys.stdout.flush()
            server.handle_request()

    except KeyboardInterrupt:
        print("Shutting down server per users request.")
