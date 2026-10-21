const characterMap: Record<string, string> = {
  Ç: 'C',
  Ö: 'O',
  Ü: 'U',
  ç: 'c',
  ö: 'o',
  ü: 'u',
  Ğ: 'G',
  ğ: 'g',
  İ: 'I',
  ı: 'i',
  Ş: 'S',
  ş: 's',
}

export const toAscii = (content: string) => {
  const characters = content.split('')

  for (let index = 0; index < content.length; index++) {
    const character = content[index]

    if (character) {
      const eq = characterMap[character]
      characters[index] = eq ?? character
    }
  }

  return characters.join('')
}
