const characterMap: Record<string, string> = {
  Ç: 'C',
  Ö: 'O',
  Ş: 'S',
  İ: 'I',
  Ü: 'U',
  Ğ: 'G',
  ç: 'c',
  ö: 'o',
  ş: 's',
  ı: 'i',
  ü: 'u',
  ğ: 'g',
}

export const toAscii = (content: string) => {
  const characters = content.split('')
  for (let index = 0; index < content.length; index++) {
    const character = content[index]
    if (!character) continue

    const eq = characterMap[character]
    if (!eq) {
      characters[index] = character
    } else {
      characters[index] = eq
    }
  }

  return characters.join('')
}
