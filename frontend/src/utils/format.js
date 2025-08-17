// Простая утилита для сокращения адреса блокчейна, отображая только его первые 8 символов
export function shortenAddress (address) {
  if (!address) return ''
  return address.slice(0, 8)
}