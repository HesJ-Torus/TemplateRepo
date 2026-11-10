// Turns a title like "Doors & Windows" into a web-address-friendly id: "doors-windows".
// Used so the header dropdown can link straight to one service (#service-doors-windows).
export function serviceId(title, index) {
  const slug = String(title ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `service-${slug || index + 1}`;
}
