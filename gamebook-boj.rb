#!/usr/bin/ruby

class Nestvura
  #attr_accessor :umeni_boje, :stamina
  def initialize(umeni_boje, stamina)
    @umeni_boje = umeni_boje
    @stamina = stamina
  end

  def mrtva()
    return @stamina <= 0
  end

  def uber_staminu(ztrata)
    @stamina -= ztrata
  end

  def zasah()
    uber_staminu(2)
  end

  def utok()
    prvni = rand(1..6)
    druhe = rand(1..6)
    #puts "#{nestvura.umeni_boje} #{prvni} #{druhe}"
    return @umeni_boje + prvni + druhe
  end

  def bojuj_s(nestvura)
    #TODO: zkontrolovat jestli stamina neni <= 0
    # posunout test na smrt na zacatek?
    while true
      ja_utok = self.utok()
      nestvura_utok = nestvura.utok()

      if ja_utok < nestvura_utok
        self.zasah()
        #puts "ja: #{ja_utok} < nestvura: #{nestvura_utok}"
        #puts "ja: #{ja}"
        if self.mrtva()
          return false
        end
      elsif ja_utok > nestvura_utok # nestvura prohrala
        nestvura.zasah()
        #puts "ja: #{ja_utok} > nestvura: #{nestvura_utok}"
        #puts "nestvura: #{nestvura}"
        if nestvura.mrtva()
          return true
        end
      else # maji stejne
      end
    end
  end
end

# test
def test(ja, nestvura)
  ja = Nestvura.new(11,18)
  nestvura = Nestvura.new(10,30)

  return ja.bojuj_s(nestvura)
end

ja_vyhra = 0
nestvura_vyhra = 0
kolikrat = 100

kolikrat.times do
  ja = Nestvura.new(ARGV[0].to_i, ARGV[1].to_i)
  nestvura = Nestvura.new(ARGV[2].to_i, ARGV[3].to_i)

  if ja.bojuj_s(nestvura)
    ja_vyhra += 1
    #puts "ja vyhral"
  else
    nestvura_vyhra += 1
    #puts "nestvura vyhrala"
  end
end

puts "Šance: #{ja_vyhra * 100.0 / kolikrat}%"
