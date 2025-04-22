// tesloApiHelper.ts
// Este archivo es solo para pruebas, permite crear la API_URL con parámetros específicos

/**
 * Función que simula exactamente la lógica de determinación de API_URL en tesloApi.ts
 */
export function getApiUrl(
  stage: string,
  platformOS: string,
  prodUrl: string,
  iosUrl: string,
  androidUrl: string
): string {
  return stage === 'prod'
    ? prodUrl
    : platformOS === 'ios'
    ? iosUrl
    : androidUrl;
}