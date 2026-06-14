import { useState, useEffect } from 'react'

const DEMO_TESTIMONIALS = [
  { _id: 't1', name: 'Valentina M.', city: 'Medellín',     rating: 5, initials: 'VM', product: 'Manta Personalizada', visible: true,
    text: 'Pedí una manta personalizada para el baby shower de mi hermana y quedó absolutamente preciosa. Isamar le puso el nombre del bebé bordado y los colores que pedimos. Todos los invitados preguntaron dónde la conseguimos.' },
  { _id: 't2', name: 'Carolina R.',  city: 'Bogotá',       rating: 5, initials: 'CR', product: 'Ruana Borgoña',       visible: true,
    text: 'La ruana que compré es de una calidad increíble. Se nota que cada punto está hecho con amor. Ya la he lavado varias veces y sigue perfecta.' },
  { _id: 't3', name: 'Daniela P.',   city: 'Cali',         rating: 5, initials: 'DP', product: 'Bolso Tejido Camel',  visible: true,
    text: 'El bolso tejido es mi favorito del momento. Lo combino con todo y siempre me preguntan dónde lo compré.' },
  { _id: 't4', name: 'Mariana L.',   city: 'Barranquilla', rating: 5, initials: 'ML', product: 'Set Regalo Bebé',     visible: true,
    text: 'Le regalé el set de bebé a mi mejor amiga y lloró de la emoción. La manta es suavísima y el gorro es una monada.' },
  { _id: 't5', name: 'Sofía T.',     city: 'Pereira',      rating: 5, initials: 'ST', product: 'Diadema Floral',      visible: true,
    text: 'Compré la diadema floral y es exactamente como en las fotos, incluso más linda en persona. El tejido es muy fino y delicado.' },
]

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    setTimeout(() => { setTestimonials(DEMO_TESTIMONIALS); setLoading(false) }, 400)
  }, [])

  return { testimonials, loading }
}
