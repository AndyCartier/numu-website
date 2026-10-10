import type { ShippingClass } from './catalogue'

export const GCC_COUNTRIES = ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman'] as const
export type GCCCountry = typeof GCC_COUNTRIES[number]
export type ShippingMethod = 'delivery' | 'pickup'

// Enter courier-approved AED fils here. Undefined is intentionally unavailable, never free.
export const MANUAL_SHIPPING_RATES: Partial<Record<GCCCountry, Partial<Record<ShippingClass, number>>>> = {
  'United Arab Emirates': {}, 'Saudi Arabia': {}, Qatar: {}, Kuwait: {}, Bahrain: {}, Oman: {},
}
// Never reaches production. These values are strictly for exercising the local review fixture.
if (process.env.NODE_ENV === 'development') {
  MANUAL_SHIPPING_RATES['United Arab Emirates'] = { small_parcel: 12000 }
  MANUAL_SHIPPING_RATES['Saudi Arabia'] = { small_parcel: 18000 }
  MANUAL_SHIPPING_RATES.Qatar = { small_parcel: 18000 }
  MANUAL_SHIPPING_RATES.Kuwait = { small_parcel: 18000 }
  MANUAL_SHIPPING_RATES.Bahrain = { small_parcel: 18000 }
  MANUAL_SHIPPING_RATES.Oman = { small_parcel: 18000 }
}
export const PICKUP_LOCATION = process.env.NEXT_PUBLIC_NUMU_PICKUP_LOCATION || ''

export function shippingRate(country: GCCCountry, shippingClass: ShippingClass) { return MANUAL_SHIPPING_RATES[country]?.[shippingClass] }
