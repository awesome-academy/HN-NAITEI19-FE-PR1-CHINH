const navbar = document.querySelector('nav')

window.addEventListener('scroll', () => {
  let y = (window.scrollY || window.pageYOffset)
  y = y < 1 ? 0 : y
  const alpha = y/150
  navbar.style.backgroundColor = (y < 1 ? 'transparent' : `rgba(255, 255, 255, ${alpha})`)
})