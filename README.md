Pizza Service - Eine webbasierte Software für ein Pizzalieferunternehmen.

---Beschreibung---
Es wurden folgende Kernaspekte berücksichtigt:

    - Erstellung und Verwaltung von Kundenkonten
    - Umgang mit Bestellungen
    - Administration der Website und der Daten
    
---Technologie---

  -	Web Server in Python 3
    •	https
    
  -	Serverseitige Datenspeicherung in JSON Datenbank
    •	Speisekarte
    •	Kundendaten
    •	Bestellungen

  - Clientseitig
    •   HTML 5 / CSS 3 und JavaScript


---How to operate---

1. Start Server.py
2. tbd


Umgebung feststellen:
Schritt 1: Warenkorb erstellen (Warenkorb Serverseitig) Session ID in Cookie, anhand Session ID wird Warenkorb aufgelistet
Schritt 2 Identifizierung (optional)
Schritt 3 Authentifizierung (optional)
Schritt 4 Bei Gast Adresseingabe mit Formular (Bei Mitglied aus Nutzerdaten)
Name, Nachname, Adresse, Hausnummer, Postleitzahl, Ort, E-Mail-Adresse, Telefon
Eingabe Validierung!!!!
Auswahl Bezahlmethode
Eingabe von Coupons
Lieferzeitpunkt auswählen / Abholzeitpunkt

Probleme:
Validierung von Bestellmenge
Zusammenfassung Kurs
•	Aktive Speisekarte / Bilder
•	PLZ/Lieferradius/Wartezeit
•	Kundenkonto/optionales Login
o	Formular Lieferadresse/Bezahlung
•	Validieren von Liefer- & Rechnungsadresse
•	Limits für Banking/Lieferung
•	Bestellübersicht
•	Übertragung der Bestellung / Bestätigung
•	Extras zur Pizza hinzufügen
•	Mindestbestellwert
•	Administrator Funktionen

Projektstufe 1
1.	Datenstruktur in JSON
2.	Administration 
3.	Lesen/schreiben von JSON
a.	JavaScript / AJAX
b.	Python / http
4.	Web Server mit AJAX in Betrieb nehmen
a.	URLs festlegen
b.	Funktionale Koppelung
