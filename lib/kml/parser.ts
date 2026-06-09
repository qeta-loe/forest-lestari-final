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

  const addPoint = (coord: number[]) => {
    const lng = coord[0]
    const lat = coord[1]

    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !isNaN(lat) &&
      !isNaN(lng)
    ) {
      result.push({
        lat,
        lng,
      })
    }
  }

  const parseGeometry = (geometry: any) => {
    if (!geometry) return

    if (geometry.type === "Point") {
      addPoint(geometry.coordinates)
    }

    if (geometry.type === "MultiPoint") {
      geometry.coordinates.forEach((coord: number[]) => {
        addPoint(coord)
      })
    }

    if (geometry.type === "LineString") {
      geometry.coordinates.forEach((coord: number[]) => {
        addPoint(coord)
      })
    }

    if (geometry.type === "MultiLineString") {
      geometry.coordinates.forEach((line: number[][]) => {
        line.forEach((coord: number[]) => {
          addPoint(coord)
        })
      })
    }

    if (geometry.type === "Polygon") {
      const ring = geometry.coordinates[0]

      ring.forEach((coord: number[]) => {
        addPoint(coord)
      })
    }

    if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((polygon: number[][][]) => {
        polygon[0].forEach((coord: number[]) => {
          addPoint(coord)
        })
      })
    }

    if (geometry.type === "GeometryCollection") {
      geometry.geometries.forEach((item: any) => {
        parseGeometry(item)
      })
    }
  }

  geojson.features.forEach((feature: any) => {
    parseGeometry(feature.geometry)
  })

  return result
}