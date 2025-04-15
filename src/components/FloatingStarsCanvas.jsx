import { useEffect, useRef } from 'react'

const getRandomColor = () => {
    const colors = [
        '#FFA500', // Orange
        '#FF6347', // Tomato
        '#FF8C00', // DarkOrange
      ]
  return colors[Math.floor(Math.random() * colors.length)]
}

const FloatingStarsCanvas = ({ starCount = 30 }) => {
  const canvasRef = useRef()
  const mouseRef = useRef({ x: -1000, y: -1000 }) // başlangıçta çok uzakta

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 4 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
      color: getRandomColor()
    }))

    const distance = (x1, y1, x2, y2) =>
      Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((star) => {
        // Fareden kaç
        const dist = distance(star.x, star.y, mouseRef.current.x, mouseRef.current.y)
        if (dist < 100) {
          const angle = Math.atan2(star.y - mouseRef.current.y, star.x - mouseRef.current.x)
          const escapeSpeed = 2
          star.dx += Math.cos(angle) * escapeSpeed * 0.05
          star.dy += Math.sin(angle) * escapeSpeed * 0.05
        }

        // Bounce
        if (star.x + star.dx > canvas.width || star.x + star.dx < 0) star.dx *= -1
        if (star.y + star.dy > canvas.height || star.y + star.dy < 0) star.dy *= -1

        // Hareket
        star.x += star.dx
        star.y += star.dy


        // Çiz
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.fill()
      })
      requestAnimationFrame(update)
    }

    update()

    // Mouse pozisyonu güncelle
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [starCount])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-auto h-auto z-0 pointer-events-none"
    />
  )
}

export default FloatingStarsCanvas
