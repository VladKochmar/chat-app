export function calcPosition(clickX: number, clickY: number) {
  const windowX = window.innerWidth
  const windowY = window.innerHeight

  const menuWidht = 160
  const menuHeight = 80

  let posX = clickX
  let posY = clickY

  if (clickX + menuWidht > windowX) {
    posX = windowX - menuWidht - 8
  }
  if (clickY + menuHeight > windowY) {
    posY = windowY - menuHeight - 8
  }

  return { posX, posY }
}
