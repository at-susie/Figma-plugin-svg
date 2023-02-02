figma.showUI(__html__);

figma.ui.onmessage = async (event) => {
  const selection = figma.currentPage.selection;
  if (event.type === "request:loadSvg") {
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
      return defaultLabel.replace(idLabel, "className=");
    }).catch((e) => e);
  } catch (err) {
    return err
  }
} 