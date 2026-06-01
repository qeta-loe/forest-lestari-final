import { kml } from "@tmcw/togeojson"

export type LatLngPoint = {
  lat: number
  lng: number
}

export const parseKMLFile = async (
  file: File
): Promise<LatLngPoint[]> => {
  const text = await file.text()

  const parser = new DOMParser()
  const xml = parser.parseFromString(text, "text/xml")

  const geojson = kml(xml)

  const result: LatLngPoint[] = []

  geojson.features.forEach((feature: any) => {
    const geometry = feature.geometry

    if (!geometry) return

    if (geometry.type === "Point") {
      const [lng, lat] = geometry.coordinates
      result.push({ lat, lng })
    }

    if (geometry.type === "Polygon") {
      const ring = geometry.coordinates[0]

      ring.forEach(([lng, lat]: number[]) => {
        result.push({ lat, lng })
      })
    }

    if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((polygon: any) => {
        polygon[0].forEach(([lng, lat]: number[]) => {
          result.push({ lat, lng })
        })
      })
    }
  })

  return result
}