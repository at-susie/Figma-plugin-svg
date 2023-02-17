
figma.showUI(
  (__html__),
  { width: 480, height: 480, title: "SVG Generator" }
)

figma.ui.onmessage = async (event) => {
  const selection = figma.currentPage.selection;
  if (event.type === "request:copySvg") {
    const imageObj = await getArtwork(selection);
    figma.ui.postMessage({
      selection: imageObj || "",
      type: "response:svg",
    })
  }
  if (event.type === "request:setSvg") {
    const selection = figma.currentPage.selection["0"];
    const svg = event.svg;
    const { x, y } = selection;

    if (svg) {
      selection.remove();

      const node = figma.createNodeFromSvg(svg);
      node.x = x;
      node.y = y;
    }
    return
  }
};


const getArtwork = async (selected) => {
  var idLabel = /id=/gi;
  if (!selected) return;
  if (selected.length > 1) {
    return "If you wish to make an SVG from these nodes, try grouping them first";
  }
  try {
    return selected["0"].exportAsync({ format: "SVG", svgIdAttribute: true }).then((data) => {
      const defaultLabel = String.fromCharCode.apply(null, data);
      const svgString = defaultLabel.replace(idLabel, "class=").replace(/(class="[^"]*)_[0-9]*(")/g, "$1$2").replace(/(class="[^"]*?)\/(.*?")/g, (match, p1, p2) => {
        return p1 + ' ' + p2.replace(/\//g, ' ');
      });
      return svgString;
    }).catch((e) => e);
  } catch (err) {
    return err
  }
}