export default function fitWindow(
  windowWidth: number,
  windowHeight: number,
  imageWidth: number,
  imageHeight: number
) {
  const aspectRatio = imageWidth / imageHeight;
  const widthToFitWindow = windowHeight * aspectRatio;
  const width = widthToFitWindow > windowWidth ? windowWidth : widthToFitWindow;
  const height = width / aspectRatio;
  return { width, height };
}
