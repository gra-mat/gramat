export const GeometryBranch = {
  id: 'geometry',
  label: 'Geometria',
  children: {
    plane: {
      id: 'geo_plane',
      label: 'Figury Płaskie (Planimetria)',
      children: {
        triangles: { id: 'geo_tri', label: 'Trójkąty' },
        quadrilaterals: { id: 'geo_quad', label: 'Czworokąty' },
        circles: { id: 'geo_circ', label: 'Koła i Okręgi' }
      }
    },
    solid: {
      id: 'geo_solid',
      label: 'Bryły (Stereometria)',
      children: {
        prisms: { id: 'geo_prism', label: 'Graniastosłupy' },
        pyramids: { id: 'geo_pyramid', label: 'Ostrosłupy' }
      }
    }
  }
};