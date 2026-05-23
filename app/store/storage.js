import Cookies from 'js-cookie'

export const getCookieJson = (key, fallback) => {
  try {
    const value = Cookies.get(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    Cookies.remove(key)
    return fallback
  }
}

export const getCookieNumber = (key, fallback) => {
  const value = Number(Cookies.get(key))
  return Number.isFinite(value) && value > 0 ? value : fallback
}

export const getCookieDate = (key, fallback = new Date()) => {
  const date = new Date(Cookies.get(key))
  return Number.isNaN(date.getTime()) ? fallback : date
}

export const getCookieString = (key, fallback, allowedValues) => {
  const value = Cookies.get(key)
  if (!value) return fallback
  return allowedValues?.includes(value) ? value : fallback
}

