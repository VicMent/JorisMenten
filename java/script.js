const content = document.querySelector('.content');
const bgImage = document.querySelector('.bg-image');

document.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;

  // Calculate percentages of cursor position relative to the window size
  const xPos = (clientX / window.innerWidth) - 0.5;
  const yPos = (clientY / window.innerHeight) - 0.5;

  // Adjust the background image and text position slightly
  bgImage.style.transform = `translate(${xPos * 20}px, ${yPos * 20}px)`;
  content.style.transform = `translate(${xPos * 10}px, ${yPos * 10}px)`;
});
