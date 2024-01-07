#/usr/bin/ruby

# Uloha: Princ ma zabit draka na 10 utoku.
# Drak ma na zacatku 3 hlavy a 3 ocasy. Zahyne, pokud nema hlavu ani ocas.
# Mozne utoky jsou:
# 1) setnout hlavu, ale hned doroste
# 2) setnout dve hlavy
# 3) useknout ocas, dorostou dva nove
# 4) useknout dva ocasy, doroste hlava

# drak je reprezentovany dvojici (pocet hlav, pocet ocasu)
class Drak
  attr_accessor :hlav, :ocasu
  def initialize(hlav, ocasu)
    @hlav = hlav
    @ocasu = ocasu
  end

  def to_s()
    "hlav: #{@hlav}, ocasu: #{@ocasu}"
  end
  
  # drak je mrtev kdyz nema hlavu ani ocas
  def mrtev()
    return @hlav == 0 && @ocasu == 0
  end

  # useknuta hlava hned doroste
  def setni_hlavu()
  end

  # misto usekleho ocasu dorostou dva nove
  def usekni_ocas()
    @ocasu += 1
  end
  
  def setni_dve_hlavy()
    @hlav -= 2
  end
  
  # po useknuti dvou ocasu doroste hlava
  def usekni_dva_ocasy()
    @ocasu -= 2
    @hlav += 1
  end
end

def pridej_seknuti(drak, fronta, seznam_seknuti)
  if drak.hlav > 0
    fronta << [drak.dup(), seznam_seknuti + ["hlava"]]
  end
  if drak.ocasu > 0
    fronta << [drak.dup(), seznam_seknuti + ["ocas"]]
  end
  if drak.hlav > 1
    fronta << [drak.dup(), seznam_seknuti + ["dve hlavy"]]
  end
  if drak.ocasu > 1
    fronta << [drak.dup(), seznam_seknuti + ["dva ocasy"]]
  end
end

# Pruchod do sirky prostorem stavu vyzkousi vsechny moznosti
def bfs(drak)
  # fronta na ukladani stavu k projiti
  # vkladam do ni aktualniho draka a seznam seknuti kterym jsem ho vytvoril
  fronta = Array.new
  
  # pridam vsechny mozne seknuti v prvnim kroku
  pridej_seknuti(drak, fronta, [])

  # opakuju dokud neprojdu vsechnny moznosti
  while not fronta.empty?()
    #puts "fronta: #{fronta}"
    # vezmu z fronty stav prvniho draka a seznam seknuti
    drak, seznam_seknuti = fronta.shift()
    krok = seznam_seknuti.size
    #puts "krok: #{krok}"
    #puts "#{seznam_seknuti} -> #{drak}"

    # pokud jsem prekrocil pocet kroku, koncim neuspesne
    if krok > MAX_KROKU
      puts "#{MAX_KROKU} seknuti vycerpano: #{seznam_seknuti} -> #{drak}"
      return false
    end

    # vezmu si ze seznamu aktualni seknuti
    aktualni_seknuti = seznam_seknuti.last()

    # seknu a ziskam noveho draka
    case aktualni_seknuti
    when "hlava"
      drak.setni_hlavu()
    when "ocas"
      drak.usekni_ocas()
    when "dve hlavy"
      drak.setni_dve_hlavy()
    when "dva ocasy"
      drak.usekni_dva_ocasy()
    else
      puts "Zakazane seknuti"
      return false
    end

    # pokud nema hlavu ani ocas, vyhral jsem
    if drak.mrtev()
      puts "hotovo: krok #{krok}: #{seznam_seknuti}"
      # kdyz tohle zakomentuju, neskoncim a vygeneruju tim i zbytek reseni
      return true
    end

    # jestli nekoncim, zkousim dalsi moznosti sekani
    pridej_seknuti(drak, fronta, seznam_seknuti)
  end
end

# jdem na draka!
MAX_KROKU = 10
drak = Drak.new(3,3)
bfs(drak)
