#/usr/bin/python

def usekne_hlavu(drak):
  return drak

def usekne_ocas(drak):
  hlavy, ocasy = drak
  return (hlavy, ocasy + 1)

def usekne_dve_hlavy(drak):
  hlavy, ocasy = drak
  return (hlavy - 2, ocasy)

def usekne_dva_ocasy(drak):
  hlavy, ocasy = drak
  return (hlavy + 1, ocasy - 2)

# Pouziju BFS aneb pruchod do sirky prostorem stavu a vyzkousim tim vsechny moznosti
def bfs(puvodni_drak):
  # fronta na ukladani stavu k projiti
  # vkladam do ni aktualniho draka a seznam seknuti kterym jsem ho vytvoril
  fronta = []
  puvodni_hlavy, puvodni_ocasy = puvodni_drak

  # pridam vsechny mozne seknuti v prvnim kroku
  if puvodni_hlavy > 0:
    fronta.append((puvodni_drak, [usekne_hlavu]))
  if puvodni_ocasy > 0:
    fronta.append((puvodni_drak, [usekne_ocas]))
  if puvodni_hlavy > 1:
    fronta.append((puvodni_drak, [usekne_dve_hlavy]))
  if puvodni_ocasy > 1:
    fronta.append((puvodni_drak, [usekne_dva_ocasy]))

  # opakuju dokud neprojdu vsechnny moznosti
  while fronta:
    # vezmu z fronty stav prvniho draka a seznam seknuti
    drak, seknuti = fronta.pop(0)
    krok = len(seknuti)

    # pokud jsem prekrocil pocet kroku, koncim neuspesne
    if krok > max_kroku:
      print("{} seknuti vycerpano".format(max_kroku))
      return False

    # vezmu si ze seznamu aktualni seknuti
    sekam = seknuti[-1]
    # seknu a ziskam noveho draka
    novy_drak = sekam(drak)
    hlavy, ocasy = novy_drak

    # pokud nema hlavu ani ocas, vyhral jsem
    if hlavy == 0 and ocasy == 0:
      print("hotovo: krok {}: {}".format(krok, seknuti))
      # kdyz tohle zakomentuju, neskoncim a vygeneruju tim i zbytek reseni
      # return True

    # jestli nekoncim, zkousim dalsi moznosti sekani
    if hlavy > 0:
      fronta.append((novy_drak, seknuti + [usekne_hlavu]))
    if ocasy > 0:
      fronta.append((novy_drak, seknuti + [usekne_ocas]))
    if hlavy > 1:
      fronta.append((novy_drak, seknuti + [usekne_dve_hlavy]))
    if ocasy > 1:
      fronta.append((novy_drak, seknuti + [usekne_dva_ocasy]))

# jdem na draka!

# drak je reprezentovany dvojici (pocet hlav, pocet ocasu)
drak = (3,3)
max_kroku = 10

bfs(drak)